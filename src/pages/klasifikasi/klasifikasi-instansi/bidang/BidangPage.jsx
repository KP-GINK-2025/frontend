import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddBidangModal from "./AddBidangModal";
import DataTable from "../../../../components/DataTable";

const BidangPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);
  const [bidangData, setBidangData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State baru untuk mengontrol visibilitas modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBidang, setEditingBidang] = useState(null);

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
        { id: 1, kodeBidang: "1", namaBidang: "Sekwan/DPRD", kode: "BID001" },
        {
          id: 2,
          kodeBidang: "2",
          namaBidang: "Gubernur/Bupati/Walikota",
          kode: "BID002",
        },
        {
          id: 3,
          kodeBidang: "3",
          namaBidang: "Wakil Gubernur/Bupati/Walikota",
          kode: "BID003",
        },
        {
          id: 4,
          kodeBidang: "4",
          namaBidang: "Sekretariat Daerah",
          kode: "BID004",
        },
        { id: 5, kodeBidang: "5", namaBidang: "Inspektorat", kode: "BID005" },
        {
          id: 6,
          kodeBidang: "6",
          namaBidang: "Dinas Pendidikan",
          kode: "BID006",
        },
        {
          id: 7,
          kodeBidang: "7",
          namaBidang: "Dinas Kesehatan",
          kode: "BID007",
        },
        {
          id: 8,
          kodeBidang: "8",
          namaBidang: "Dinas Pekerjaan Umum",
          kode: "BID008",
        },
        {
          id: 9,
          kodeBidang: "9",
          namaBidang: "Dinas Pertanian",
          kode: "BID009",
        },
        {
          id: 10,
          kodeBidang: "10",
          namaBidang: "Dinas Lingkungan Hidup",
          kode: "BID010",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = bidangData.filter(
    (item) =>
      item.namaBidang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeBidang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingBidang(null); // Penting: Reset editing state saat ingin menambah baru
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingBidang(null); // Reset editing state saat modal ditutup
  };

  const handleSaveNewBidang = (bidangToSave) => {
    if (bidangToSave.id) {
      // Ini adalah mode edit
      setBidangData((prevData) =>
        prevData.map((item) =>
          item.id === bidangToSave.id ? bidangToSave : item
        )
      );
      console.log("Update Bidang:", bidangToSave);
    } else {
      // Ini adalah mode tambah baru
      setBidangData((prevData) => [
        ...prevData,
        { id: Date.now(), ...bidangToSave }, // Buat ID baru
      ]);
      console.log("Menyimpan Bidang baru:", bidangToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const bidangToEdit = bidangData.find((item) => item.id === id);
    if (bidangToEdit) {
      setEditingBidang(bidangToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setBidangData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Bidang dengan ID:", id);
    }
  };

  // Data kolom untuk MUI DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "kodeBidang",
      headerName: "Kode Bidang",
      type: "number",
      width: 150,
    },
    { field: "namaBidang", headerName: "Nama Bidang", flex: 1 },
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
            <h1 className="text-2xl font-bold text-gray-800">Data Bidang</h1>
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
                <Plus size={16} /> Add Bidang
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
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
              emptyRowsMessage="No Bidang data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddBidangModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewBidang}
        initialData={editingBidang}
      />
    </div>
  );
};

export default BidangPage;
