import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddUnitModal from "./AddUnitModal";
import DataTable from "../../../../components/DataTable";

const UnitPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);

  const [unitData, setUnitData] = useState([]);
  const [bidangData, setBidangData] = useState([]);
  const [selectedBidang, setSelectedBidang] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // State untuk melacak pagination model dari DataTable
  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      // Dummy data untuk pengujian
      setBidangData([
        { id: 1, namaBidang: "1 - Sekwan/DPRD" },
        { id: 2, namaBidang: "2 - Gubernur/Bupati/Walikota" },
        { id: 3, namaBidang: "3 - Wakil Gubernur/Bupati/Walikota" },
      ]);
      setUnitData([
        {
          id: 1,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          kodeUnit: "1",
          namaUnit: "Sekretariat DPRD",
          kode: "ABC1",
        },
        {
          id: 2,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          kodeUnit: "1",
          namaUnit: "Bupati Tanggamus",
          kode: "ABC2",
        },
        {
          id: 3,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          kodeUnit: "2",
          namaUnit: "Bagian Keuangan",
          kode: "ABC3",
        },
        {
          id: 4,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "3 - Wakil Gubernur/Bupati/Walikota",
          kodeUnit: "1",
          namaUnit: "Wakil Bupati Tanggamus",
          kode: "ABC4",
        },
        {
          id: 5,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          kodeUnit: "3",
          namaUnit: "Bagian Umum",
          kode: "ABC5",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = unitData.filter((item) => {
    const matchesSearch =
      item.namaUnit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeUnit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bidang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provinsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kabKot?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBidang =
      selectedBidang === "" || item.bidang === selectedBidang;

    return matchesSearch && matchesBidang;
  });

  const handleExport = () => {
    console.log("Exporting unit data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedBidang("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingUnit(null); // Penting: Reset editing state saat ingin menambah baru
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUnit(null); // Reset editing state saat modal ditutup
  };

  const handleSaveNewUnit = (unitToSave) => {
    if (unitToSave.id) {
      // Ini adalah mode edit
      setUnitData((prevData) =>
        prevData.map((item) => (item.id === unitToSave.id ? unitToSave : item))
      );
      console.log("Update Unit:", unitToSave);
    } else {
      // Ini adalah mode tambah baru
      setUnitData((prevData) => [
        ...prevData,
        { id: Date.now(), ...unitToSave }, // Buat ID baru
      ]);
      console.log("Menyimpan Unit baru:", unitToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const unitToEdit = unitData.find((item) => item.id === id);
    if (unitToEdit) {
      setEditingUnit(unitToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setUnitData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Unit dengan ID:", id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "provinsi", headerName: "Provinsi", width: 180 },
    { field: "kabKot", headerName: "Kabupaten/Kota", width: 250 },
    { field: "bidang", headerName: "Bidang", width: 180 },
    {
      field: "kodeUnit",
      headerName: "Kode Unit",
      type: "number",
      width: 150,
    },
    { field: "namaUnit", headerName: "Nama Unit", flex: 1 },
    { field: "kode", headerName: "Kode", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          {" "}
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
              {/* Filter Bidang */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Bidang</label>
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value=""> -- Pilih Bidang -- </option>
                  {bidangData.map((b) => (
                    <option key={b.id} value={b.namaBidang}>
                      {b.namaBidang}
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
                <Plus size={16} /> Add Unit
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
              emptyRowsMessage="No Unit data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewUnit}
        initialData={editingUnit}
      />
    </div>
  );
};

export default UnitPage;
