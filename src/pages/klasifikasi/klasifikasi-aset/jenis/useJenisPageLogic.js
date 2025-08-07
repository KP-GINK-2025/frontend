// src/pages/klasifikasi/klasifikasi-aset/jenis/useJenisPageLogic.js
import { useState, useEffect } from "react";
import {
  getJenises,
  createJenis,
  updateJenis,
  deleteJenis,
  getAkunOptions,
  getKelompokByAkun,
} from "../../../../api/service/klasifikasiAsetService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useJenisPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [jenisData, setJenisData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // State untuk Filter & Pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // State untuk Kondisi UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedAkun, setSelectedAkun] = useState("");
  const [akunList, setAkunList] = useState([]);
  const [loadingAkun, setLoadingAkun] = useState(false);
  const [selectedKelompok, setSelectedKelompok] = useState("");
  const [kelompokList, setKelompokList] = useState([]);
  const [loadingKelompok, setLoadingKelompok] = useState(false);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJenis, setEditingJenis] = useState(null);

  // Debounce untuk input pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearchTerm, selectedAkun, selectedKelompok]);

  // Fetch daftar akun untuk filter
  useEffect(() => {
    const fetchAkunList = async () => {
      setLoadingAkun(true);
      try {
        const res = await getAkunOptions();
        setAkunList(res); // Service sudah melakukan sorting/mapping jika perlu
      } catch (error) {
        console.error("Gagal mendapatkan akun list:", error);
      } finally {
        setLoadingAkun(false);
      }
    };
    fetchAkunList();
  }, []);

  // Fetch daftar kelompok untuk filter
  useEffect(() => {
    if (!selectedAkun) {
      setKelompokList([]);
      return;
    }
    const fetchKelompokList = async () => {
      setLoadingKelompok(true);
      try {
        const res = await getKelompokByAkun(selectedAkun);
        setKelompokList(res);
      } catch (error) {
        console.error("Gagal mendapatkan kelompok list:", error);
        setKelompokList([]);
      } finally {
        setLoadingKelompok(false);
      }
    };
    fetchKelompokList();
  }, [selectedAkun]);

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchJenisData = async () => {
      setLoading(true);
      if (refreshTrigger > 0) setRefreshing(true);
      try {
        const params = {
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
          search: debouncedSearchTerm,
          akun_aset_id: selectedAkun,
          kelompok_aset_id: selectedKelompok,
        };
        const res = await getJenises(params);
        setJenisData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setJenisData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchJenisData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedAkun,
    selectedKelompok,
    refreshTrigger,
  ]);

  // Handler untuk modal
  const handleOpenModal = (jenis = null) => {
    setEditingJenis(jenis);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJenis(null);
  };

  // Handler untuk aksi
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setRefreshTrigger((prev) => prev + 1);
      // Menunggu fetch data selesai (dideteksi dari useEffect)
      // dan memberi sedikit jeda agar user merasakan proses refresh
      await new Promise((resolve) => setTimeout(resolve, 500));
      showSuccessToast("Data berhasil dimuat ulang");
    } catch (err) {
      showErrorToast("Gagal memuat ulang data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSaveJenis = async (jenisToSave) => {
    try {
      if (jenisToSave.id) {
        await updateJenis(jenisToSave.id, jenisToSave);
      } else {
        await createJenis(jenisToSave);
      }
      showSuccessToast("Data jenis berhasil disimpan");
      handleRefresh();
      handleCloseModal();
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menyimpan data";

      showErrorAlert(errorMessages);
      throw err; // Tetap lempar error agar modal tahu prosesnya gagal
    }
  };

  const handleDeleteJenis = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteJenis(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus jenis:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getJenises({
        per_page: totalRows,
        search: debouncedSearchTerm,
        akun_aset_id: selectedAkun,
        kelompok_aset_id: selectedKelompok,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "akun_aset",
        headerName: "Akun",
        formatter: (_, item) =>
          item.kelompok_aset?.akun_aset
            ? `${item.kelompok_aset.akun_aset.kode_akun_aset} - ${item.kelompok_aset.akun_aset.nama_akun_aset}`
            : "N/A",
      },
      {
        field: "kelompok_aset",
        headerName: "Kelompok",
        formatter: (_, item) =>
          item.kelompok_aset
            ? `${item.kelompok_aset.kode_kelompok_aset} - ${item.kelompok_aset.nama_kelompok_aset}`
            : "N/A",
      },

      { field: "kode_jenis_aset", headerName: "Kode Jenis" },
      { field: "nama_jenis_aset", headerName: "Nama Jenis" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-jenis-aset",
      sheetName: "Data Jenis",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      jenisData,
      totalRows,
      paginationModel,
      searchTerm,
      selectedAkun,
      akunList,
      loadingAkun,
      selectedKelompok,
      kelompokList,
      loadingKelompok,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingJenis,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      setSelectedAkun,
      setSelectedKelompok,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveJenis,
      handleDeleteJenis,
    },
  };
};
