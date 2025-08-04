import React, { useState, useEffect, useCallback } from "react";
import api from "../../../../api/axios";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddBidangModal from "./AddBidangModal";
import ColumnManager from "../../../../components/table/ColumnManager";

import Swal from "sweetalert2";
import {
  handleExport,
  commonFormatters,
} from "../../../../handlers/exportHandler";

const BidangPage = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Data states
  const [bidangData, setBidangData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBidang, setEditingBidang] = useState(null);

  // Table states
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize column visibility
  useEffect(() => {
    const initialVisibility = {};
    baseColumns.forEach((col) => {
      initialVisibility[col.field] = true;
    });
    setColumnVisibility(initialVisibility);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when search changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, searchTerm]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);

    try {
      const params = new URLSearchParams({
        page: paginationModel.page + 1,
        per_page: paginationModel.pageSize,
      });

      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      const response = await api.get(`/klasifikasi-instansi/bidang?${params}`);

      setBidangData(response.data.data);
      setRowCount(response.data.meta.total);
    } catch (error) {
      console.error("Failed to fetch bidang data:", error);
      setBidangData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [paginationModel, debouncedSearchTerm, refreshTrigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Export configuration
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

  // Table columns configuration
  const baseColumns = [
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
        return paginationModel.page * paginationModel.pageSize + index + 1;
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
    {
      field: "nama_bidang",
      headerName: "Nama Bidang",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "kode",
      headerName: "Kode",
      width: 120,
    },
  ];

  // Event handlers
  const handleExportClick = async () => {
    const fetchAllDataForExport = async () => {
      const params = new URLSearchParams({
        page: 1,
        per_page: 10000,
      });

      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      const response = await api.get(`/klasifikasi-instansi/bidang?${params}`);
      return response.data.data;
    };

    const exportConfig = {
      fetchDataFunction: fetchAllDataForExport,
      columns: exportColumns,
      filename: "data-bidang",
      sheetName: "Data Bidang",
      setExporting,
    };

    await handleExport(exportConfig);
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      setSearchTerm("");
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setRefreshTrigger((c) => c + 1);

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
      console.error("Failed to save:", err);

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

    try {
      await api.delete(`/klasifikasi-instansi/bidang/${id}`);

      Swal.fire({
        title: "Berhasil Delete",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      handleRefresh();
    } catch (error) {
      console.error("Failed to delete bidang:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  const handleColumnVisibilityChange = (newVisibility) => {
    setColumnVisibility(newVisibility);
  };

  // Filter visible columns
  const visibleColumns = baseColumns.filter((col) => {
    return columnVisibility[col.field] !== false;
  });

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExportClick}
            disabled={exporting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} className={exporting ? "animate-pulse" : ""} />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
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

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Show</span>
                <select
                  value={paginationModel.pageSize}
                  onChange={(e) => {
                    setPaginationModel((prev) => ({
                      ...prev,
                      pageSize: Number(e.target.value),
                      page: 0,
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

              {/* Column Manager */}
              <ColumnManager
                columns={baseColumns}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={handleColumnVisibilityChange}
              />
            </div>

            {/* Search */}
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

          {/* Data Table */}
          <DataTable
            rows={bidangData}
            columns={visibleColumns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            filterMode="server"
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
          />
        </div>
      </div>

      {/* Modal */}
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
