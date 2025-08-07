// src/pages/klasifikasi/klasifikasi-aset/sub-sub-rincian/useSubSubRincianPageLogic.js
import { useState, useEffect } from "react";
import {
  getSubSubRincians,
  createSubSubRincian,
  updateSubSubRincian,
  deleteSubSubRincian,
  getAkunOptions,
  getKelompokByAkun,
  getJenisByKelompok,
  getObjekByJenis,
  getRincianObjekByObjek,
  getSubRincianByRincianObjek,
} from "../../../../api/service/klasifikasiAsetService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useSubSubRincianPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [subSubRincianData, setSubSubRincianData] = useState([]);
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
  const [selectedSubRincian, setSelectedSubRincian] = useState("");
  const [subRincianList, setSubRincianList] = useState([]);
  const [loadingSubRincian, setLoadingSubRincian] = useState(false);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubSubRincian, setEditingSubSubRincian] = useState(null);

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
    selectedSubRincian,
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

  // Fetch daftar sub rincian untuk filter
  useEffect(() => {
    if (!selectedRincianObjek) {
      setSubRincianList([]);
      return;
    }
    const fetchSubRincianList = async () => {
      setLoadingSubRincian(true);
      try {
        const res = await getSubRincianByRincianObjek(selectedRincianObjek);
        setSubRincianList(res);
      } catch (error) {
        console.error("Gagal mendapatkan sub rincian list:", error);
        setSubRincianList([]);
      } finally {
        setLoadingSubRincian(false);
      }
    };
    fetchSubRincianList();
  }, [selectedRincianObjek]);

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchSubSubRincianData = async () => {
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
          sub_rincian_aset_id: selectedSubRincian,
        };
        const res = await getSubSubRincians(params);
        setSubSubRincianData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setSubSubRincianData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchSubSubRincianData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedAkun,
    selectedKelompok,
    selectedJenis,
    selectedObjek,
    selectedRincianObjek,
    selectedSubRincian,
    refreshTrigger,
  ]);

  // Handler untuk modal
  const handleOpenModal = (subSubRincian = null) => {
    setEditingSubSubRincian(subSubRincian);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubSubRincian(null);
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

  const handleSaveSubSubRincian = async (subSubRincianToSave) => {
    try {
      if (subSubRincianToSave.id) {
        await updateSubSubRincian(subSubRincianToSave.id, subSubRincianToSave);
      } else {
        await createSubSubRincian(subSubRincianToSave);
      }
      showSuccessToast("Data sub sub rincian berhasil disimpan");
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

  const handleDeleteSubSubRincian = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteSubSubRincian(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus sub sub rincian:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getSubSubRincians({
        per_page: totalRows,
        search: debouncedSearchTerm,
        akun_aset_id: selectedAkun,
        kelompok_aset_id: selectedKelompok,
        jenis_aset_id: selectedJenis,
        objek_aset_id: selectedObjek,
        rincian_objek_aset_id: selectedRincianObjek,
        sub_rincian_aset_id: selectedSubRincian,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "akun_aset",
        headerName: "Akun",
        formatter: (_, item) =>
          item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
            ?.kelompok_aset?.akun_aset
            ? `${item.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.akun_aset.kode_akun_aset} - ${item.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.akun_aset.nama_akun_aset}`
            : "N/A",
      },
      {
        field: "kelompok_aset",
        headerName: "Kelompok",
        formatter: (_, item) =>
          item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
            ?.kelompok_aset
            ? `${item.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.kode_kelompok_aset} - ${item.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.nama_kelompok_aset}`
            : "N/A",
      },
      {
        field: "jenis_aset",
        headerName: "Jenis",
        formatter: (_, item) =>
          item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
            ? `${item.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.kode_jenis_aset} - ${item.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.nama_jenis_aset}`
            : "N/A",
      },
      {
        field: "objek_aset",
        headerName: "Objek",
        formatter: (_, item) =>
          item.sub_rincian_aset?.rincian_objek_aset?.objek_aset
            ? `${item.sub_rincian_aset.rincian_objek_aset.objek_aset.kode_objek_aset} - ${item.sub_rincian_aset.rincian_objek_aset.objek_aset.nama_objek_aset}`
            : "N/A",
      },
      {
        field: "rincian_objek_aset",
        headerName: "Rincian Objek",
        formatter: (_, item) =>
          item.sub_rincian_aset?.rincian_objek_aset
            ? `${item.sub_rincian_aset.rincian_objek_aset.kode_rincian_objek_aset} - ${item.sub_rincian_aset.rincian_objek_aset.nama_rincian_objek_aset}`
            : "N/A",
      },
      {
        field: "sub_rincian_aset",
        headerName: "Sub Rincian",
        formatter: (_, item) =>
          item.sub_rincian_aset
            ? `${item.sub_rincian_aset.kode_sub_rincian_aset} - ${item.sub_rincian_aset.nama_sub_rincian_aset}`
            : "N/A",
      },

      {
        field: "kode_sub_sub_rincian_aset",
        headerName: "Kode Sub Sub Rincian",
      },
      {
        field: "nama_sub_sub_rincian_aset",
        headerName: "Nama Sub Sub Rincian",
      },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-sub-sub-rincian-aset",
      sheetName: "Data Sub Sub Rincian",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      subSubRincianData,
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
      selectedSubRincian,
      subRincianList,
      loadingSubRincian,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingSubSubRincian,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      setSelectedAkun,
      setSelectedKelompok,
      setSelectedJenis,
      setSelectedObjek,
      setSelectedRincianObjek,
      setSelectedSubRincian,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveSubSubRincian,
      handleDeleteSubSubRincian,
    },
  };
};
