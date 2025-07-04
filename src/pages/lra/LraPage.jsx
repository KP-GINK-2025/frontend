import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";

const LraPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [lraData, setLraData] = useState([]);

  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setBidangData([{ id: 1, nama: "Bidang A" }, { id: 2, nama: "Bidang B" }]);
      setUnitData([{ id: 1, nama: "Unit A" }, { id: 2, nama: "Unit B" }]);
      setSubUnitData([{ id: 1, nama: "Sub A" }, { id: 2, nama: "Sub B" }]);
      setUpbData([{ id: 1, nama: "UPB A" }, { id: 2, nama: "UPB B" }]);
      setSemesterData([{ id: 1, nama: "Semester 1" }, { id: 2, nama: "Semester 2" }]);
      setTahunData(["2023", "2024"]);
      setLraData([]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredData = lraData.filter(item => {
    const matchesSearch = item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upb?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBidang = selectedBidang === "" || item.bidang === selectedBidang;
    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;
    const matchesSubUnit = selectedSubUnit === "" || item.subUnit === selectedSubUnit;
    const matchesUpb = selectedUpb === "" || item.upb === selectedUpb;
    const matchesSemester = selectedSemester === "" || item.semester === selectedSemester;
    const matchesTahun = selectedTahun === "" || item.tahun === selectedTahun;

    return matchesSearch && matchesBidang && matchesUnit && matchesSubUnit && matchesUpb && matchesSemester && matchesTahun;
  });

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleExport = () => console.log("Exporting LRA...");
  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSelectedUpb("");
    setSelectedSemester("");
    setSelectedTahun("");
    setTimeout(() => setLoading(false), 800);
  };
  const handleAddLra = () => console.log("Add LRA clicked");

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition-colors"
          >
            Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Daftar Laporan Realisasi Anggaran</h1>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              <select value={selectedBidang} onChange={e => setSelectedBidang(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Bidang -- </option>
                {bidangData.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
              </select>
              <select value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Unit -- </option>
                {unitData.map(u => <option key={u.id} value={u.nama}>{u.nama}</option>)}
              </select>
              <select value={selectedSubUnit} onChange={e => setSelectedSubUnit(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Sub Unit -- </option>
                {subUnitData.map(s => <option key={s.id} value={s.nama}>{s.nama}</option>)}
              </select>
              <select value={selectedUpb} onChange={e => setSelectedUpb(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- UPB -- </option>
                {upbData.map(u => <option key={u.id} value={u.nama}>{u.nama}</option>)}
              </select>
              <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Semester -- </option>
                {semesterData.map(s => <option key={s.id} value={s.nama}>{s.nama}</option>)}
              </select>
              <select value={selectedTahun} onChange={e => setSelectedTahun(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Tahun -- </option>
                {tahunData.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer">
                <RefreshCw size={16} /> Refresh
              </button>
              <button onClick={handleAddLra} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer">
                <Plus size={16} /> Add LRA
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-sm text-gray-600 gap-4 md:gap-0">
            <div className="flex items-center gap-2">
              Show
              <select value={entriesPerPage} onChange={e => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded px-2 py-1">
                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              entries
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  {["Semester", "Bidang", "Unit", "Sub Unit", "UPB", "Nilai Total", "Keterangan"].map(header => (
                    <th key={header} className="text-left py-3 px-4 font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading...</td></tr>
                ) : currentData.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">No data available in table</td></tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{item.semester}</td>
                      <td className="py-3 px-4">{item.bidang}</td>
                      <td className="py-3 px-4">{item.unit}</td>
                      <td className="py-3 px-4">{item.subUnit}</td>
                      <td className="py-3 px-4">{item.upb}</td>
                      <td className="py-3 px-4">{item.nilaiTotal}</td>
                      <td className="py-3 px-4">{item.keterangan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-600 gap-4 md:gap-0">
            <div>
              Showing {Math.min(startIndex + 1, totalEntries)} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex gap-2">
              <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                Previous
              </button>
              <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LraPage;
