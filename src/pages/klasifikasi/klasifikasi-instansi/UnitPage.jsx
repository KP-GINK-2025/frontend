import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";

const UnitPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [unitData, setUnitData] = useState([]);
  const [bidangData, setBidangData] = useState([]);
  const [selectedBidang, setSelectedBidang] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call for bidang dropdown data
    setTimeout(() => {
      setBidangData([
        { id: 1, kodeBidang: "BD001", namaBidang: "Bidang Keuangan" },
        { id: 2, kodeBidang: "BD002", namaBidang: "Bidang SDM" },
        { id: 3, kodeBidang: "BD003", namaBidang: "Bidang Perencanaan" },
        // Add more bidang data as needed
      ]);
      setUnitData([
        // Add your unit data here when available
        // Example:
        // { 
        //   id: 1, 
        //   bidang: "Bidang Keuangan", 
        //   kodeUnit: "UN001", 
        //   namaUnit: "Unit Anggaran", 
        //   kode: "UA" 
        // },
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
      item.bidang?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBidang = selectedBidang === "" || item.bidang === selectedBidang;
    
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
    setCurrentPage(1);
    // Simulate API call for refresh
    setTimeout(() => {
      setUnitData([
        // Refresh data - replace with actual API call
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleAddUnit = () => {
    // Implement add unit functionality
    console.log("Adding new unit...");
    // You can navigate to add form or open modal here
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
              <option value=""> -- Pilih Bidang -- </option>
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
                onClick={handleAddUnit}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Bidang</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kode Unit</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Unit</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kode</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
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
                      <td className="py-3 px-4 text-gray-700">{item.kodeUnit}</td>
                      <td className="py-3 px-4 text-gray-700">{item.namaUnit}</td>
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
              Show {Math.min(startIndex + 1, totalEntries)} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
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
    </div>
  );
};

export default UnitPage;