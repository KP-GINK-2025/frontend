import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddBidangModal from "./AddBidangModal";
import Swal from "sweetalert2";
import {
  handleExport,
  commonFormatters,
  createExportConfig,
} from "../../../../handlers/exportHandler";

const BidangPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bidangData, setBidangData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rowCount, setRowCount] = useState(0);

  const [refreshing, setRefreshing] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [exporting, setExporting] = useState(false); // State untuk loading export

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBidang, setEditingBidang] = useState(null);

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

  // Fetch bidang
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRefreshing(true); // Spinner aktif juga saat fetch pertama kali
      try {
        const params = new URLSearchParams();
        params.append("page", dataTablePaginationModel.page + 1);
        params.append("per_page", dataTablePaginationModel.pageSize);

        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }

        const response = await api.get(
          `/klasifikasi-instansi/bidang?${params.toString()}`
        );

        setBidangData(response.data.data);
        setRowCount(response.data.meta.total);
      } catch (error) {
        console.error("Gagal fetch data bidang:", error);
        setBidangData([]);
        setRowCount(0);
      } finally {
        setLoading(false);
        setRefreshing(false); // Matikan spinner setelah data selesai di-load
      }
    };

    fetchData();
  }, [dataTablePaginationModel, debouncedSearchTerm, refreshTrigger]);

  // --- Handler Fungsi ---

  // Define export columns configuration
  const exportColumns = [
    { field: "no", headerName: "No" },
    {
      field: "provinsi",
      headerName: "Kode Provinsi",
      formatter: commonFormatters.nestedObject(
        "kabupaten_kota.provinsi.kode_provinsi"
      ),
    },
    {
      field: "provinsi",
      headerName: "Nama Provinsi",
      formatter: commonFormatters.nestedObject(
        "kabupaten_kota.provinsi.nama_provinsi"
      ),
    },
    {
      field: "kabupaten_kota",
      headerName: "Kode Kabupaten/Kota",
      formatter: commonFormatters.nestedObject(
        "kabupaten_kota.kode_kabupaten_kota"
      ),
    },
    {
      field: "kabupaten_kota",
      headerName: "Nama Kabupaten/Kota",
      formatter: commonFormatters.nestedObject(
        "kabupaten_kota.nama_kabupaten_kota"
      ),
    },
    { field: "kode_bidang", headerName: "Kode Bidang" },
    { field: "nama_bidang", headerName: "Nama Bidang" },
    { field: "kode", headerName: "Kode" },
  ];

  // New export handler using the reusable function
  const handleExportClick = async () => {
    // Function to fetch all data for export
    const fetchAllDataForExport = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", 1);
        params.append("per_page", 10000); // Get all data
        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }

        const response = await api.get(
          `/klasifikasi-instansi/bidang?${params.toString()}`
        );
        return response.data.data;
      } catch (error) {
        console.error("Failed to fetch export data:", error);
        throw error;
      }
    };

    // Create export configuration
    const exportConfig = {
      fetchDataFunction: fetchAllDataForExport,
      columns: exportColumns,
      filename: "data-bidang",
      sheetName: "Data Bidang",
      setExporting: setExporting,
    };

    // Call the reusable export handler
    await handleExport(exportConfig);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setSearchTerm(""); // Reset pencarian jika ingin seperti LraPage
      setDataTablePaginationModel((prev) => ({ ...prev, page: 0 })); // Reset halaman
      setRefreshTrigger((c) => c + 1);

      // Simulasi delay agar animasi terlihat (opsional, bisa dihapus jika tidak perlu)
      await new Promise((resolve) => setTimeout(resolve, 800));

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
    }
  };

  const handleOpenAddModal = () => {
    setEditingBidang(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingBidang(null);
  };

  const handleSaveBidang = async (bidangToSave) => {
    try {
      if (bidangToSave.id) {
        // Mode Edit
        const { id, ...payload } = bidangToSave;
        await api.patch(`/klasifikasi-instansi/bidang/${id}`, payload);
        Swal.fire({
          title: "Berhasil Edit",
          text: "Data berhasil diubah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Mode Add
        await api.post("/klasifikasi-instansi/bidang", bidangToSave);
        Swal.fire({
          title: "Berhasil Add",
          text: "Data berhasil ditambah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      handleCloseAddModal();
      handleRefresh();
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
    const bidangToEdit = bidangData.find((item) => item.id === id);
    if (bidangToEdit) {
      setEditingBidang(bidangToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/klasifikasi-instansi/bidang/${id}`);
      console.log("Berhasil menghapus bidang dengan ID:", id);
      Swal.fire({
        title: "Berhasil Delete",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleRefresh();
    } catch (error) {
      console.error("Gagal menghapus bidang:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
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
        const index = bidangData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const provinsi = params.row.kabupaten_kota?.provinsi;
        return provinsi
          ? `${provinsi.kode_provinsi} - ${provinsi.nama_provinsi}`
          : "N/A";
      },
    },
    {
      field: "kabupaten_kota",
      headerName: "Kabupaten/Kota",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const kabKot = params.row.kabupaten_kota;
        return kabKot
          ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
          : "N/A";
      },
    },
    {
      field: "kode_bidang",
      headerName: "Kode Bidang",
      width: 150,
    },
    { field: "nama_bidang", headerName: "Nama Bidang", flex: 1, minWidth: 250 },
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
            onClick={handleExportClick} // Updated to use new handler
            disabled={exporting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} className={exporting ? "animate-pulse" : ""} />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Bidang</h1>
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
                <Plus size={16} /> Add Bidang
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
            rows={bidangData}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            filterMode="server" // Ini sebenarnya dikontrol oleh cara Anda mem-fetch data dengan 'search' param
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            paginationModel={dataTablePaginationModel}
            onPaginationModelChange={setDataTablePaginationModel}
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
            disableRowSelectionOnClick // Menambahkan ini agar baris tidak terpilih saat diklik
            hideFooterSelectedRowCount // Menambahkan ini untuk menyembunyikan hitungan baris yang dipilih di footer
          />
        </div>
      </div>

      <AddBidangModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveBidang}
        initialData={editingBidang}
      />
    </div>
  );
};

export default BidangPage;
