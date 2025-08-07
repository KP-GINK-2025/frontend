// src/pages/klasifikasi/klasifikasi-aset/objek/useObjekPageLogic.js
import { useState, useEffect } from "react";
import {
  getObjeks,
  createObjek,
  updateObjek,
  deleteObjek,
  getAkunOptions,
  getKelompokByAkun,
  getJenisByKelompok,
} from "../../../../api/service/klasifikasiAsetService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useObjekPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [objekData, setObjekData] = useState([]);
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
  const [selectedJenis, setSelectedJenis] = useState("");
  const [jenisList, setJenisList] = useState([]);
  const [loadingJenis, setLoadingJenis] = useState(false);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjek, setEditingObjek] = useState(null);

  // Debounce untuk input pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearchTerm, selectedAkun, selectedKelompok, selectedJenis]);

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

  // Fetch daftar jenis untuk filter
  useEffect(() => {
    if (!selectedKelompok) {
      setJenisList([]);
      return;
    }
    const fetchJenisList = async () => {
      setLoadingJenis(true);
      try {
        const res = await getJenisByKelompok(selectedKelompok);
        setJenisList(res);
      } catch (error) {
        console.error("Gagal mendapatkan jenis list:", error);
        setJenisList([]);
      } finally {
        setLoadingJenis(false);
      }
    };
    fetchJenisList();
  }, [selectedKelompok]);

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchObjekData = async () => {
      setLoading(true);
      if (refreshTrigger > 0) setRefreshing(true);
      try {
        const params = {
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
          search: debouncedSearchTerm,
          akun_aset_id: selectedAkun,
          kelompok_aset_id: selectedKelompok,
          jenis_aset_id: selectedJenis,
        };
        const res = await getObjeks(params);
        setObjekData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setObjekData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchObjekData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedAkun,
    selectedKelompok,
    selectedJenis,
    refreshTrigger,
  ]);

  // Handler untuk modal
  const handleOpenModal = (objek = null) => {
    setEditingObjek(objek);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingObjek(null);
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

  const handleSaveObjek = async (objekToSave) => {
    try {
      if (objekToSave.id) {
        await updateObjek(objekToSave.id, objekToSave);
      } else {
        await createObjek(objekToSave);
      }
      showSuccessToast("Data objek berhasil disimpan");
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

  const handleDeleteObjek = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteObjek(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus objek:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getObjeks({
        per_page: totalRows,
        search: debouncedSearchTerm,
        akun_aset_id: selectedAkun,
        kelompok_aset_id: selectedKelompok,
        jenis_aset_id: selectedJenis,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "akun_aset",
        headerName: "Akun",
        formatter: (_, item) =>
          item.jenis_aset?.kelompok_aset?.akun_aset
            ? `${item.jenis_aset.kelompok_aset.akun_aset.kode_akun_aset} - ${item.jenis_aset.kelompok_aset.akun_aset.nama_akun_aset}`
            : "N/A",
      },
      {
        field: "kelompok_aset",
        headerName: "Kelompok",
        formatter: (_, item) =>
          item.jenis_aset?.kelompok_aset
            ? `${item.jenis_aset.kelompok_aset.kode_kelompok_aset} - ${item.jenis_aset.kelompok_aset.nama_kelompok_aset}`
            : "N/A",
      },
      {
        field: "jenis_aset",
        headerName: "Jenis",
        formatter: (_, item) =>
          item.jenis_aset
            ? `${item.jenis_aset.kode_jenis_aset} - ${item.jenis_aset.nama_jenis_aset}`
            : "N/A",
      },

      { field: "kode_objek_aset", headerName: "Kode Objek" },
      { field: "nama_objek_aset", headerName: "Nama Objek" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-objek-aset",
      sheetName: "Data Objek",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      objekData,
      totalRows,
      paginationModel,
      searchTerm,
      selectedAkun,
      akunList,
      loadingAkun,
      selectedKelompok,
      kelompokList,
      loadingKelompok,
      selectedJenis,
      jenisList,
      loadingJenis,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingObjek,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      setSelectedAkun,
      setSelectedKelompok,
      setSelectedJenis,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveObjek,
      handleDeleteObjek,
    },
  };
};
