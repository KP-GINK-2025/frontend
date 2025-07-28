import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import DataTable from "../../../../components/DataTable";
import AddRincianObjekModal from "./AddRincianObjekModal";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import Swal from "sweetalert2";

const RincianObjekPage = () => {
  // Main data states
  const [rincianObjekData, setRincianObjekData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Filter dropdown data
  const [asetSatuData, setAsetSatuData] = useState([]);
  const [asetDuaData, setAsetDuaData] = useState([]);
  const [asetTigaData, setAsetTigaData] = useState([]);
  const [asetEmpatData, setAsetEmpatData] = useState([]);

  // Selected filter values
  const [selectedAsetSatu, setSelectedAsetSatu] = useState("");
  const [selectedAsetDua, setSelectedAsetDua] = useState("");
  const [selectedAsetTiga, setSelectedAsetTiga] = useState("");
  const [selectedAsetEmpat, setSelectedAsetEmpat] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRincianObjek, setEditingRincianObjek] = useState(null);

  // Pagination state
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: entriesPerPage,
  });

  // Data mapping helper
  const mapRincianObjekData = (data) => {
    return data.map((item) => ({
      id: item.id,
      aset1: item.objek_aset?.jenis_aset?.kelompok_aset?.akun_aset
        ? `${item.objek_aset.jenis_aset.kelompok_aset.akun_aset.kode_akun_aset} - ${item.objek_aset.jenis_aset.kelompok_aset.akun_aset.nama_akun_aset}`
        : "-",
      aset2: item.objek_aset?.jenis_aset?.kelompok_aset
        ? `${item.objek_aset.jenis_aset.kelompok_aset.kode_kelompok_aset} - ${item.objek_aset.jenis_aset.kelompok_aset.nama_kelompok_aset}`
        : "-",
      aset3: item.objek_aset?.jenis_aset
        ? `${item.objek_aset.jenis_aset.kode_jenis_aset} - ${item.objek_aset.jenis_aset.nama_jenis_aset}`
        : "-",
      aset4: item.objek_aset
        ? `${item.objek_aset.kode_objek_aset} - ${item.objek_aset.nama_objek_aset}`
        : "-",
      kodeAset5: item.kode_rincian_objek_aset,
      namaAset5: item.nama_rincian_objek_aset,
      kode: item.kode,
    }));
  };

  // Prepare filter dropdown data
  const prepareFilterData = (mappedData) => {
    const asetSatuSet = new Set();
    const asetDuaSet = new Set();
    const asetTigaSet = new Set();
    const asetEmpatSet = new Set();

    mappedData.forEach((item) => {
      asetSatuSet.add(item.aset1);
      asetDuaSet.add(item.aset2);
      asetTigaSet.add(item.aset3);
      asetEmpatSet.add(item.aset4);
    });

    setAsetSatuData(
      [...asetSatuSet].map((v, i) => ({ id: i + 1, namaAset: v }))
    );
    setAsetDuaData(
      [...asetDuaSet].map((v, i) => ({ id: i + 1, namaAset2: v }))
    );
    setAsetTigaData(
      [...asetTigaSet].map((v, i) => ({ id: i + 1, namaAset3: v }))
    );
    setAsetEmpatData(
      [...asetEmpatSet].map((v, i) => ({ id: i + 1, namaAset4: v }))
    );
  };

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setRefreshing(true); // Spinner aktif juga saat fetch pertama kali
    try {
      const response = await api.get("/klasifikasi-aset/rincian-objek-aset");
      const mappedData = mapRincianObjekData(response.data.data);

      setRincianObjekData(mappedData);
      prepareFilterData(mappedData);
    } catch (error) {
      console.error("Gagal fetch data rincian objek:", error);
      showErrorAlert("Gagal memuat data");
    } finally {
      setLoading(false);
      setRefreshing(false); // Matikan spinner setelah data selesai di-load
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Filter data based on search and selected filters
  const filteredData = rincianObjekData.filter((item) => {
    const matchesSearch = [
      item.aset1,
      item.aset2,
      item.aset3,
      item.aset4,
      item.kodeAset5,
      item.namaAset5,
      item.kode,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilters = [
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu,
      selectedAsetDua === "" || item.aset2 === selectedAsetDua,
      selectedAsetTiga === "" || item.aset3 === selectedAsetTiga,
      selectedAsetEmpat === "" || item.aset4 === selectedAsetEmpat,
    ].every(Boolean);

    return matchesSearch && matchesFilters;
  });

  // Alert helpers
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAsetSatu("");
    setSelectedAsetDua("");
    setSelectedAsetTiga("");
    setSelectedAsetEmpat("");
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // Event handlers
  const handleExport = () => {
    console.log("Exporting rincian objek data...");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);

    try {
      resetFilters();
      // Simulate delay for animation
      await new Promise((resolve) => setTimeout(resolve, 800));
      await fetchData();
      showSuccessAlert("Data berhasil dimuat ulang.");
    } catch (error) {
      showErrorAlert("Gagal memuat ulang data");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingRincianObjek(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingRincianObjek(null);
  };

  const handleSaveNewRincianObjek = (rincianObjekToSave) => {
    if (rincianObjekToSave.id) {
      // Update existing item
      setRincianObjekData((prevData) =>
        prevData.map((item) =>
          item.id === rincianObjekToSave.id ? rincianObjekToSave : item
        )
      );
      console.log("Update Rincian Objek:", rincianObjekToSave);
    } else {
      // Add new item
      setRincianObjekData((prevData) => [
        ...prevData,
        { id: Date.now(), ...rincianObjekToSave },
      ]);
      console.log("Menyimpan Rincian Objek baru:", rincianObjekToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const rincianObjekToEdit = rincianObjekData.find((item) => item.id === id);
    if (rincianObjekToEdit) {
      setEditingRincianObjek(rincianObjekToEdit);
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

    if (result.isConfirmed) {
      setRincianObjekData((prevData) =>
        prevData.filter((item) => item.id !== id)
      );
      showSuccessAlert("Data berhasil dihapus.");
      console.log("Menghapus Rincian Objek dengan ID:", id);
    }
  };

  const handleEntriesPerPageChange = (value) => {
    const newValue = Number(value);
    setEntriesPerPage(newValue);
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: newValue,
      page: 0,
    }));
  };

  // Table columns configuration
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = rincianObjekData.findIndex(
          (row) => row.id === params.row.id
        );
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    { field: "aset1", headerName: "Aset 1", width: 150 },
    { field: "aset2", headerName: "Aset 2", width: 150 },
    { field: "aset3", headerName: "Aset 3", width: 150 },
    { field: "aset4", headerName: "Aset 4", width: 150 },
    { field: "kodeAset5", headerName: "Kode Aset 5", width: 150 },
    { field: "namaAset5", headerName: "Nama Aset 5", flex: 1 },
    { field: "kode", headerName: "Kode", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
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
  ];

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header and Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Klasifikasi Aset 5
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} /> Add Rincian
              </button>
            </div>
          </div>

          {/* Controls: Show entries and Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => handleEntriesPerPageChange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                {[5, 10, 25, 50, 100].map((n) => (
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

          {/* Data Table */}
          <DataTable
            rows={filteredData}
            columns={columns}
            initialPageSize={entriesPerPage}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
            paginationModel={dataTablePaginationModel}
            onPaginationModelChange={setDataTablePaginationModel}
            loading={loading || refreshing}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddRincianObjekModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewRincianObjek}
        initialData={editingRincianObjek}
      />
    </div>
  );
};

export default RincianObjekPage;
