// src/pages/klasifikasi/klasifikasi-instansi/unit/useSubUnitPageLogic.js
import { useState, useEffect } from "react";
import {
  getSubUnits,
  createSubUnit,
  updateSubUnit,
  deleteSubUnit,
  getBidangOptions,
  getUnitByBidang,
} from "../../../../api/klasifikasiInstansiService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useSubUnitPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [subUnitData, setSubUnitData] = useState([]);
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

  const [loadingBidang, setLoadingBidang] = useState(false);
  const [loadingUnit, setLoadingUnit] = useState(false);

  // State untuk Kondisi UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubUnit, setEditingSubUnit] = useState(null);

  // Debounce untuk input pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearchTerm, selectedBidang, selectedUnit]);

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

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchSubUnitData = async () => {
      setLoading(true);
      if (refreshTrigger > 0) setRefreshing(true);
      try {
        const params = {
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
          search: debouncedSearchTerm,
          bidang_id: selectedBidang,
          unit_id: selectedUnit,
        };
        const res = await getSubUnits(params);
        setSubUnitData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setSubUnitData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchSubUnitData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedBidang,
    selectedUnit,
    refreshTrigger,
  ]);

  // Handler untuk modal
  const handleOpenModal = (subUnit = null) => {
    setEditingSubUnit(subUnit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubUnit(null);
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

  const handleSaveSubUnit = async (subUnitToSave) => {
    try {
      if (subUnitToSave.id) {
        await updateSubUnit(subUnitToSave.id, subUnitToSave);
      } else {
        await createSubUnit(subUnitToSave);
      }
      showSuccessToast("Data sub unit berhasil disimpan");
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

  const handleDeleteSubUnit = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteSubUnit(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus sub unit:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getSubUnits({
        per_page: totalRows,
        search: debouncedSearchTerm,
        bidang_id: selectedBidang,
        unit_id: selectedUnit,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "provinsi",
        headerName: "Provinsi",
        formatter: (_, item) =>
          item.unit?.bidang?.kabupaten_kota?.provinsi
            ? `${item.unit.bidang.kabupaten_kota.provinsi.kode_provinsi} - ${item.unit.bidang.kabupaten_kota.provinsi.nama_provinsi}`
            : "N/A",
      },
      {
        field: "kabupaten_kota",
        headerName: "Kabupaten/Kota",
        formatter: (_, item) =>
          item.unit?.bidang?.kabupaten_kota
            ? `${item.unit.bidang.kabupaten_kota.kode_kabupaten_kota} - ${item.unit.bidang.kabupaten_kota.nama_kabupaten_kota}`
            : "N/A",
      },
      {
        field: "bidang",
        headerName: "Bidang",
        formatter: (_, item) =>
          item.unit?.bidang
            ? `${item.unit.bidang.kode_bidang} - ${item.unit.bidang.nama_bidang}`
            : "N/A",
      },
      {
        field: "unit",
        headerName: "Unit",
        formatter: (_, item) =>
          item.unit ? `${item.unit.kode_unit} - ${item.unit.nama_unit}` : "N/A",
      },
      { field: "kode_sub_unit", headerName: "Kode Sub Unit" },
      { field: "nama_sub_unit", headerName: "Nama Sub Unit" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-sub-unit",
      sheetName: "Data Sub Unit",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      subUnitData,
      totalRows,
      paginationModel,
      searchTerm,
      selectedBidang,
      bidangList,
      loadingBidang,
      selectedUnit,
      unitList,
      loadingUnit,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingSubUnit,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      setSelectedBidang,
      setSelectedUnit,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveSubUnit,
      handleDeleteSubUnit,
    },
  };
};
