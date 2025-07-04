import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
// --- Tambahkan impor ikon Search dari lucide-react ---
import { RefreshCw, Plus, Download, Search } from "lucide-react";


const DaftarBelanjaPage = () => {
  const [filters, setFilters] = useState({
    bidang: "",
    unit: "",
    subUnit: "",
    upb: "",
    semester: "",
    kualifikasiBelanja: "",
    statusVerifikasi: "",
    statusTotalBelanja: "",
  });

  const [showEntries, setShowEntries] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
    fetchData();
  };

  const handleAddBarang = () => {
    console.log("Adding new item...");
    alert("Fitur tambah barang akan diimplementasikan!");
  };

  const handleExport = () => {
    console.log("Exporting data...");
    alert("Fitur export data akan diimplementasikan!");
  };


  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dummyData = [
        {
          id: 1,
          upb: "UPB 001",
          tanggalBaPenerimaan: "2024-01-15",
          kodeKegiatan: "KG001",
          namaPekerjaan: "Pengadaan Komputer Kantor",
          nomorKontrak: "KTR/001/2024",
          tanggalKontrak: "2024-01-10",
          kualifikasiBelanja: "Barang",
          totalBarang: 10,
          totalHarga: "Rp 50.000.000",
          nilaiRetensi: "Rp 5.000.000",
          nilaiRealisasi: "Rp 45.000.000",
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Diverifikasi",
        },
        {
          id: 2,
          upb: "UPB 002",
          tanggalBaPenerimaan: "2024-02-20",
          kodeKegiatan: "KG002",
          namaPekerjaan: "Renovasi Ruang Rapat",
          nomorKontrak: "KTR/002/2024",
          tanggalKontrak: "2024-02-15",
          kualifikasiBelanja: "Jasa",
          totalBarang: 1,
          totalHarga: "Rp 75.000.000",
          nilaiRetensi: "Rp 7.500.000",
          nilaiRealisasi: "Rp 67.500.000",
          statusTotalHarga: "Belum Lunas",
          statusVerifikasi: "Menunggu",
        },
        {
            id: 3,
            upb: "UPB 003",
            tanggalBaPenerimaan: "2024-03-01",
            kodeKegiatan: "KG003",
            namaPekerjaan: "Pembelian ATK",
            nomorKontrak: "KTR/003/2024",
            tanggalKontrak: "2024-02-25",
            kualifikasiBelanja: "Barang",
            totalBarang: 100,
            totalHarga: "Rp 2.000.000",
            nilaiRetensi: "Rp 0",
            nilaiRealisasi: "Rp 2.000.000",
            statusTotalHarga: "Lunas",
            statusVerifikasi: "Diverifikasi",
        },
      ];

      const filteredData = dummyData.filter(item => {
        const itemValues = Object.values(item).map(val => String(val).toLowerCase()).join(' ');
        return itemValues.includes(searchTerm.toLowerCase());
      });

      const paginatedData = filteredData.slice(0, showEntries);

      await new Promise(resolve => setTimeout(resolve, 500));
      setTableData(paginatedData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showEntries, searchTerm, setTableData, setIsLoading, setError]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalEntries = tableData.length;
  const currentPage = 1;
  const totalPages = Math.ceil(totalEntries / showEntries);

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

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Belanja APBD</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label htmlFor="bidang" className="block text-sm font-medium text-gray-700 mb-1">
                    Bidang
                  </label>
                  <select
                    id="bidang"
                    name="bidang"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.bidang}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih Bidang --</option>
                    <option value="pendidikan">Pendidikan</option>
                    <option value="kesehatan">Kesehatan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.unit}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih Unit --</option>
                    <option value="dinas_pendidikan">Dinas Pendidikan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="subUnit" className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Unit
                  </label>
                  <select
                    id="subUnit"
                    name="subUnit"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.subUnit}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih Sub Unit --</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="upb" className="block text-sm font-medium text-gray-700 mb-1">
                    UPB
                  </label>
                  <select
                    id="upb"
                    name="upb"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.upb}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih UPB --</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.semester}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih Semester --</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="kualifikasiBelanja" className="block text-sm font-medium text-gray-700 mb-1">
                    Kualifikasi Belanja
                  </label>
                  <select
                    id="kualifikasiBelanja"
                    name="kualifikasiBelanja"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.kualifikasiBelanja}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih Kualifikasi --</option>
                    <option value="barang_jasa">Barang dan Jasa</option>
                    <option value="modal">Modal</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="statusVerifikasi" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Verifikasi
                  </label>
                  <select
                    id="statusVerifikasi"
                    name="statusVerifikasi"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.statusVerifikasi}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih Status --</option>
                    <option value="menunggu">Menunggu</option>
                    <option value="diverifikasi">Diverifikasi</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="statusTotalBelanja" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Total Belanja
                  </label>
                  <select
                    id="statusTotalBelanja"
                    name="statusTotalBelanja"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    value={filters.statusTotalBelanja}
                    onChange={handleFilterChange}
                  >
                    <option value="">-- Pilih Status --</option>
                    <option value="lunas">Lunas</option>
                    <option value="belum_lunas">Belum Lunas</option>
                  </select>
                </div>
            </div>


            <div className="flex justify-end gap-2 mb-6">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleAddBarang}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Barang
              </button>
            </div>

            {/* Kontrol Tabel: Show entries dan Search yang sudah diubah */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                Show
                <select
                  className="py-1 px-2 border border-gray-300 rounded-md text-sm"
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
              {/* --- BAGIAN SEARCH YANG DIUBAH --- */}
              <div className="relative w-full md:w-64"> {/* Menambahkan relative dan lebar */}
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" // Menyesuaikan padding dan focus ring
                />
              </div>
              {/* --- AKHIR BAGIAN SEARCH YANG DIUBAH --- */}
            </div>

            {/* Tabel Daftar Belanja */}
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-6">Action</th>
                    <th scope="col" className="py-3 px-6">UPB</th>
                    <th scope="col" className="py-3 px-6">Tanggal BA Penerimaan Barang</th>
                    <th scope="col" className="py-3 px-6">Kode Kegiatan</th>
                    <th scope="col" className="py-3 px-6">Nama Pekerjaan</th>
                    <th scope="col" className="py-3 px-6">Nomor Kontrak</th>
                    <th scope="col" className="py-3 px-6">Tanggal Kontrak</th>
                    <th scope="col" className="py-3 px-6">Kualifikasi Belanja</th>
                    <th scope="col" className="py-3 px-6">Total Barang</th>
                    <th scope="col" className="py-3 px-6">Total Harga</th>
                    <th scope="col" className="py-3 px-6">Nilai Retensi</th>
                    <th scope="col" className="py-3 px-6">Nilai Realisasi</th>
                    <th scope="col" className="py-3 px-6">Status Total Harga</th>
                    <th scope="col" className="py-3 px-6">Status Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="14" className="py-4 px-6 text-center text-gray-600">Memuat data...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="14" className="py-4 px-6 text-center text-red-600">Error: {error}</td>
                    </tr>
                  ) : tableData.length === 0 ? (
                    <tr>
                      <td colSpan="14" className="py-4 px-6 text-center text-gray-500">No data available in table</td>
                    </tr>
                  ) : (
                    tableData.map((item) => (
                      <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <button className="text-blue-600 hover:underline mr-2">Edit</button>
                          <button className="text-red-600 hover:underline">Delete</button>
                        </td>
                        <td className="py-4 px-6">{item.upb}</td>
                        <td className="py-4 px-6">{item.tanggalBaPenerimaan}</td>
                        <td className="py-4 px-6">{item.kodeKegiatan}</td>
                        <td className="py-4 px-6">{item.namaPekerjaan}</td>
                        <td className="py-4 px-6">{item.nomorKontrak}</td>
                        <td className="py-4 px-6">{item.tanggalKontrak}</td>
                        <td className="py-4 px-6">{item.kualifikasiBelanja}</td>
                        <td className="py-4 px-6">{item.totalBarang}</td>
                        <td className="py-4 px-6">{item.totalHarga}</td>
                        <td className="py-4 px-6">{item.nilaiRetensi}</td>
                        <td className="py-4 px-6">{item.nilaiRealisasi}</td>
                        <td className="py-4 px-6">{item.statusTotalHarga}</td>
                        <td className="py-4 px-6">{item.statusVerifikasi}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Info Jumlah Entries dan Paginasi */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
              <div>
                Show {tableData.length > 0 ? 1 : 0} to {tableData.length} of {tableData.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                  disabled={currentPage === totalPages || totalPages === 0}
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

export default DaftarBelanjaPage;