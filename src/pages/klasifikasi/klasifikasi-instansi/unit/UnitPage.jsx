// pages/klasifikasi/klasifikasi-instansi/bidang/UnitPage.jsx (asumsi ini adalah path yang benar)

import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddUnitModal from "./AddUnitModal";

const UnitPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [unitData, setUnitData] = useState([]);
  const [bidangData, setBidangData] = useState([]);
  const [selectedBidang, setSelectedBidang] = useState("");
  const [loading, setLoading] = useState(true);

  // State untuk mengontrol visibilitas modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call for bidang dropdown data
    setTimeout(() => {
      setBidangData([
        // Add more bidang data as needed
      ]);
      setUnitData([
        // Contoh data awal (bisa Anda ganti dengan data dari API)
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on search term and selected bidang
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

  // Pagination logic
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting unit data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedBidang("");

    setTimeout(() => {
      // Isi ulang data yang hilang, jangan dikosongkan
      setLoading(false);
    }, 1000);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Fungsi untuk menangani data yang disimpan dari modal
  const handleSaveNewUnit = (newUnit) => {
    console.log("Menyimpan data unit baru:", newUnit);
    // Di sini Anda akan:
    // 1. Mengirim data `newUnit` ke backend API Anda (menggunakan fetch, axios, dll.)
    // 2. Jika berhasil, perbarui state `unitData` agar tabel menampilkan data baru
    //    Pastikan `newUnit` memiliki ID yang unik jika API Anda tidak memberikannya
    setUnitData((prevData) => [
      ...prevData,
      { id: Date.now(), ...newUnit }, // Gunakan Date.now() sebagai ID sementara
    ]);
    handleCloseAddModal(); // Tutup modal setelah data disimpan
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button - Outside main card */}
        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Daftar Unit</h1>
          </div>

          {/* Filter + Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Dropdown Filter */}
            <select
              value={selectedBidang}
              onChange={(e) => {
                setSelectedBidang(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value=""> -- Bidang -- </option>
              {bidangData.map((bidang) => (
                <option key={bidang.id} value={bidang.namaBidang}>
                  {bidang.namaBidang}
                </option>
              ))}
            </select>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Add Unit
              </button>
            </div>
          </div>

          {/* Entries & Search Control */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Action
                  </th>

                  {/* <-- Tambah header ini */}
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Bidang
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Kode Unit
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Nama Unit
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Kode
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      {" "}
                      {/* colspan disesuaikan */}
                      Loading...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      {" "}
                      {/* colspan disesuaikan */}
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            Delete
                          </button>
                        </div>
                      </td>

                      {/* <-- Tambah render data ini */}
                      <td className="py-3 px-4 text-gray-700">{item.bidang}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.kodeUnit}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.namaUnit}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{item.kode}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Show {Math.min(startIndex + 1, totalEntries)} to{" "}
              {Math.min(endIndex, totalEntries)} of {totalEntries} entries
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Komponen AddUnitModal */}
      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewUnit} // Memastikan onSave menerima data yang lengkap
      />
    </div>
  );
};

export default UnitPage;
