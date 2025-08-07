// src/pages/klasifikasi/klasifikasi-instansi/unit/useUpbPageLogic.js
import { useState, useEffect } from "react";
import {
  getUpbs,
  createUpb,
  updateUpb,
  deleteUpb,
  getBidangOptions,
  getUnitByBidang,
  getSubUnitByUnit,
} from "../../../../api/service/klasifikasiInstansiService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useUpbPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [upbData, setUpbData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // State untuk Filter & Pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [selectedBidang, setSelectedBidang] = useState("");
  const [bidangList, setBidangList] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitList, setUnitList] = useState([]);
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [subUnitList, setSubUnitList] = useState([]);

  const [loadingBidang, setLoadingBidang] = useState(false);
  const [loadingUnit, setLoadingUnit] = useState(false);
  const [loadingSubUnit, setLoadingSubUnit] = useState(false);

  // State untuk Kondisi UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpb, setEditingUpb] = useState(null);

  // Debounce untuk input pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearchTerm, selectedBidang, selectedUnit, selectedSubUnit]);

  // Fetch daftar bidang untuk filter
  useEffect(() => {
    const fetchBidangList = async () => {
      setLoadingBidang(true);
      try {
        const params = {
          per_page: 1000,
        };
        const res = await getBidangOptions(params); // Menggunakan service
        const sorted = res.sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { numeric: true })
        );
        setBidangList(sorted);
      } catch (error) {
        console.error("Gagal mendapatkan bidang list:", error);
      } finally {
        setLoadingBidang(false);
      }
    };
    fetchBidangList();
  }, []);

  // Fetch daftar unit untuk filter
  useEffect(() => {
    // Jangan fetch jika tidak ada bidang yang dipilih
    if (!selectedBidang) {
      setUnitList([]);
      return;
    }
    const fetchUnitList = async () => {
      setLoadingUnit(true);
      try {
        const res = await getUnitByBidang(selectedBidang);
        const sorted = res.sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { numeric: true })
        );
        setUnitList(sorted);
      } catch (error) {
        console.error("Gagal mendapatkan unit list:", error);
        setUnitList([]);
      } finally {
        setLoadingUnit(false);
      }
    };
    fetchUnitList();
  }, [selectedBidang]);

  // Fetch daftar subunit untuk filter
  useEffect(() => {
    // Jangan fetch jika tidak ada bidang yang dipilih
    if (!selectedUnit) {
      setSubUnitList([]);
      return;
    }
    const fetchSubUnitList = async () => {
      setLoadingSubUnit(true);
      try {
        const res = await getSubUnitByUnit(selectedUnit);
        const sorted = res.sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { numeric: true })
        );
        setSubUnitList(sorted);
      } catch (error) {
        console.error("Gagal mendapatkan subunit list:", error);
        setSubUnitList([]);
      } finally {
        setLoadingSubUnit(false);
      }
    };
    fetchSubUnitList();
  }, [selectedUnit]);

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchUpbData = async () => {
      setLoading(true);
      if (refreshTrigger > 0) setRefreshing(true);
      try {
        const params = {
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
          search: debouncedSearchTerm,
          bidang_id: selectedBidang,
          unit_id: selectedUnit,
          sub_unit_id: selectedSubUnit,
        };
        const res = await getUpbs(params);
        setUpbData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setUpbData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchUpbData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedBidang,
    selectedUnit,
    selectedSubUnit,
    refreshTrigger,
  ]);

  // Handler untuk modal
  const handleOpenModal = (upb = null) => {
    setEditingUpb(upb);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUpb(null);
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

  const handleSaveUpb = async (upbToSave) => {
    try {
      if (upbToSave.id) {
        await updateUpb(upbToSave.id, upbToSave);
      } else {
        await createUpb(upbToSave);
      }
      showSuccessToast("Data UPB berhasil disimpan");
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

  const handleDeleteUpb = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteUpb(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus upb:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getUpbs({
        per_page: totalRows,
        search: debouncedSearchTerm,
        bidang_id: selectedBidang,
        unit_id: selectedUnit,
        sub_unit_id: selectedSubUnit,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "provinsi",
        headerName: "Provinsi",
        formatter: (_, item) =>
          item.sub_unit?.unit?.bidang?.kabupaten_kota?.provinsi
            ? `${item.sub_unit.unit.bidang.kabupaten_kota.provinsi.kode_provinsi} - ${item.sub_unit.unit.bidang.kabupaten_kota.provinsi.nama_provinsi}`
            : "N/A",
      },
      {
        field: "kabupaten_kota",
        headerName: "Kabupaten/Kota",
        formatter: (_, item) =>
          item.sub_unit?.unit?.bidang?.kabupaten_kota
            ? `${item.sub_unit.unit.bidang.kabupaten_kota.kode_kabupaten_kota} - ${item.sub_unit.unit.bidang.kabupaten_kota.nama_kabupaten_kota}`
            : "N/A",
      },
      {
        field: "bidang",
        headerName: "Bidang",
        formatter: (_, item) =>
          item.sub_unit?.unit?.bidang
            ? `${item.sub_unit.unit.bidang.kode_bidang} - ${item.sub_unit.unit.bidang.nama_bidang}`
            : "N/A",
      },
      {
        field: "unit",
        headerName: "Unit",
        formatter: (_, item) =>
          item.sub_unit?.unit
            ? `${item.sub_unit.unit.kode_unit} - ${item.sub_unit.unit.nama_unit}`
            : "N/A",
      },
      {
        field: "sub_unit",
        headerName: "Sub Unit",
        formatter: (_, item) =>
          item.sub_unit
            ? `${item.sub_unit.kode_sub_unit} - ${item.sub_unit.nama_sub_unit}`
            : "N/A",
      },
      { field: "kode_upb", headerName: "Kode UPB" },
      { field: "nama_upb", headerName: "Nama UPB" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-upb",
      sheetName: "Data UPB",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      upbData,
      totalRows,
      paginationModel,
      searchTerm,
      selectedBidang,
      bidangList,
      loadingBidang,
      selectedUnit,
      unitList,
      loadingUnit,
      selectedSubUnit,
      subUnitList,
      loadingSubUnit,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingUpb,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      setSelectedBidang,
      setSelectedUnit,
      setSelectedSubUnit,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveUpb,
      handleDeleteUpb,
    },
  };
};
