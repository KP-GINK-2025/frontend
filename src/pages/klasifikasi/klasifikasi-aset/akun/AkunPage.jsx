import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddAkunModal from "./AddAkunModal";
import DataTable from "../../../../components/DataTable";
import Swal from "sweetalert2";
import { handleExport } from "../../../../handlers/exportHandler";

const AkunPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [akunData, setAkunData] = useState([]);
  const [loading, setLoading] = useState(true); // Default true agar tabel menunjukkan loading di awal
  const [rowCount, setRowCount] = useState(0); // Inisialisasi rowCount
  const [refreshing, setRefreshing] = useState(true); // Default true agar animasi refresh berjalan di awal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAkun, setEditingAkun] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Pagination state
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Tunggu 300ms setelah user berhenti mengetik

    return () => {
      clearTimeout(timer); // Bersihkan timer jika searchTerm berubah sebelum 300ms
    };
  }, [searchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, searchTerm]);

  // Fetch akun
  const fetchData = async () => {
    setLoading(true); // Selalu set loading true saat memulai fetch
    setRefreshing(true); // Selalu set refreshing true saat memulai fetch

    try {
      const params = new URLSearchParams();
      params.append("page", dataTablePaginationModel.page + 1);
      params.append("per_page", dataTablePaginationModel.pageSize);
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await api.get(
        `/klasifikasi-aset/akun-aset?${params.toString()}`
      );
      const data = response.data.data.map((item) => ({
        id: item.id,
        kodeAset1: item.kode_akun_aset, // Nama properti di sini
        namaAset1: item.nama_akun_aset, // Nama properti di sini
        kode: item.kode,
      }));

      setAkunData(data);
      // **PENTING: Pastikan API Anda mengembalikan 'total' atau sesuaikan ini.**
      // Jika 'response.data.total' tidak ada, mungkin 'response.data.meta.total' atau lainnya.
      setRowCount(response.data.total || 0);
    } catch (error) {
      console.error("Gagal mengambil data akun aset:", error);
      setAkunData([]);
      setRowCount(0); // Set ke 0 jika ada error
    } finally {
      setLoading(false); // Matikan loading setelah fetch selesai (baik sukses maupun gagal)
      setRefreshing(false); // Matikan refreshing setelah fetch selesai (baik sukses maupun gagal)
    }
  };

  // Initial data fetch and re-fetch on pagination/search changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [
    dataTablePaginationModel.page,
    dataTablePaginationModel.pageSize,
    searchTerm,
  ]);

  // Fetch all data for export
  const fetchAllDataForExport = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      // Don't add pagination params to get all data

      const response = await api.get(
        `/klasifikasi-aset/akun-aset?${params.toString()}`
      );

      return response.data.data.map((item) => ({
        id: item.id,
        kodeAset1: item.kode_akun_aset,
        namaAset1: item.nama_akun_aset,
        kode: item.kode,
      }));
    } catch (error) {
      console.error("Gagal mengambil data untuk export:", error);
      return [];
    }
  };

  // Event handlers
  const handleExportData = async () => {
    const exportColumns = [
      {
        field: "no",
        headerName: "No",
      },
      {
        field: "kodeAset1",
        headerName: "Kode Akun",
      },
      {
        field: "namaAset1",
        headerName: "Nama Akun",
      },
      {
        field: "kode",
        headerName: "Kode",
      },
    ];

    const exportConfig = {
      fetchDataFunction: fetchAllDataForExport,
      columns: exportColumns,
      filename: "klasifikasi-aset-akun",
      sheetName: "Aset 1",
      setExporting,
    };

    await handleExport(exportConfig);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true); // Tambahkan loading pada table saat refresh manual
    try {
      setSearchTerm(""); // Reset search term
      setDataTablePaginationModel((prev) => ({
        ...prev,
        page: 0, // Reset ke halaman pertama
      }));

      // Panggil fetchData, yang akan mengelola state loading/refreshing
      await fetchData();

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil dimuat ulang.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal memuat ulang data",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setRefreshing(false);
      setLoading(false); // Matikan loading table
    }
  };

  const handleOpenAddModal = () => {
    setEditingAkun(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingAkun(null);
  };

  const handleSaveAkun = async (akunToSave) => {
    try {
      if (akunToSave.id) {
        // Mode Edit
        const { id, ...payload } = akunToSave;
        await api.patch(`/klasifikasi-aset/akun-aset/${id}`, payload);
        Swal.fire({
          title: "Berhasil Edit",
          text: "Data berhasil diubah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Mode Add
        await api.post("/klasifikasi-aset/akun-aset", akunToSave);
        Swal.fire({
          title: "Berhasil Add",
          text: "Data berhasil ditambah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      handleCloseAddModal();
      fetchData(); // Panggil fetchData untuk refresh data setelah simpan
    } catch (err) {
      console.error("Gagal menyimpan:", err);

      const errorData = err.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join("\n");
        Swal.fire({
          title: "Gagal",
          text: errorMessages,
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Terjadi kesalahan saat menyimpan data.",
          icon: "error",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
          },
        });
      }
    }
  };

  const handleEditClick = (id) => {
    const akunToEdit = akunData.find((item) => item.id === id);
    if (akunToEdit) {
      setEditingAkun(akunToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 text-white px-4 py-2 mr-1 rounded-md hover:bg-red-700 hover:outline-none cursor-pointer",
        cancelButton:
          "bg-gray-200 text-gray-700 px-4 py-2 ml-1 rounded-md hover:bg-gray-300 hover:outline-none cursor-pointer",
        popup: "rounded-lg shadow-lg",
      },
    });

    if (!result.isConfirmed) return;
    if (result.isConfirmed) {
      try {
        await api.delete(`/klasifikasi-aset/akun-aset/${id}`);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        fetchData(); // refresh data
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Gagal menghapus data",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  // Table columns configuration
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2 h-full">
          <button
            onClick={() => handleEditClick(params.row.id)}
            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(params.row.id)}
            className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = akunData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    {
      // Menggunakan nama field yang sama dengan properti di object data
      field: "kodeAset1",
      headerName: "Kode Akun",
      width: 150,
      // valueGetter tidak lagi diperlukan karena 'field' sudah cocok dengan properti data
    },
    {
      // Menggunakan nama field yang sama dengan properti di object data
      field: "namaAset1",
      headerName: "Nama Akun",
      flex: 1,
      minWidth: 250,
      // valueGetter tidak lagi diperlukan karena 'field' sudah cocok dengan properti data
    },
    { field: "kode", headerName: "Kode", width: 120 },
  ];

  // --- Render UI ---
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} className={exporting ? "animate-spin" : ""} />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Klasifikasi Aset 1
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Akun
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                value={dataTablePaginationModel.pageSize}
                onChange={(e) => {
                  setDataTablePaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0, // Reset ke halaman pertama saat jumlah entri berubah
                  }));
                }}
                className="border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer"
              >
                {[5, 10, 25, 50, 75, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600 text-sm">entries</span>
            </div>

            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <DataTable
            rows={akunData}
            columns={columns}
            rowCount={rowCount} // Pastikan rowCount ada dan nilainya benar
            loading={loading || refreshing}
            paginationMode="server"
            filterMode="server"
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            paginationModel={dataTablePaginationModel}
            onPaginationModelChange={setDataTablePaginationModel}
            height={500}
            emptyRowsMessage="Tidak ada data akun yang tersedia"
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
          />
        </div>
      </div>

      <AddAkunModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveAkun}
        initialData={editingAkun}
      />
    </div>
  );
};

export default AkunPage;
