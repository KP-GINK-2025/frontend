// src/pages/klasifikasi/klasifikasi-instansi/unit/useUnitPageLogic.js
import { useState, useEffect } from "react";
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  getBidangOptions,
} from "../../../../api/service/klasifikasiInstansiService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useUnitPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [unitData, setUnitData] = useState([]);
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

  const [loadingBidang, setLoadingBidang] = useState(false);

  // State untuk Kondisi UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // Debounce untuk input pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearchTerm, selectedBidang]);

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

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchUnitData = async () => {
      setLoading(true);
      if (refreshTrigger > 0) setRefreshing(true);
      try {
        const params = {
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
          search: debouncedSearchTerm,
          bidang_id: selectedBidang,
        };
        const res = await getUnits(params);
        setUnitData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setUnitData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchUnitData();
  }, [paginationModel, debouncedSearchTerm, selectedBidang, refreshTrigger]);

  // Handler untuk modal
  const handleOpenModal = (unit = null) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
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

  const handleSaveUnit = async (unitToSave) => {
    try {
      if (unitToSave.id) {
        await updateUnit(unitToSave.id, unitToSave);
      } else {
        await createUnit(unitToSave);
      }
      showSuccessToast("Data unit berhasil disimpan");
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

  const handleDeleteUnit = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteUnit(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus unit:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getUnits({
        per_page: totalRows,
        search: debouncedSearchTerm,
        bidang_id: selectedBidang,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "provinsi",
        headerName: "Provinsi",
        formatter: (_, item) =>
          item.bidang?.kabupaten_kota?.provinsi
            ? `${item.bidang.kabupaten_kota.provinsi.kode_provinsi} - ${item.bidang.kabupaten_kota.provinsi.nama_provinsi}`
            : "N/A",
      },
      {
        field: "kabupaten_kota",
        headerName: "Kabupaten/Kota",
        formatter: (_, item) =>
          item.bidang?.kabupaten_kota
            ? `${item.bidang.kabupaten_kota.kode_kabupaten_kota} - ${item.bidang.kabupaten_kota.nama_kabupaten_kota}`
            : "N/A",
      },
      {
        field: "bidang",
        headerName: "Bidang",
        formatter: (_, item) =>
          item.bidang
            ? `${item.bidang.kode_bidang} - ${item.bidang.nama_bidang}`
            : "N/A",
      },
      { field: "kode_unit", headerName: "Kode Unit" },
      { field: "nama_unit", headerName: "Nama Unit" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-unit",
      sheetName: "Data Unit",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      unitData,
      totalRows,
      paginationModel,
      searchTerm,
      selectedBidang,
      bidangList,
      loadingBidang,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingUnit,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      setSelectedBidang,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveUnit,
      handleDeleteUnit,
    },
  };
};
