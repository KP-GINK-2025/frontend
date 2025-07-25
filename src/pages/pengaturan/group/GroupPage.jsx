import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import Swal from "sweetalert2";

const GroupPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const dummyData = [
      { id: 1, nama: "Admin", keterangan: "Administrator Sistem", aktif: true },
      {
        id: 2,
        nama: "Keuangan",
        keterangan: "Akses modul keuangan",
        aktif: true,
      },
      {
        id: 3,
        nama: "Viewer",
        keterangan: "Hanya dapat melihat data",
        aktif: false,
      },
    ];
    setTimeout(() => {
      setTableData(dummyData);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Animasi dan SweetAlert pada tombol Refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    fetchData();
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data grup berhasil dimuat ulang.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // SweetAlert pada tombol Delete
  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data grup yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data grup berhasil dihapus.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleAddGroup = () => {
    alert("Fitur tambah group belum diimplementasikan.");
  };

  const handleExport = () => {
    alert("Fitur export belum diimplementasikan.");
  };

  const filteredData = tableData.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Grup</h1>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={handleAddGroup}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <Plus size={16} /> Add Group
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 text-sm text-gray-700">
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
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <th className="py-3 px-6">Action</th>
                  <th className="py-3 px-6">Nama</th>
                  <th className="py-3 px-6">Keterangan</th>
                  <th className="py-3 px-6">Aktif</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      <div className="flex items-center justify-center">
                        <RefreshCw size={20} className="animate-spin mr-2" />
                        Memuat data...
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      Tidak ada data tersedia
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <button className="text-blue-600 hover:underline cursor-pointer mr-2">
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline cursor-pointer"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td className="py-4 px-6">{item.nama}</td>
                      <td className="py-4 px-6">{item.keterangan}</td>
                      <td className="py-4 px-6">
                        {item.aktif ? "Ya" : "Tidak"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
            <div>
              Show {paginatedData.length > 0 ? 1 : 0} to {paginatedData.length}{" "}
              of {filteredData.length} entries
            </div>
            <div className="flex gap-2">
              <button
                className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                disabled
              >
                Previous
              </button>
              <button
                className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                disabled
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

export default GroupPage;
