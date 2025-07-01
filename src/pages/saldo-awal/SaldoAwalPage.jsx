import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";

const SaldoAwalPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [tahunData, setTahunData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [subRincianAsetData, setSubRincianAsetData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [kualifikasiAsetData, setKualifikasiAsetData] = useState([]);
  const [kelompokAsetData, setKelompokAsetData] = useState([]);
  const [jenisAsetData, setJenisAsetData] = useState([]);
  const [objekAsetData, setObjekAsetData] = useState([]);
  const [saldoAwalData, setSaldoAwalData] = useState([]);

  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubRincianAset, setSelectedSubRincianAset] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");
  const [selectedKualifikasiAset, setSelectedKualifikasiAset] = useState("");
  const [selectedKelompokAset, setSelectedKelompokAset] = useState("");
  const [selectedJenisAset, setSelectedJenisAset] = useState("");
  const [selectedObjekAset, setSelectedObjekAset] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTahunData(["2023", "2024"]);
      setSemesterData([
        { id: 1, nama: "Semester 1" },
        { id: 2, nama: "Semester 2" }
      ]);
      setSubRincianAsetData([
        { id: 1, nama: "Sub Rincian Aset A" },
        { id: 2, nama: "Sub Rincian Aset B" }
      ]);
      setUnitData([
        { id: 1, nama: "Unit Anggaran" },
        { id: 2, nama: "Unit Gaji" }
      ]);
      setSubUnitData([
        { id: 1, nama: "Sub Unit A" },
        { id: 2, nama: "Sub Unit B" }
      ]);
      setUpbData([
        { id: 1, nama: "UPB A" },
        { id: 2, nama: "UPB B" }
      ]);
      setKualifikasiAsetData([
        { id: 1, nama: "Kualifikasi A" },
        { id: 2, nama: "Kualifikasi B" }
      ]);
      setKelompokAsetData([
        { id: 1, nama: "Kelompok A" },
        { id: 2, nama: "Kelompok B" }
      ]);
      setJenisAsetData([
        { id: 1, nama: "Jenis A" },
        { id: 2, nama: "Jenis B" }
      ]);
      setObjekAsetData([
        { id: 1, nama: "Objek A" },
        { id: 2, nama: "Objek B" }
      ]);
      setSaldoAwalData([]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredData = saldoAwalData.filter((item) => {
    const matchesSearch = 
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kualifikasiAset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisObjek?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTahun = selectedTahun === "" || item.tahun === selectedTahun;
    const matchesSemester = selectedSemester === "" || item.semester === selectedSemester;
    const matchesSubRincianAset = selectedSubRincianAset === "" || item.subRincianAset === selectedSubRincianAset;
    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;
    const matchesSubUnit = selectedSubUnit === "" || item.subUnit === selectedSubUnit;
    const matchesUpb = selectedUpb === "" || item.upb === selectedUpb;
    const matchesKualifikasiAset = selectedKualifikasiAset === "" || item.kualifikasiAset === selectedKualifikasiAset;
    const matchesKelompokAset = selectedKelompokAset === "" || item.kelompokAset === selectedKelompokAset;
    const matchesJenisAset = selectedJenisAset === "" || item.jenisAset === selectedJenisAset;
    const matchesObjekAset = selectedObjekAset === "" || item.objekAset === selectedObjekAset;

    return matchesSearch && matchesTahun && matchesSemester && matchesSubRincianAset && 
           matchesUnit && matchesSubUnit && matchesUpb && matchesKualifikasiAset && 
           matchesKelompokAset && matchesJenisAset && matchesObjekAset;
  });

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleExport = () => console.log("Exporting Saldo Awal...");
  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedTahun("");
    setSelectedSemester("");
    setSelectedSubRincianAset("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSelectedUpb("");
    setSelectedKualifikasiAset("");
    setSelectedKelompokAset("");
    setSelectedJenisAset("");
    setSelectedObjekAset("");
    setTimeout(() => setLoading(false), 800);
  };
  const handleAddSaldoAwal = () => console.log("Add Saldo Awal clicked");

  return (
  <div className="min-h-screen bg-[#f7f7f7]">
    {/* Navbar component */}
    <Navbar />

    <div className="px-8 py-8">
      {/* Breadcrumbs component */}
      <Breadcrumbs />

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download size={16} /> Export
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Saldo Awal</h1>

        {/* Filter Section */}
        <div className="mb-6 space-y-4"> {/* Added space-y-4 here for consistent spacing */}
          {/* Filter Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Grid (10 Dropdowns in 2 Rows) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
              {/* Row 1 */}
              <select value={selectedTahun} onChange={(e) => setSelectedTahun(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Tahun -- </option>
                {tahunData.map((tahun) => (
                  <option key={tahun} value={tahun}>{tahun}</option>
                ))}
              </select>

              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Semester -- </option>
                {semesterData.map((semester) => (
                  <option key={semester.id} value={semester.nama}>{semester.nama}</option>
                ))}
              </select>

              <select value={selectedSubRincianAset} onChange={(e) => setSelectedSubRincianAset(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Sub Rincian Aset -- </option>
                {subRincianAsetData.map((item) => (
                  <option key={item.id} value={item.nama}>{item.nama}</option>
                ))}
              </select>

              <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Unit -- </option>
                {unitData.map((unit) => (
                  <option key={unit.id} value={unit.nama}>{unit.nama}</option>
                ))}
              </select>

              <select value={selectedSubUnit} onChange={(e) => setSelectedSubUnit(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Sub Unit -- </option>
                {subUnitData.map((subUnit) => (
                  <option key={subUnit.id} value={subUnit.nama}>{subUnit.nama}</option>
                ))}
              </select>

              {/* Row 2 */}
              <select value={selectedUpb} onChange={(e) => setSelectedUpb(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- UPB -- </option>
                {upbData.map((upb) => (
                  <option key={upb.id} value={upb.nama}>{upb.nama}</option>
                ))}
              </select>

              <select value={selectedKualifikasiAset} onChange={(e) => setSelectedKualifikasiAset(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Kualifikasi Aset -- </option>
                {kualifikasiAsetData.map((item) => (
                  <option key={item.id} value={item.nama}>{item.nama}</option>
                ))}
              </select>

              <select value={selectedKelompokAset} onChange={(e) => setSelectedKelompokAset(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Kelompok Aset -- </option>
                {kelompokAsetData.map((item) => (
                  <option key={item.id} value={item.nama}>{item.nama}</option>
                ))}
              </select>

              <select value={selectedJenisAset} onChange={(e) => setSelectedJenisAset(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Jenis Aset -- </option>
                {jenisAsetData.map((item) => (
                  <option key={item.id} value={item.nama}>{item.nama}</option>
                ))}
              </select>

              <select value={selectedObjekAset} onChange={(e) => setSelectedObjekAset(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
                <option value=""> -- Objek Aset -- </option>
                {objekAsetData.map((item) => (
                  <option key={item.id} value={item.nama}>{item.nama}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-center">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleAddSaldoAwal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Saldo Awal
              </button>
            </div>
          </div>
        </div>

          {/* Table Controls: Show Entries and Search */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-sm text-gray-600 gap-4 md:gap-0"> {/* Added flex-col and gap for better small screen layout */}
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

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700">
                  {["Unit", "UPB", "Kualifikasi Aset", "Jenis/Objek", "Jumlah Barang", "Nilai Barang"].map((header) => (
                    <th key={header} className="text-left py-3 px-4 font-semibold">{header}</th>
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
                      <td className="py-3 px-4">{item.unit}</td>
                      <td className="py-3 px-4">{item.upb}</td>
                      <td className="py-3 px-4">{item.kualifikasiAset}</td>
                      <td className="py-3 px-4">{item.jenisObjek}</td>
                      <td className="py-3 px-4">{item.jumlahBarang}</td>
                      <td className="py-3 px-4">{item.nilaiBarang}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-600 gap-4 md:gap-0"> {/* Added flex-col and gap for better small screen layout */}
            <div>
              Showing {Math.min(startIndex + 1, totalEntries)} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
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

export default SaldoAwalPage;