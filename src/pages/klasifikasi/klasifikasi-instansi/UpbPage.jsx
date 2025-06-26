import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";

const UpbPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);

  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
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
      setUpbData([]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredData = upbData.filter((item) => {
    const matchesSearch =
      item.namaUpb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeUpb?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBidang = selectedBidang === "" || item.bidang === selectedBidang;
    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;
    const matchesSubUnit = selectedSubUnit === "" || item.subUnit === selectedSubUnit;

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
    setTimeout(() => {
      setUnitData([
        { id: 1, nama: "Unit Anggaran" },
        { id: 2, nama: "Unit Gaji" },
      ]);
      setLoading(false);
    }, 800);
  };
  const handleAddUpb = () => console.log("Add UPB clicked");

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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Daftar UPB</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Pilih Bidang -- </option>
              {bidangData.map((b) => (
                <option key={b.id} value={b.nama}>{b.nama}</option>
              ))}
            </select>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Pilih Unit -- </option>
              {unitData.map((u) => (
                <option key={u.id} value={u.nama}>{u.nama}</option>
              ))}
            </select>

            <select
              value={selectedSubUnit}
              onChange={(e) => setSelectedSubUnit(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Pilih Sub Unit -- </option>
              {subUnitData.map((s) => (
                <option key={s.id} value={s.nama}>{s.nama}</option>
              ))}
            </select>

            <div className="flex gap-2 items-center col-span-2 justify-end">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={handleAddUpb}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Add UPB
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
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
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              entries
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  {["Action", "Bidang", "Unit", "Sub Unit", "Kode UPB", "Nama UPB"].map((header) => (
                    <th key={header} className="text-left py-3 px-4 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">No data available in table</td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                          <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                        </div>
                      </td>
                      <td className="py-3 px-4">{item.bidang}</td>
                      <td className="py-3 px-4">{item.unit}</td>
                      <td className="py-3 px-4">{item.subUnit}</td>
                      <td className="py-3 px-4">{item.kodeUpb}</td>
                      <td className="py-3 px-4">{item.namaUpb}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
            <div>
              Show {Math.min(startIndex + 1, totalEntries)} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
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

export default UpbPage;
