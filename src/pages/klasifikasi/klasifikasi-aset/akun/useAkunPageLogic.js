// src/pages/klasifikasi/klasifikasi-aset/akun/useAkunPageLogic.js
import { useState, useEffect } from "react";
import {
  getAkuns,
  createAkun,
  updateAkun,
  deleteAkun,
} from "../../../../api/service/klasifikasiAsetService";
import {
  showSuccessToast,
  showErrorToast,
  showErrorAlert,
  showConfirmationDialog,
} from "../../../../utils/notificationService";
import { handleExport as exportHandler } from "../../../../handlers/exportHandler";

export const useAkunPageLogic = () => {
  // State untuk Data Tabel & Paginasi
  const [akunData, setAkunData] = useState([]);
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
  const [editingAkun, setEditingAkun] = useState(null);

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
    const fetchAkunData = async () => {
      setLoading(true);
      if (refreshTrigger > 0) setRefreshing(true);
      try {
        const params = {
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
          search: debouncedSearchTerm,
        };
        const res = await getAkuns(params);
        setAkunData(res.data);
        setTotalRows(res.meta.total);
      } catch (err) {
        setAkunData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchAkunData();
  }, [paginationModel, debouncedSearchTerm, refreshTrigger]);

  // Handler untuk modal
  const handleOpenModal = (akun = null) => {
    setEditingAkun(akun);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAkun(null);
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

  const handleSaveAkun = async (akunToSave) => {
    try {
      if (akunToSave.id) {
        await updateAkun(akunToSave.id, akunToSave);
      } else {
        await createAkun(akunToSave);
      }
      showSuccessToast("Data akun berhasil disimpan");
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

  const handleDeleteAkun = async (id) => {
    const isConfirmed = await showConfirmationDialog({
      text: "Data yang dihapus tidak dapat dikembalikan",
      confirmButtonText: "Ya, hapus",
    });

    if (!isConfirmed) return;

    try {
      await deleteAkun(id);
      showSuccessToast("Data berhasil dihapus");
      handleRefresh();
    } catch (err) {
      console.error("Gagal menghapus akun:", err);
      const errorData = err.response?.data;
      const errorMessages = errorData?.errors
        ? Object.values(errorData.errors).flat().join("\n")
        : "Terjadi kesalahan saat menghapus data";

      showErrorAlert(errorMessages);
    }
  };

  const handleExport = () => {
    const fetchAllData = async () => {
      const res = await getAkuns({
        per_page: totalRows,
        search: debouncedSearchTerm,
      });
      return res.data;
    };

    const exportColumns = [
      { field: "no", headerName: "No", formatter: (_, __, index) => index + 1 },
      { field: "kode_akun_aset", headerName: "Kode Akun" },
      { field: "nama_akun_aset", headerName: "Nama Akun" },
      { field: "kode", headerName: "Kode" },
    ];
    exportHandler({
      fetchDataFunction: fetchAllData,
      columns: exportColumns,
      filename: "daftar-akun-aset",
      sheetName: "Data Akun Aset",
      setExporting,
    });
  };

  // Mengembalikan semua state dan handler yang dibutuhkan oleh UI
  return {
    state: {
      akunData,
      totalRows,
      paginationModel,
      searchTerm,
      loading,
      refreshing,
      exporting,
      isModalOpen,
      editingAkun,
    },
    handler: {
      setPaginationModel,
      setSearchTerm,
      handleRefresh,
      handleExport,
      handleOpenModal,
      handleCloseModal,
      handleSaveAkun,
      handleDeleteAkun,
    },
  };
};
