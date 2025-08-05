// src/pages/klasifikasi/klasifikasi-instansi/bidang/useBidangPageLogic.js
import { useState, useEffect } from "react";
import {
  getBidangs,
  createBidang,
  updateBidang,
  deleteBidang,
} from "../../../../api/klasifikasiInstansiService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useBidangPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [bidangData, setBidangData] = useState([]);
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

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBidang, setEditingBidang] = useState(null);

  // Debounce untuk input pencarian
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearchTerm]);

  // Fetch data utama untuk tabel
  useEffect(() => {
    const fetchBidangData = async () => {
      setLoading(true);
      if (refreshTrigger > 0) setRefreshing(true);
      try {
        const params = {
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
          search: debouncedSearchTerm,
        };
        const res = await getBidangs(params);
        setBidangData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setBidangData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchBidangData();
  }, [paginationModel, debouncedSearchTerm, refreshTrigger]);

  // Handler untuk modal
  const handleOpenModal = (bidang = null) => {
    setEditingBidang(bidang);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBidang(null);
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

  const handleSaveBidang = async (bidangToSave) => {
    try {
      if (bidangToSave.id) {
        await updateBidang(bidangToSave.id, bidangToSave);
      } else {
        await createBidang(bidangToSave);
      }
      showSuccessToast("Data bidang berhasil disimpan");
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

  const handleDeleteBidang = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteBidang(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus bidang:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getBidangs({
        per_page: totalRows,
        search: debouncedSearchTerm,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      {
        field: "provinsi",
        headerName: "Provinsi",
        formatter: (_, item) =>
          item.kabupaten_kota?.provinsi
            ? `${item.kabupaten_kota.provinsi.kode_provinsi} - ${item.kabupaten_kota.provinsi.nama_provinsi}`
            : "N/A",
      },
      {
        field: "kabupaten_kota",
        headerName: "Kabupaten/Kota",
        formatter: (_, item) =>
          item.bidang?.kabupaten_kota
            ? `${item.kabupaten_kota.kode_kabupaten_kota} - ${item.kabupaten_kota.nama_kabupaten_kota}`
            : "N/A",
      },
      { field: "kode_bidang", headerName: "Kode Bidang" },
      { field: "nama_bidang", headerName: "Nama Bidang" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-bidang",
      sheetName: "Data Bidang",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      bidangData,
      totalRows,
      paginationModel,
      searchTerm,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingBidang,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveBidang,
      handleDeleteBidang,
    },
  };
};
