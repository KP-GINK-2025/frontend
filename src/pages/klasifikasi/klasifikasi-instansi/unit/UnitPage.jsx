import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import AddUnitModal from "./AddUnitModal";
import Buttons from "../../../../components/Buttons";
import Swal from "sweetalert2";
import {
  handleExport as exportHandler,
  commonFormatters,
  createExportConfig,
} from "../../../../handlers/exportHandler";

const UnitPage = () => {
  const [unitData, setUnitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [exporting, setExporting] = useState(false); // Add exporting state
  const [totalRows, setTotalRows] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [allUnitData, setAllUnitData] = useState([]); // Store all data for export

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [bidangList, setBidangList] = useState([]);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    if (debouncedSearchTerm || selectedBidang) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, selectedBidang]);

  // Fetch bidang list (static data)
  useEffect(() => {
    const fetchBidangList = async () => {
      try {
        const response = await api.get("/klasifikasi-instansi/bidang", {
          params: { per_page: 1000 },
        });

        const sortedBidang = response.data.data
          .map((bidang) => ({
            id: bidang.id,
            kode_bidang: bidang.kode_bidang,
            nama_bidang: bidang.nama_bidang,
          }))
          .sort((a, b) =>
            a.kode_bidang.localeCompare(b.kode_bidang, undefined, {
              numeric: true,
            })
          );

        setBidangList(sortedBidang);
      } catch (error) {
        console.error("Gagal mendapatkan bidang list:", error);
        setBidangList([]);
      }
    };

    fetchBidangList();
  }, []);

  // Fetch unit data
  useEffect(() => {
    const fetchUnitData = async () => {
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

        if (selectedBidang) {
          params.append("bidang_id", selectedBidang);
        }

        const response = await api.get(
          `/klasifikasi-instansi/unit?${params.toString()}`
        );

        setUnitData(response.data.data);
        setTotalRows(response.data.meta.total);
      } catch (error) {
        console.error("Gagal mendapatkan unit data:", error);
        setUnitData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchUnitData();
  }, [paginationModel, debouncedSearchTerm, selectedBidang, refreshTrigger]);

  // Fetch all unit data for export
  const fetchAllUnitData = async () => {
    try {
      const params = new URLSearchParams({
        per_page: 10000, // Large number to get all data
      });

      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      if (selectedBidang) {
        params.append("bidang_id", selectedBidang);
      }

      const response = await api.get(
        `/klasifikasi-instansi/unit?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch all unit data:", error);
      throw error;
    }
  };

  // Event handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setSearchTerm("");
      setSelectedBidang("");
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
      setRefreshTrigger((prev) => prev + 1);

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

  // Updated export handler
  const handleExport = async () => {
    // Define export columns configuration
    const exportColumns = [
      {
        field: "no",
        headerName: "No",
        formatter: (value, item, index) => index + 1,
      },
      {
        field: "provinsi",
        headerName: "Provinsi",
        formatter: (value, item) => {
          const provinsi = item.bidang?.kabupaten_kota?.provinsi;
          return provinsi
            ? `${provinsi.kode_provinsi} - ${provinsi.nama_provinsi}`
            : "N/A";
        },
      },
      {
        field: "kabupaten_kota",
        headerName: "Kabupaten/Kota",
        formatter: (value, item) => {
          const kabKot = item.bidang?.kabupaten_kota;
          return kabKot
            ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
            : "N/A";
        },
      },
      {
        field: "bidang",
        headerName: "Bidang",
        formatter: (value, item) => {
          const bidang = item.bidang;
          return bidang
            ? `${bidang.kode_bidang} - ${bidang.nama_bidang}`
            : "N/A";
        },
      },
      {
        field: "kode_unit",
        headerName: "Kode Unit",
      },
      {
        field: "nama_unit",
        headerName: "Nama Unit",
      },
      {
        field: "kode",
        headerName: "Kode",
      },
    ];

    // Create export configuration
    const exportConfig = {
      fetchDataFunction: fetchAllUnitData,
      columns: exportColumns,
      filename: "daftar-unit",
      sheetName: "Data Unit",
      setExporting,
    };

    // Execute export
    try {
      await exportHandler(exportConfig);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUnit(null);
  };

  const handleSaveUnit = async (unitToSave) => {
    const payload = {
      bidang_id: unitToSave.bidang_id,
      kode_unit: unitToSave.kode_unit,
      nama_unit: unitToSave.nama_unit,
      kode: unitToSave.kode,
    };

    try {
      if (unitToSave.id) {
        await api.patch(`/klasifikasi-instansi/unit/${unitToSave.id}`, payload);
        Swal.fire({
          title: "Berhasil Edit",
          text: "Data berhasil diubah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/klasifikasi-instansi/unit", payload);
        Swal.fire({
          title: "Berhasil Add",
          text: "Data berhasil ditambah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      handleRefresh();
      handleCloseAddModal();
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
    const unitToEdit = unitData.find((item) => item.id === id);
    if (unitToEdit) {
      setEditingUnit(unitToEdit);
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
      await api.delete(`/klasifikasi-instansi/unit/${id}`);
      console.log("Berhasil menghapus unit dengan ID:", id);
      Swal.fire({
        title: "Berhasil Delete",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleRefresh();
    } catch (error) {
      console.error("Gagal menghapus unit:", error);
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
        const index = unitData.findIndex((row) => row.id === params.row.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const provinsi = params.row.bidang?.kabupaten_kota?.provinsi;
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
        const kabKot = params.row.bidang?.kabupaten_kota;
        return kabKot
          ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
          : "N/A";
      },
    },
    {
      field: "bidang",
      headerName: "Bidang",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const bidang = params.row.bidang;
        return bidang ? `${bidang.kode_bidang} - ${bidang.nama_bidang}` : "N/A";
      },
    },
    {
      field: "kode_unit",
      headerName: "Kode Unit",
      width: 120,
    },
    {
      field: "nama_unit",
      headerName: "Nama Unit",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "kode",
      headerName: "Kode",
      width: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mt-4 mb-4">
          <Buttons variant="danger" onClick={handleExport}>
            <Download size={16} /> Export
          </Buttons>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Unit</h1>
            <div className="flex gap-3">
              <Buttons variant="info" onClick={handleRefresh}>
                <RefreshCw size={16} /> Refresh
              </Buttons>
              <Buttons variant="success" onClick={handleOpenAddModal}>
                <Plus size={16} /> Add Unit
              </Buttons>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            {/* Left: Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Bidang Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
                >
                  <option value="">-- Semua Bidang --</option>
                  {bidangList.map((bidang) => (
                    <option key={bidang.id} value={bidang.id}>
                      {bidang.kode_bidang} - {bidang.nama_bidang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <span className="text-gray-600 text-sm">Show</span>
                <select
                  value={paginationModel.pageSize}
                  onChange={(e) =>
                    setPaginationModel({
                      page: 0,
                      pageSize: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer"
                >
                  {[5, 10, 25, 50, 75, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-gray-600 text-sm">entries</span>
              </div>
            </div>

            {/* Right: Search */}
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            rows={unitData}
            columns={columns}
            rowCount={totalRows}
            loading={loading}
            paginationMode="server"
            filterMode="server"
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveUnit}
        initialData={editingUnit}
      />
    </div>
  );
};

export default UnitPage;
