import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddJenisModal from "./AddJenisModal";
import DataTable from "../../../../components/DataTable";

const JenisPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [jenisData, setJenisData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk data filter Aset 1 dan Aset 2
  const [asetSatuData, setAsetSatuData] = useState([]); // Data untuk dropdown Aset 1
  const [selectedAsetSatu, setSelectedAsetSatu] = useState(""); // Nilai terpilih Aset 1

  const [asetDuaData, setAsetDuaData] = useState([]); // Data untuk dropdown Aset 2
  const [selectedAsetDua, setSelectedAsetDua] = useState(""); // Nilai terpilih Aset 2

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJenis, setEditingJenis] = useState(null); // State untuk data yang sedang diedit

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/klasifikasi-aset/jenis-aset");

      const mappedJenis = response.data.data.map((item) => ({
        id: item.id,
        aset1: item.kelompok_aset?.akun_aset
          ? `${item.kelompok_aset.akun_aset.kode_akun_aset} - ${item.kelompok_aset.akun_aset.nama_akun_aset}`
          : "-",
        aset2: item.kelompok_aset
          ? `${item.kelompok_aset.kode_kelompok_aset} - ${item.kelompok_aset.nama_kelompok_aset}`
          : "-",
        kodeAset3: item.kode_jenis_aset,
        namaAset3: item.nama_jenis_aset,
        kode: item.kode,
      }));

      setJenisData(mappedJenis);

      // Isi filter aset 1 & 2
      const asetSatuSet = new Set();
      const asetDuaSet = new Set();

      mappedJenis.forEach((item) => {
        asetSatuSet.add(item.aset1);
        asetDuaSet.add(item.aset2);
      });

      setAsetSatuData(
        [...asetSatuSet].map((v, i) => ({ id: i + 1, namaAset: v }))
      );
      setAsetDuaData(
        [...asetDuaSet].map((v, i) => ({ id: i + 1, namaAset2: v }))
      );
    } catch (error) {
      console.error("Gagal fetch data jenis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = jenisData.filter((item) => {
    const matchesSearch =
      item.aset1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeAset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaAset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAsetSatu =
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu;
    const matchesAsetDua =
      selectedAsetDua === "" || item.aset2 === selectedAsetDua;

    return matchesSearch && matchesAsetSatu && matchesAsetDua;
  });

  const handleExport = () => {
    console.log("Exporting jenis data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedAsetSatu(""); // Reset filter Aset 1
    setSelectedAsetDua(""); // Reset filter Aset 2
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingJenis(null); // Reset editing state saat ingin menambah baru
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingJenis(null); // Reset editing state saat modal ditutup
  };

  const handleSaveNewJenis = (jenisToSave) => {
    if (jenisToSave.id) {
      setJenisData((prevData) =>
        prevData.map((item) =>
          item.id === jenisToSave.id ? jenisToSave : item
        )
      );
      console.log("Update Jenis:", jenisToSave);
    } else {
      setJenisData((prevData) => [
        ...prevData,
        { id: Date.now(), ...jenisToSave },
      ]);
      console.log("Menyimpan Jenis baru:", jenisToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const jenisToEdit = jenisData.find((item) => item.id === id);
    if (jenisToEdit) {
      setEditingJenis(jenisToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setJenisData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Jenis dengan ID:", id);
    }
  };

  // Data kolom untuk MUI DataGrid
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = jenisData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    { field: "aset1", headerName: "Aset 1", width: 200 },
    { field: "aset2", headerName: "Aset 2", width: 200 },
    {
      field: "kodeAset3",
      headerName: "Kode Aset 3",
      width: 150,
    },
    { field: "namaAset3", headerName: "Nama Aset 3", flex: 1 },
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

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-wrap items-center gap-6 mb-6 justify-between">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Daftar Klasifikasi Aset 3
              </h1>
            </div>
            {/* Tombol di kanan */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} /> Add Jenis
              </button>
            </div>
          </div>

          {/* Baris Show entries + Search Box */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {/* Show entries */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setDataTablePaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0,
                  }));
                }}
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

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* DataTable Component */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No Jenis data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddJenisModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewJenis}
        initialData={editingJenis}
      />
    </div>
  );
};

export default JenisPage;
