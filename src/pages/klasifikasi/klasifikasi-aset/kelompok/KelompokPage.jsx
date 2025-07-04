import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddKelompokModal from "./AddKelompokModal";
import DataTable from "../../../../components/DataTable";

const KelompokPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [kelompokData, setKelompokData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [asetSatuData, setAsetSatuData] = useState([]);
  const [selectedAsetSatu, setSelectedAsetSatu] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingKelompok, setEditingKelompok] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setAsetSatuData([{ id: 1, namaAset: "Aset" }]);

      setKelompokData([
        {
          id: 1,
          aset1: "Aset",
          kodeAset2: "1",
          namaAset2: "Aset Lancar",
          kode: "1",
        },
        {
          id: 2,
          aset1: "Aset",
          kodeAset2: "3",
          namaAset2: "Aset Tetap",
          kode: "3",
        },
        {
          id: 3,
          aset1: "Aset",
          kodeAset2: "5",
          namaAset2: "Aset Lainnya",
          kode: "5",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = kelompokData.filter((item) => {
    const matchesSearch =
      item.aset1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeAset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaAset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAsetSatu =
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu;

    return matchesSearch && matchesAsetSatu;
  });

  const handleExport = () => {
    console.log("Exporting kelompok data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedAsetSatu("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingKelompok(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingKelompok(null);
  };

  const handleSaveNewKelompok = (kelompokToSave) => {
    if (kelompokToSave.id) {
      setKelompokData((prevData) =>
        prevData.map((item) =>
          item.id === kelompokToSave.id ? kelompokToSave : item
        )
      );
      console.log("Update Kelompok:", kelompokToSave);
    } else {
      setKelompokData((prevData) => [
        ...prevData,
        { id: Date.now(), ...kelompokToSave },
      ]);
      console.log("Menyimpan Kelompok baru:", kelompokToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const kelompokToEdit = kelompokData.find((item) => item.id === id);
    if (kelompokToEdit) {
      setEditingKelompok(kelompokToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setKelompokData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Kelompok dengan ID:", id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "aset1", headerName: "Aset 1", width: 250 },
    {
      field: "kodeAset2",
      headerName: "Kode Aset 2",
      type: "number",
      width: 150,
    },
    { field: "namaAset2", headerName: "Nama Aset 2", flex: 1 },
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Daftar Unit</h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-6 justify-between">
            <div className="flex flex-wrap items-center gap-6">
              {/* Filter Aset 1 */}
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
                <Plus size={16} /> Add Aset 2
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              Show
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
                className="border border-gray-300 rounded px-2 py-1"
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              entries
            </div>
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

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No Aset 2 data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddKelompokModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewKelompok}
        initialData={editingKelompok}
      />
    </div>
  );
};

export default KelompokPage;
