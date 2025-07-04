import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddObjekModal from "./AddObjekModal";
import DataTable from "../../../../components/DataTable";

const ObjekPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [objekData, setObjekData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk data filter Aset 1 2 3
  const [asetSatuData, setAsetSatuData] = useState([]);
  const [selectedAsetSatu, setSelectedAsetSatu] = useState("");

  const [asetDuaData, setAsetDuaData] = useState([]);
  const [selectedAsetDua, setSelectedAsetDua] = useState("");

  const [asetTigaData, setAsetTigaData] = useState([]);
  const [selectedAsetTiga, setSelectedAsetTiga] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingObjek, setEditingObjek] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setAsetSatuData([{ id: 1, namaAset: "Aset" }]);

      setAsetDuaData([
        { id: 1, namaAset2: "Aset Lancar" },
        { id: 2, namaAset2: "Aset Tetap" },
        { id: 3, namaAset2: "Aset Lainnya" },
      ]);

      setAsetTigaData([
        { id: 1, namaAset3: "Tanah" },
        { id: 2, namaAset3: "Peralatan dan Mesin" },
        { id: 3, namaAset3: "Gedung dan Bangunan" },
      ]);

      // Dummy data untuk Objek (Aset 4)
      setObjekData([
        {
          id: 1,
          aset1: "Aset",
          aset2: "Aset Tetap",
          aset3: "Tanah",
          kodeAset4: "1",
          namaAset4: "Tanah",
          kode: "1",
        },
        {
          id: 2,
          aset1: "Aset",
          aset2: "Aset Tetap",
          aset3: "Peralatan dan Mesin",
          kodeAset4: "2",
          namaAset4: "Alat Berat",
          kode: "2",
        },
        {
          id: 3,
          aset1: "Aset",
          aset2: "Aset Tetap",
          aset3: "Peralatan dan Mesin",
          kodeAset4: "3",
          namaAset4: "Alat Angkutan",
          kode: "3",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = objekData.filter((item) => {
    const matchesSearch =
      item.aset1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeAset4?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaAset4?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAsetSatu =
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu;
    const matchesAsetDua =
      selectedAsetDua === "" || item.aset2 === selectedAsetDua;
    const matchesAsetTiga = // Filter Aset 3
      selectedAsetTiga === "" || item.aset3 === selectedAsetTiga;

    return (
      matchesSearch && matchesAsetSatu && matchesAsetDua && matchesAsetTiga
    );
  });

  const handleExport = () => {
    console.log("Exporting objek data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedAsetSatu("");
    setSelectedAsetDua("");
    setSelectedAsetTiga("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingObjek(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingObjek(null);
  };

  const handleSaveNewObjek = (objekToSave) => {
    if (objekToSave.id) {
      setObjekData((prevData) =>
        prevData.map((item) =>
          item.id === objekToSave.id ? objekToSave : item
        )
      );
      console.log("Update Objek:", objekToSave);
    } else {
      setObjekData((prevData) => [
        ...prevData,
        { id: Date.now(), ...objekToSave },
      ]);
      console.log("Menyimpan Objek baru:", objekToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const objekToEdit = objekData.find((item) => item.id === id);
    if (objekToEdit) {
      setEditingObjek(objekToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setObjekData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Objek dengan ID:", id);
    }
  };

  // Data kolom untuk MUI DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "aset1", headerName: "Aset 1", width: 200 },
    { field: "aset2", headerName: "Aset 2", width: 200 },
    { field: "aset3", headerName: "Aset 3", width: 200 },
    {
      field: "kodeAset4",
      headerName: "Kode Aset 4",
      type: "number",
      width: 150,
    },
    { field: "namaAset4", headerName: "Nama Aset 4", flex: 1 },
    { field: "kode", headerName: "Kode", width: 120 },
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
          {/* Header dan Tombol Aksi (Refresh, Add) */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Klasifikasi Aset 4
            </h1>
          </div>

          {/* Baris Filter (Aset 1, Aset 2) */}
          <div className="flex flex-wrap items-center gap-6 mb-6 justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Aset 1</label>
                <select
                  value={selectedAsetSatu}
                  onChange={(e) => setSelectedAsetSatu(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value=""> -- Pilih Aset 1 -- </option>
                  {asetSatuData.map((b) => (
                    <option key={b.id} value={b.namaAset}>
                      {b.namaAset}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Aset 2</label>
                <select
                  value={selectedAsetDua}
                  onChange={(e) => setSelectedAsetDua(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value=""> -- Pilih Aset 2 -- </option>
                  {asetDuaData.map((b) => (
                    <option key={b.id} value={b.namaAset2}>
                      {b.namaAset2}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Aset 3</label>
                <select
                  value={selectedAsetTiga}
                  onChange={(e) => setSelectedAsetTiga(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value=""> -- Pilih Aset 3 -- </option>
                  {asetTigaData.map((b) => (
                    <option key={b.id} value={b.namaAset3}>
                      {b.namaAset3}
                    </option>
                  ))}
                </select>
              </div>
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
                <Plus size={16} /> Add Aset 4
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
              emptyRowsMessage="No Objek data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddObjekModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewObjek}
        initialData={editingObjek}
      />
    </div>
  );
};

export default ObjekPage;
