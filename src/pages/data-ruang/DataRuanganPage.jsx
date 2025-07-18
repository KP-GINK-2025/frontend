import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddRuanganModal from "./AddRuanganModal";
import DataTable from "../../components/DataTable";

const DataRuanganPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);

  const [tahunData, setTahunData] = useState([]);
  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [ruanganData, setRuanganData] = useState([]); // Data utama untuk tabel

  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");

  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRuangan, setEditingRuangan] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setTahunData(["2023", "2024", "2025"]); // Dummy data
      setBidangData([
        { id: 1, nama: "Bidang Keuangan" },
        { id: 2, nama: "Bidang Umum" },
      ]);
      setUnitData([
        { id: 1, nama: "Unit Anggaran" },
        { id: 2, nama: "Unit Gaji" },
      ]);
      setSubUnitData([
        { id: 1, nama: "Sub Unit A" },
        { id: 2, nama: "Sub Unit B" },
      ]);
      setUpbData([
        { id: 1, nama: "UPB A" },
        { id: 2, nama: "UPB B" },
      ]);
      setRuanganData([
        {
          id: 1,
          tahun: "2024",
          bidang: "Bidang Keuangan",
          unit: "Unit Anggaran",
          subUnit: "Sub Unit A",
          upb: "UPB A",
          namaRuangan: "Ruang Direksi",
        },
        {
          id: 2,
          tahun: "2023",
          bidang: "Bidang Umum",
          unit: "Unit Gaji",
          subUnit: "Sub Unit B",
          upb: "UPB B",
          namaRuangan: "Ruang Rapat Utama",
        },
        {
          id: 3,
          tahun: "2024",
          bidang: "Bidang Keuangan",
          unit: "Unit Anggaran",
          subUnit: "Sub Unit A",
          upb: "UPB A",
          namaRuangan: "Ruang Server",
        },
      ]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = ruanganData.filter((item) => {
    const matchesSearch = item.namaRuangan
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTahun = selectedTahun === "" || item.tahun === selectedTahun;
    const matchesBidang =
      selectedBidang === "" || item.bidang === selectedBidang;
    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;
    const matchesSubUnit =
      selectedSubUnit === "" || item.subUnit === selectedSubUnit;
    const matchesUpb = selectedUpb === "" || item.upb === selectedUpb;

    return (
      matchesSearch &&
      matchesTahun &&
      matchesBidang &&
      matchesUnit &&
      matchesSubUnit &&
      matchesUpb
    );
  });

  const handleExport = () => console.log("Exporting Data Ruangan...");
  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedTahun("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSelectedUpb("");
    fetchData(); // Panggil ulang fetchData
  };

  const handleOpenAddModal = () => {
    setEditingRuangan(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingRuangan(null);
  };

  const handleSaveNewRuangan = (ruanganToSave) => {
    if (ruanganToSave.id) {
      // Mode Edit
      setRuanganData((prevData) =>
        prevData.map((item) =>
          item.id === ruanganToSave.id ? ruanganToSave : item
        )
      );
      console.log("Update Ruangan:", ruanganToSave);
    } else {
      // Mode Tambah Baru
      setRuanganData((prevData) => [
        ...prevData,
        { id: Date.now(), ...ruanganToSave },
      ]);
      console.log("Menyimpan Ruangan baru:", ruanganToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const ruanganToEdit = ruanganData.find((item) => item.id === id);
    if (ruanganToEdit) {
      setEditingRuangan(ruanganToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setRuanganData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Ruangan dengan ID:", id);
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
        const index = ruanganData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    { field: "tahun", headerName: "Tahun", width: 100 },
    { field: "bidang", headerName: "Bidang", width: 180 },
    { field: "unit", headerName: "Unit", width: 180 },
    { field: "subUnit", headerName: "Sub Unit", width: 180 },
    { field: "upb", headerName: "UPB", width: 150 },
    { field: "namaRuangan", headerName: "Nama Ruangan", flex: 1 },
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

        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        {/* Konten Utama dalam Kotak Putih */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* BARIS 1: Judul H1, Refresh, Add Ruangan */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Ruangan</h1>
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
                <Plus size={16} /> Add Ruangan
              </button>
            </div>
          </div>

          {/* BARIS 2: Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {" "}
            {/* Menggunakan grid untuk filter */}
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Tahun -- </option>
              {tahunData.map((tahun, i) => (
                <option key={i} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Bidang -- </option>
              {bidangData.map((b) => (
                <option key={b.id} value={b.nama}>
                  {b.nama}
                </option>
              ))}
            </select>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Unit -- </option>
              {unitData.map((u) => (
                <option key={u.id} value={u.nama}>
                  {u.nama}
                </option>
              ))}
            </select>
            <select
              value={selectedSubUnit}
              onChange={(e) => setSelectedSubUnit(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Sub Unit -- </option>
              {subUnitData.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
            <select
              value={selectedUpb}
              onChange={(e) => setSelectedUpb(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- UPB -- </option>
              {upbData.map((u) => (
                <option key={u.id} value={u.nama}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>

          {/* BARIS 3: Show entries dan Search Box */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
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
              <span>entries</span>
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
              emptyRowsMessage="No Ruangan data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddRuanganModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewRuangan}
        initialData={editingRuangan}
      />
    </div>
  );
};

export default DataRuanganPage;
