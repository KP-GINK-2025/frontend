import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import DataTable from "../../../../components/DataTable";
import AddSubSubRincianModal from "./AddSubSubRincianModal";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import Swal from "sweetalert2";

const SubSubRincianPage = () => {
  // Main data states
  const [subSubRincianData, setSubSubRincianData] = useState([]);
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
  const [asetLimaData, setAsetLimaData] = useState([]);
  const [asetEnamData, setAsetEnamData] = useState([]);

  // Selected filter values
  const [selectedAsetSatu, setSelectedAsetSatu] = useState("");
  const [selectedAsetDua, setSelectedAsetDua] = useState("");
  const [selectedAsetTiga, setSelectedAsetTiga] = useState("");
  const [selectedAsetEmpat, setSelectedAsetEmpat] = useState("");
  const [selectedAsetLima, setSelectedAsetLima] = useState("");
  const [selectedAsetEnam, setSelectedAsetEnam] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubSubRincian, setEditingSubSubRincian] = useState(null);

  // Pagination state
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: entriesPerPage,
  });

  // Data mapping helper
  const mapSubSubRincianData = (data) => {
    return data.map((item) => ({
      id: item.id,
      aset1: `${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
          ?.kelompok_aset?.akun_aset?.kode_akun_aset || ""
      } - ${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
          ?.kelompok_aset?.akun_aset?.nama_akun_aset || "-"
      }`,
      aset2: `${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
          ?.kelompok_aset?.kode_kelompok_aset || ""
      } - ${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
          ?.kelompok_aset?.nama_kelompok_aset || "-"
      }`,
      aset3: `${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
          ?.kode_jenis_aset || ""
      } - ${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
          ?.nama_jenis_aset || "-"
      }`,
      aset4: `${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset
          ?.kode_objek_aset || ""
      } - ${
        item.sub_rincian_aset?.rincian_objek_aset?.objek_aset
          ?.nama_objek_aset || "-"
      }`,
      aset5: `${
        item.sub_rincian_aset?.rincian_objek_aset?.kode_rincian_objek_aset || ""
      } - ${
        item.sub_rincian_aset?.rincian_objek_aset?.nama_rincian_objek_aset ||
        "-"
      }`,
      aset6: `${item.sub_rincian_aset?.kode_sub_rincian_aset || ""} - ${
        item.sub_rincian_aset?.nama_sub_rincian_aset || "-"
      }`,
      kodeAset7: item.kode_sub_sub_rincian_aset,
      namaAset7: item.nama_sub_sub_rincian_aset,
      kode: item.kode,
    }));
  };

  // Prepare filter dropdown data
  const prepareFilterData = (mappedData) => {
    const aset1Set = new Set();
    const aset2Set = new Set();
    const aset3Set = new Set();
    const aset4Set = new Set();
    const aset5Set = new Set();
    const aset6Set = new Set();

    mappedData.forEach((item) => {
      aset1Set.add(item.aset1);
      aset2Set.add(item.aset2);
      aset3Set.add(item.aset3);
      aset4Set.add(item.aset4);
      aset5Set.add(item.aset5);
      aset6Set.add(item.aset6);
    });

    setAsetSatuData([...aset1Set].map((v, i) => ({ id: i + 1, namaAset: v })));
    setAsetDuaData([...aset2Set].map((v, i) => ({ id: i + 1, namaAset2: v })));
    setAsetTigaData([...aset3Set].map((v, i) => ({ id: i + 1, namaAset3: v })));
    setAsetEmpatData(
      [...aset4Set].map((v, i) => ({ id: i + 1, namaAset4: v }))
    );
    setAsetLimaData([...aset5Set].map((v, i) => ({ id: i + 1, namaAset5: v })));
    setAsetEnamData([...aset6Set].map((v, i) => ({ id: i + 1, namaAset6: v })));
  };

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setRefreshing(true); // Spinner aktif juga saat fetch pertama kali
    try {
      const response = await api.get("/klasifikasi-aset/sub-sub-rincian-aset");
      const mappedData = mapSubSubRincianData(response.data.data);

      setSubSubRincianData(mappedData);
      prepareFilterData(mappedData);
    } catch (error) {
      console.error("Gagal fetch data sub sub rincian aset:", error);
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
  const filteredData = subSubRincianData.filter((item) => {
    const matchesSearch = [
      item.aset1,
      item.aset2,
      item.aset3,
      item.aset4,
      item.aset5,
      item.aset6,
      item.kodeAset7,
      item.namaAset7,
      item.kode,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilters = [
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu,
      selectedAsetDua === "" || item.aset2 === selectedAsetDua,
      selectedAsetTiga === "" || item.aset3 === selectedAsetTiga,
      selectedAsetEmpat === "" || item.aset4 === selectedAsetEmpat,
      selectedAsetLima === "" || item.aset5 === selectedAsetLima,
      selectedAsetEnam === "" || item.aset6 === selectedAsetEnam,
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
    setSelectedAsetLima("");
    setSelectedAsetEnam("");
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // Event handlers
  const handleExport = () => {
    console.log("Exporting sub sub rincian data...");
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
    setEditingSubSubRincian(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSubSubRincian(null);
  };

  const handleSaveNewSubSubRincian = (subSubRincianToSave) => {
    if (subSubRincianToSave.id) {
      // Update existing item
      setSubSubRincianData((prevData) =>
        prevData.map((item) =>
          item.id === subSubRincianToSave.id ? subSubRincianToSave : item
        )
      );
      console.log("Update Sub Sub Rincian:", subSubRincianToSave);
    } else {
      // Add new item
      setSubSubRincianData((prevData) => [
        ...prevData,
        { id: Date.now(), ...subSubRincianToSave },
      ]);
      console.log("Menyimpan Sub Sub Rincian baru:", subSubRincianToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const subSubRincianToEdit = subSubRincianData.find(
      (item) => item.id === id
    );
    if (subSubRincianToEdit) {
      setEditingSubSubRincian(subSubRincianToEdit);
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
      setSubSubRincianData((prevData) =>
        prevData.filter((item) => item.id !== id)
      );
      showSuccessAlert("Data berhasil dihapus.");
      console.log("Menghapus Sub Sub Rincian dengan ID:", id);
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
      width: 50,
      sortable: false,
      renderCell: (params) => {
        const index = subSubRincianData.findIndex(
          (row) => row.id === params.row.id
        );
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    { field: "aset1", headerName: "Aset 1", width: 100 },
    { field: "aset2", headerName: "Aset 2", width: 150 },
    { field: "aset3", headerName: "Aset 3", width: 150 },
    { field: "aset4", headerName: "Aset 4", width: 150 },
    { field: "aset5", headerName: "Aset 5", width: 150 },
    { field: "aset6", headerName: "Aset 6", width: 150 },
    { field: "kodeAset7", headerName: "Kode Aset 7", width: 150 },
    { field: "namaAset7", headerName: "Nama Aset 7", flex: 1 },
    { field: "kode", headerName: "Kode", width: 100 },
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
              Daftar Klasifikasi Aset 7
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
                <Plus size={16} /> Add Sub Sub Rincian
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
      <AddSubSubRincianModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewSubSubRincian}
        initialData={editingSubSubRincian}
      />
    </div>
  );
};

export default SubSubRincianPage;
