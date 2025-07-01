import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddUpbModal from "./AddUpbModal"; // Import the AddUpbModal

const UpbPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]); // This will hold your UPB list

  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");

  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for modal

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // In a real application, you would fetch this data from your backend
      setBidangData([]);
      setUnitData([]);
      setSubUnitData([]);
      setUpbData([]);
      setLoading(false);
    }, 800);
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

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleExport = () => console.log("Exporting UPB data...");

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setCurrentPage(1); // Reset to first page on refresh
    // In a real application, you would re-fetch data here
    setTimeout(() => {
      // Re-populate dummy data or fetch from API
      setLoading(false);
    }, 800);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveNewUpb = (newUpb) => {
    console.log("Menyimpan data UPB baru:", newUpb);
    // Di sini Anda akan:
    // 1. Mengirim data `newUpb` ke backend API Anda (menggunakan fetch, axios, dll.)
    // 2. Jika berhasil, perbarui state `upbData` agar tabel menampilkan data baru
    // Pastikan `newUpb` memiliki ID yang unik jika API Anda tidak memberikannya
    setUpbData((prevData) => [
      ...prevData,
      { id: Date.now(), ...newUpb }, // Gunakan Date.now() sebagai ID sementara yang unik
    ]);
    handleCloseAddModal(); // Tutup modal setelah data disimpan
  };

  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
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
              className="border border-gray-300 rounded px-3 py-2 text-sm"
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
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Sub Unit -- </option>
              {subUnitData.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>

            {/* Tombol di kanan */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleOpenAddModal} // Changed to open the UPB modal
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
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
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {[10, 25, 50, 100].map((n) => (
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[
                    "Action",
                    "Bidang",
                    "Unit",
                    "Sub Unit",
                    "Kode UPB",
                    "Nama UPB",
                    "Kode", // Added "Kode" to table header
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
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
                      <td className="py-3 px-4 text-gray-700">{item.bidang}</td>
                      <td className="py-3 px-4 text-gray-700">{item.unit}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.subUnit}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.kodeUpb}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {item.namaUpb}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{item.kode}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
            <div>
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
      {/* Add the AddUpbModal component here */}
      <AddUpbModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewUpb}
      />
    </div>
  );
};

export default UpbPage;
