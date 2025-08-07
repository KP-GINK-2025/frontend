// src/pages/klasifikasi/klasifikasi-aset/sub-rincian/useSubRincianPageLogic.js
import { useState, useEffect } from "react";
import {
  getSubRincians,
  createSubRincian,
  updateSubRincian,
  deleteSubRincian,
  getAkunOptions,
  getKelompokByAkun,
  getJenisByKelompok,
  getObjekByJenis,
  getRincianObjekByObjek,
} from "../../../../api/service/klasifikasiAsetService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useSubRincianPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [subRincianData, setSubRincianData] = useState([]);
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
  const [selectedObjek, setSelectedObjek] = useState("");
  const [objekList, setObjekList] = useState([]);
  const [loadingObjek, setLoadingObjek] = useState(false);
  const [selectedRincianObjek, setSelectedRincianObjek] = useState("");
  const [rincianObjekList, setRincianObjekList] = useState([]);
  const [loadingRincianObjek, setLoadingRincianObjek] = useState(false);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubRincian, setEditingSubRincian] = useState(null);

  // Debounce untuk input pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [
    debouncedSearchTerm,
    selectedAkun,
    selectedKelompok,
    selectedJenis,
    selectedObjek,
    selectedRincianObjek,
  ]);

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

  // Fetch daftar objek untuk filter
  useEffect(() => {
    if (!selectedJenis) {
      setObjekList([]);
      return;
    }
    const fetchObjekList = async () => {
      setLoadingObjek(true);
      try {
        const res = await getObjekByJenis(selectedJenis);
        setObjekList(res);
      } catch (error) {
        console.error("Gagal mendapatkan objek list:", error);
        setObjekList([]);
      } finally {
        setLoadingObjek(false);
      }
    };
    fetchObjekList();
  }, [selectedJenis]);

  // Fetch daftar rincian objek untuk filter
  useEffect(() => {
    if (!selectedObjek) {
      setRincianObjekList([]);
      return;
    }
    const fetchRincianObjekList = async () => {
      setLoadingRincianObjek(true);
      try {
        const res = await getRincianObjekByObjek(selectedObjek);
        setRincianObjekList(res);
      } catch (error) {
        console.error("Gagal mendapatkan rincian objek list:", error);
        setRincianObjekList([]);
      } finally {
        setLoadingRincianObjek(false);
      }
    };
    fetchRincianObjekList();
  }, [selectedObjek]);

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchSubRincianData = async () => {
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
          objek_aset_id: selectedObjek,
          rincian_objek_aset_id: selectedRincianObjek,
        };
        const res = await getSubRincians(params);
        setSubRincianData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setSubRincianData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchSubRincianData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedAkun,
    selectedKelompok,
    selectedJenis,
    selectedObjek,
    selectedRincianObjek,
    refreshTrigger,
  ]);

  // Handler untuk modal
  const handleOpenModal = (subRincian = null) => {
    setEditingSubRincian(subRincian);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubRincian(null);
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

  const handleSaveSubRincian = async (subRincianToSave) => {
    try {
      if (subRincianToSave.id) {
        await updateSubRincian(subRincianToSave.id, subRincianToSave);
      } else {
        await createSubRincian(subRincianToSave);
      }
      showSuccessToast("Data sub rincian berhasil disimpan");
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

  const handleDeleteSubRincian = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteSubRincian(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus sub rincian:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getSubRincians({
        per_page: totalRows,
        search: debouncedSearchTerm,
        akun_aset_id: selectedAkun,
        kelompok_aset_id: selectedKelompok,
        jenis_aset_id: selectedJenis,
        objek_aset_id: selectedObjek,
        rincian_objek_aset_id: selectedRincianObjek,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "akun_aset",
        headerName: "Akun",
        formatter: (_, item) =>
          item.rincian_objek_aset?.objek_aset?.jenis_aset?.kelompok_aset
            ?.akun_aset
            ? `${item.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.akun_aset.kode_akun_aset} - ${item.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.akun_aset.nama_akun_aset}`
            : "N/A",
      },
      {
        field: "kelompok_aset",
        headerName: "Kelompok",
        formatter: (_, item) =>
          item.rincian_objek_aset?.objek_aset?.jenis_aset?.kelompok_aset
            ? `${item.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.kode_kelompok_aset} - ${item.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.nama_kelompok_aset}`
            : "N/A",
      },
      {
        field: "jenis_aset",
        headerName: "Jenis",
        formatter: (_, item) =>
          item.rincian_objek_aset?.objek_aset?.jenis_aset
            ? `${item.rincian_objek_aset.objek_aset.jenis_aset.kode_jenis_aset} - ${item.rincian_objek_aset.objek_aset.jenis_aset.nama_jenis_aset}`
            : "N/A",
      },
      {
        field: "objek_aset",
        headerName: "Objek",
        formatter: (_, item) =>
          item.rincian_objek_aset?.objek_aset
            ? `${item.rincian_objek_aset.objek_aset.kode_objek_aset} - ${item.rincian_objek_aset.objek_aset.nama_objek_aset}`
            : "N/A",
      },
      {
        field: "rincian_objek_aset",
        headerName: "Rincian Objek",
        formatter: (_, item) =>
          item.rincian_objek_aset
            ? `${item.rincian_objek_aset.kode_rincian_objek_aset} - ${item.rincian_objek_aset.nama_rincian_objek_aset}`
            : "N/A",
      },

      { field: "kode_sub_rincian_aset", headerName: "Kode Sub Rincian" },
      { field: "nama_sub_rincian_aset", headerName: "Nama Sub Rincian" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-sub-rincian-aset",
      sheetName: "Data Sub Rincian",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      subRincianData,
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
      selectedObjek,
      objekList,
      loadingObjek,
      selectedRincianObjek,
      rincianObjekList,
      loadingRincianObjek,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingSubRincian,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      setSelectedAkun,
      setSelectedKelompok,
      setSelectedJenis,
      setSelectedObjek,
      setSelectedRincianObjek,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveSubRincian,
      handleDeleteSubRincian,
    },
  };
};
