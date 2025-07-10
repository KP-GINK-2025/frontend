import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdatingDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedBlok, setSelectedBlok] = useState("");
  const [selectedGrup, setSelectedGrup] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const dummyUsers = [
      {
        id: 1,
        username: "superadmin",
        namaLengkap: "Super Admin",
        email: "superadmin@tanggamus.go.id",
        terakhirLogin: "2025-07-09T10:00:00",
        blok: "A",
        grup: "Admin",
        upb: "UPB 1",
        objek: "User",
        actionType: "Update",
        actionTitle: "Ubah Password",
        ip: "192.168.1.1",
      },
      {
        id: 2,
        username: "dispora",
        namaLengkap: "Dinas Pemuda dan Olahraga",
        email: "dispora@tanggamus.go.id",
        terakhirLogin: "2025-07-06T08:45:00",
        blok: "B",
        grup: "Keuangan",
        upb: "UPB 2",
        objek: "Laporan",
        actionType: "Delete",
        actionTitle: "Hapus Data Anggaran",
        ip: "192.168.1.12",
      },
      {
        id: 3,
        username: "bkpsdm",
        namaLengkap: "Badan Kepegawaian",
        email: "bkpsdm@tanggamus.go.id",
        terakhirLogin: "2025-07-01T13:20:00",
        blok: "A",
        grup: "Viewer",
        upb: "UPB 3",
        objek: "Dokumen",
        actionType: "Read",
        actionTitle: "Lihat Arsip",
        ip: "192.168.1.22",
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

  const handleExport = () => {
    alert("Fitur export belum diimplementasikan.");
  };

  const filteredData = tableData.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ip.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBlok = selectedBlok ? item.blok === selectedBlok : true;
    const matchesGrup = selectedGrup ? item.grup === selectedGrup : true;
    const matchesUsername = selectedUsername ? item.username === selectedUsername : true;

    const loginDate = new Date(item.terakhirLogin);
    const matchesStartDate = startDate ? loginDate >= startDate : true;
    const matchesEndDate = endDate ? loginDate <= endDate : true;

    return (
      matchesSearch &&
      matchesBlok &&
      matchesGrup &&
      matchesUsername &&
      matchesStartDate &&
      matchesEndDate
    );
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Daftar Audittrail</h1>

          {/* Filter Row */}
          <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <label>Periode:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Tanggal awal"
                  className="border px-2 py-1 rounded text-sm w-[140px]"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label>s/d</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Tanggal akhir"
                  className="border px-2 py-1 rounded text-sm w-[140px]"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label>Username</label>
                <select
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Semua</option>
                  <option value="superadmin">superadmin</option>
                  <option value="dispora">dispora</option>
                  <option value="bkpsdm">bkpsdm</option>
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
            </div>
          </div>

          {/* Show entries + Search */}
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
                  <th className="py-3 px-6">Waktu Aktivitas</th>
                  <th className="py-3 px-6">IP Address</th>
                  <th className="py-3 px-6">Username</th>
                  <th className="py-3 px-6">Objek</th>
                  <th className="py-3 px-6">Action Type</th>
                  <th className="py-3 px-6">Action Title</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">Memuat data...</td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">Tidak ada data tersedia</td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                      <td className="py-4 px-6">{new Date(item.terakhirLogin).toLocaleString()}</td>
                      <td className="py-4 px-6">{item.ip}</td>
                      <td className="py-4 px-6">{item.username}</td>
                      <td className="py-4 px-6">{item.objek}</td>
                      <td className="py-4 px-6">{item.actionType}</td>
                      <td className="py-4 px-6">{item.actionTitle}</td>
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

export default UpdatingDataPage;
