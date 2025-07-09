import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react";

const PenggunaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBlok, setSelectedBlok] = useState("");
  const [selectedGrup, setSelectedGrup] = useState("");

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const dummyUsers = [
      {
        id: 1,
        username: "admin01",
        namaLengkap: "Administrator Satu",
        email: "admin01@tanggamus.go.id",
        terakhirLogin: "2025-07-09 10:00",
        blok: "A",
        grup: "Admin",
        upb: "UPB 1",
      },
      {
        id: 2,
        username: "keuangan02",
        namaLengkap: "Keuangan Dua",
        email: "keuangan02@tanggamus.go.id",
        terakhirLogin: "2025-07-08 16:30",
        blok: "B",
        grup: "Keuangan",
        upb: "UPB 2",
      },
    ];
    setTimeout(() => {
      setTableData(dummyUsers);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleAddUser = () => {
    alert("Fitur tambah user belum diimplementasikan.");
  };

  const handleExport = () => {
    alert("Fitur export belum diimplementasikan.");
  };

  const filteredData = tableData.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlok = selectedBlok ? item.blok === selectedBlok : true;
    const matchesGrup = selectedGrup ? item.grup === selectedGrup : true;
    return matchesSearch && matchesBlok && matchesGrup;
  });

  const paginatedData = filteredData.slice(0, showEntries);

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans">
      <Navbar />
      <div className="px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumbs />
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Daftar User</h1>

          {/* Filter Blok/Grup + Refresh/Add User */}
          <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <label>Blok</label>
                <select
                  value={selectedBlok}
                  onChange={(e) => setSelectedBlok(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Semua</option>
                  <option value="A">Blok A</option>
                  <option value="B">Blok B</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label>Grup</label>
                <select
                  value={selectedGrup}
                  onChange={(e) => setSelectedGrup(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Semua</option>
                  <option value="Admin">Admin</option>
                  <option value="Keuangan">Keuangan</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleAddUser}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <Plus size={16} /> Add User
              </button>
            </div>
          </div>

          {/* Show entries + Search in same row */}
          <div className="flex justify-between items-center flex-wrap gap-4 mb-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              Show
              <select
                className="border px-2 py-1 rounded"
                value={showEntries}
                onChange={(e) => setShowEntries(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
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

          {/* Table */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <th className="py-3 px-6">Action</th>
                  <th className="py-3 px-6">Username</th>
                  <th className="py-3 px-6">Nama Lengkap</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Terakhir Login</th>
                  <th className="py-3 px-6">Blok</th>
                  <th className="py-3 px-6">Grup</th>
                  <th className="py-3 px-6">UPB</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">Memuat data...</td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">Tidak ada data tersedia</td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                      <td className="py-4 px-6">{item.username}</td>
                      <td className="py-4 px-6">{item.namaLengkap}</td>
                      <td className="py-4 px-6">{item.email}</td>
                      <td className="py-4 px-6">{item.terakhirLogin}</td>
                      <td className="py-4 px-6">{item.blok}</td>
                      <td className="py-4 px-6">{item.grup}</td>
                      <td className="py-4 px-6">{item.upb}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Info & Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
            <div>
              Show {paginatedData.length > 0 ? 1 : 0} to {paginatedData.length} of {filteredData.length} entries
            </div>
            <div className="flex gap-2">
              <button className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100" disabled>
                Previous
              </button>
              <button className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenggunaPage;
