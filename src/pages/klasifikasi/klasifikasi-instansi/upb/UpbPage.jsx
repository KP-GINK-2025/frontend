import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddUpbModal from "./AddUpbModal";
import DataTable from "../../../../components/DataTable"; // Import DataTable

const UpbPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);

  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]); // Menyimpan daftar UPB

  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");

  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUpb, setEditingUpb] = useState(null); // State untuk data yang sedang diedit

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
        { id: 1, namaUnit: "1 - Sekretariat DPRD" },
        { id: 2, namaUnit: "1 - Bupati Tanggamus" },
        { id: 3, namaUnit: "1 - Wakil Bupati Tanggamus" },
      ]);
      setSubUnitData([
        { id: 1, namaSubUnit: "1 - Sekretariat DPRD" },
        { id: 2, namaSubUnit: "2 - Bagian Umum" },
        { id: 3, namaSubUnit: "1 - Bupati Tanggamus" },
        { id: 4, namaSubUnit: "1 - Wakil Bupati Tanggamus" },
      ]);
      setUpbData([
        {
          id: 1,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          subUnit: "1 - Sekretariat DPRD",
          kodeUpb: "1",
          namaUpb: "Sekretariat DPRD",
          kode: "1",
        },
        {
          id: 2,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          subUnit: "2 - Bagian Umum",
          kodeUpb: "1",
          namaUpb: "Subbag Tata Usaha",
          kode: "1",
        },
        {
          id: 3,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          unit: "1 - Bupati Tanggamus",
          subUnit: "1 - Bupati Tanggamus",
          kodeUpb: "101",
          namaUpb: "Bupati Tanggamus",
          kode: "10",
        },
        {
          id: 4,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "3 - Wakil Gubernur/Bupati/Walikota",
          unit: "1 - Wakil Bupati Tanggamus",
          subUnit: "1 - Wakil Bupati Tanggamus",
          kodeUpb: "101",
          namaUpb: "Wakil Bupati Tanggamus",
          kode: "10",
        },
      ]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = upbData.filter((item) => {
    const matchesSearch =
      item.namaUpb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeUpb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provinsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kabKot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bidang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subUnit?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBidang =
      selectedBidang === "" || item.bidang === selectedBidang;
    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;
    const matchesSubUnit =
      selectedSubUnit === "" || item.subUnit === selectedSubUnit;

    return matchesSearch && matchesBidang && matchesUnit && matchesSubUnit;
  });

  const handleExport = () => console.log("Exporting UPB data...");

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingUpb(null); // Penting: Reset editing state saat ingin menambah baru
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUpb(null); // Reset editing state saat modal ditutup
  };

  const handleSaveNewUpb = (upbToSave) => {
    if (upbToSave.id) {
      // Ini adalah mode edit
      setUpbData((prevData) =>
        prevData.map((item) => (item.id === upbToSave.id ? upbToSave : item))
      );
      console.log("Update UPB:", upbToSave);
    } else {
      // Ini adalah mode tambah baru
      setUpbData((prevData) => [
        ...prevData,
        { id: Date.now(), ...upbToSave }, // Buat ID baru
      ]);
      console.log("Menyimpan UPB baru:", upbToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const upbToEdit = upbData.find((item) => item.id === id);
    if (upbToEdit) {
      setEditingUpb(upbToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setUpbData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus UPB dengan ID:", id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "provinsi", headerName: "Provinsi", width: 180 },
    { field: "kabKot", headerName: "Kabupaten/Kota", width: 250 },
    { field: "bidang", headerName: "Bidang", width: 180 },
    { field: "unit", headerName: "Unit", width: 180 },
    { field: "subUnit", headerName: "Sub Unit", width: 180 },
    {
      field: "kodeUpb",
      headerName: "Kode UPB",
      type: "number",
      width: 150,
    },
    { field: "namaUpb", headerName: "Nama UPB", flex: 1 },
    { field: "kode", headerName: "Kode", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          {" "}
          {/* Tambahkan items-center */}
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
            <h1 className="text-2xl font-bold">Daftar UPB</h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-6 justify-between">
            <div className="flex flex-wrap items-center gap-6">
              {/* Filter Bidang */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Bidang</label>
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value=""> -- Bidang -- </option>
                  {bidangData.map((b) => (
                    <option key={b.id} value={b.namaBidang}>
                      {b.namaBidang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Unit */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Unit</label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value=""> -- Unit -- </option>
                  {unitData.map((u) => (
                    <option key={u.id} value={u.namaUnit}>
                      {u.namaUnit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Sub Unit */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Sub Unit</label>
                <select
                  value={selectedSubUnit}
                  onChange={(e) => setSelectedSubUnit(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value=""> -- Sub Unit -- </option>
                  {subUnitData.map((s) => (
                    <option key={s.id} value={s.namaSubUnit}>
                      {s.namaSubUnit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tombol di kanan */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add UPB
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
              emptyRowsMessage="No UPB data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>
      <AddUpbModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewUpb}
        initialData={editingUpb}
      />
    </div>
  );
};

export default UpbPage;
