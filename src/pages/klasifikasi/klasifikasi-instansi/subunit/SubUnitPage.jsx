import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddSubUnitModal from "./AddSubUnitModal";
import DataTable from "../../../../components/DataTable";

const SubUnitPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [subUnitData, setSubUnitData] = useState([]);
  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubUnit, setEditingSubUnit] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setBidangData([
        { id: 1, namaBidang: "1 - Sekwan/DPRD" },
        { id: 2, namaBidang: "2 - Gubernur/Bupati/Walikota" },
      ]);
      setUnitData([
        { id: 1, namaUnit: "1 - Sekretariat DPRD" },
        { id: 2, namaUnit: "1 - Bupati Tanggamus" },
      ]);
      setSubUnitData([
        {
          id: 1,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          kodeSubUnit: "1",
          namaSubUnit: "Sub Unit A",
          kode: "ABC1",
        },
        {
          id: 2,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          unit: "1 - Bupati Tanggamus",
          kodeSubUnit: "2",
          namaSubUnit: "Sub Unit B",
          kode: "ABC2",
        },
        {
          id: 3,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          kodeSubUnit: "3",
          namaSubUnit: "Sub Unit C",
          kode: "ABC3",
        },
        {
          id: 4,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          unit: "1 - Bupati Tanggamus",
          kodeSubUnit: "4",
          namaSubUnit: "Sub Unit D",
          kode: "ABC4",
        },
        {
          id: 5,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          kodeSubUnit: "5",
          namaSubUnit: "Sub Unit E",
          kode: "ABC5",
        },
        {
          id: 6,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          unit: "1 - Bupati Tanggamus",
          kodeSubUnit: "6",
          namaSubUnit: "Sub Unit F",
          kode: "ABC6",
        },
        {
          id: 7,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          kodeSubUnit: "7",
          namaSubUnit: "Sub Unit G",
          kode: "ABC7",
        },
        {
          id: 8,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          unit: "1 - Bupati Tanggamus",
          kodeSubUnit: "8",
          namaSubUnit: "Sub Unit H",
          kode: "ABC8",
        },
        {
          id: 9,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          kodeSubUnit: "9",
          namaSubUnit: "Sub Unit I",
          kode: "ABC9",
        },
        {
          id: 10,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          unit: "1 - Bupati Tanggamus",
          kodeSubUnit: "10",
          namaSubUnit: "Sub Unit J",
          kode: "ABC10",
        },
        {
          id: 11,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "1 - Sekwan/DPRD",
          unit: "1 - Sekretariat DPRD",
          kodeSubUnit: "11",
          namaSubUnit: "Sub Unit K",
          kode: "ABC11",
        },
        {
          id: 12,
          provinsi: "18 - Lampung",
          kabKot: "0 - PEMERINTAH PROVINSI LAMPUNG",
          bidang: "2 - Gubernur/Bupati/Walikota",
          unit: "1 - Bupati Tanggamus",
          kodeSubUnit: "12",
          namaSubUnit: "Sub Unit L",
          kode: "ABC12",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = subUnitData.filter((item) => {
    const matchesSearch =
      item.namaSubUnit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeSubUnit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bidang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provinsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kabKot?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBidang =
      selectedBidang === "" || item.bidang === selectedBidang;

    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;

    return matchesSearch && matchesBidang && matchesUnit;
  });

  const handleExport = () => console.log("Exporting sub unit data...");

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    fetchData(); // Panggil ulang fungsi fetching data
  };

  const handleOpenAddModal = () => {
    setEditingSubUnit(null); // Penting: Reset editing state saat ingin menambah baru
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSubUnit(null); // Reset editing state saat modal ditutup
  };

  const handleSaveNewSubUnit = (subUnitToSave) => {
    if (subUnitToSave.id) {
      // Mode edit
      setSubUnitData((prevData) =>
        prevData.map((item) =>
          item.id === subUnitToSave.id ? subUnitToSave : item
        )
      );
      console.log("Update Sub Unit:", subUnitToSave);
    } else {
      // Mode add
      setSubUnitData((prevData) => [
        ...prevData,
        { id: Date.now(), ...subUnitToSave }, // Buat ID baru
      ]);
      console.log("Menyimpan Sub Unit baru:", subUnitToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const subUnitToEdit = subUnitData.find((item) => item.id === id);
    if (subUnitToEdit) {
      setEditingSubUnit(subUnitToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setSubUnitData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Sub Unit dengan ID:", id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "provinsi", headerName: "Provinsi", width: 180 },
    { field: "kabKot", headerName: "Kabupaten/Kota", width: 250 },
    { field: "bidang", headerName: "Bidang", width: 180 },
    { field: "unit", headerName: "Unit", width: 180 },
    {
      field: "kodeSubUnit",
      headerName: "Kode Sub Unit",
      type: "number",
      width: 150,
    },
    { field: "namaSubUnit", headerName: "Nama Sub Unit", flex: 1 },
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
            onClick={() => handleEditClick(params.row.id)} // Panggil handleEditClick
            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(params.row.id)} // Panggil handleDeleteClick
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
            <h1 className="text-2xl font-bold">Daftar Sub Unit</h1>
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
                  <option value="">-- Pilih Bidang --</option>
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
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Unit --</option>
                  {unitData.map((u) => (
                    <option key={u.id} value={u.namaUnit}>
                      {u.namaUnit}
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
                <Plus size={16} /> Add Sub Unit
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
              emptyRowsMessage="No Sub Unit data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>
      <AddSubUnitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewSubUnit}
        initialData={editingSubUnit}
      />
    </div>
  );
};

export default SubUnitPage;
