import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Download, Search } from "lucide-react";

const ItemHibahPage = () => {
  // State untuk menyimpan nilai filter
  const [filters, setFilters] = useState({
    asal: "",
    semester: "",
    statusVerifikasi: "",
    kd_kondisi: "", // Filter baru: kd_kondisi
  });

  // State untuk jumlah entries yang ditampilkan
  const [showEntries, setShowEntries] = useState(10);
  // State untuk pencarian
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk data tabel
  const [tableData, setTableData] = useState([]);
  // State untuk loading
  const [isLoading, setIsLoading] = useState(true);
  // State untuk error
  const [error, setError] = useState(null);

  // Fungsi untuk menangani perubahan filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Fungsi untuk refresh data
  const handleRefresh = () => {
    console.log("Refreshing Item Hibah data...");
    fetchData(); // Panggil ulang fetchData
  };

  // Fungsi untuk menangani Export
  const handleExport = () => {
    console.log("Exporting Item Hibah data...");
    alert("Fitur export Item Hibah akan diimplementasikan!");
  };

  // Fungsi untuk Fetching Data, dibungkus useCallback untuk stabilitas
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // --- SIMULASI FETCHING DATA DARI API ---
      // Data dummy untuk simulasi agar tabel terisi
      const dummyData = [
        {
          id: 1,
          asal: "Kementerian A",
          tujuan: "Dinas Pendidikan",
          noBeritaAcara: "BA/Hibah/001/2024",
          tglBeritaAcara: "2024-01-15",
          kodeBarang: "B001",
          namaBarang: "Laptop",
          merk: "Lenovo", // Menyesuaikan dengan kolom 'Merk'
          jumlahBarang: 5,
          nilaiTotal: "Rp 35.000.000",
          semester: "1",
          statusVerifikasi: "Diverifikasi",
          kd_kondisi: "Baik", // Dummy data for 'kd_kondisi'
        },
        {
          id: 2,
          asal: "Swasta XYZ",
          tujuan: "Dinas Kesehatan",
          noBeritaAcara: "BA/Hibah/002/2024",
          tglBeritaAcara: "2024-02-20",
          kodeBarang: "M002",
          namaBarang: "Meja Kantor",
          merk: "Chitose",
          jumlahBarang: 10,
          nilaiTotal: "Rp 10.000.000",
          semester: "1",
          statusVerifikasi: "Menunggu",
          kd_kondisi: "Rusak Ringan",
        },
        {
          id: 3,
          asal: "Yayasan ABC",
          tujuan: "Dinas Sosial",
          noBeritaAcara: "BA/Hibah/003/2024",
          tglBeritaAcara: "2024-03-10",
          kodeBarang: "P003",
          namaBarang: "Printer",
          merk: "Epson",
          jumlahBarang: 2,
          nilaiTotal: "Rp 5.000.000",
          semester: "2",
          statusVerifikasi: "Ditolak",
          kd_kondisi: "Baik",
        },
      ];

      // Simulasi filter sederhana di frontend
      const filteredData = dummyData.filter(item => {
        const itemValues = Object.values(item).map(val => String(val).toLowerCase()).join(' ');
        if (searchTerm && !itemValues.includes(searchTerm.toLowerCase())) return false;

        // Terapkan filter dari state
        if (filters.asal && item.asal.toLowerCase() !== filters.asal.toLowerCase()) return false;
        if (filters.semester && item.semester !== filters.semester) return false;
        if (filters.statusVerifikasi && item.statusVerifikasi.toLowerCase() !== filters.statusVerifikasi.toLowerCase()) return false;
        if (filters.kd_kondisi && item.kd_kondisi.toLowerCase() !== filters.kd_kondisi.toLowerCase()) return false;

        return true;
      });

      // Simulasi paginasi
      const paginatedData = filteredData.slice(0, showEntries);

      // Simulasi delay (untuk mensimulasikan loading API)
      await new Promise(resolve => setTimeout(resolve, 500));
      setTableData(paginatedData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showEntries, searchTerm, setTableData, setIsLoading, setError]);

  // useEffect untuk memanggil fetchData saat komponen pertama kali dimuat
  // atau saat filters, showEntries, atau searchTerm berubah
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi untuk Paginasi (placeholder)
  const totalEntries = tableData.length;
  const currentPage = 1;
  const totalPages = Math.ceil(totalEntries / showEntries);

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans">
      <Navbar />
      <div className="px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumbs />
          {/* Breadcrumbs path sesuaikan dengan desain */}
          {/* Contoh: <Breadcrumbs path={["Dashboard", "Keuangan", "Hibah", "Item Hibah"]} /> */}
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        {/* Kontainer Form Filter dan Tabel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Judul H1 di dalam container */}
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Item Barang Hibah</h1> {/* Judul diubah sesuai desain */}

          {/* Form Filter - Baris Atas (3 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"> {/* Menggunakan mb-4 untuk jarak dengan baris bawah */}
            {/* Asal */}
            <div>
              <label htmlFor="asal" className="block text-sm font-medium text-gray-700 mb-1">
                Asal
              </label>
              <select
                id="asal"
                name="asal"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={filters.asal}
                onChange={handleFilterChange}
              >
                <option value="">-- Pilih Asal --</option>
                <option value="Kementerian A">Kementerian A</option>
                <option value="Swasta XYZ">Swasta XYZ</option>
                <option value="Yayasan ABC">Yayasan ABC</option>
              </select>
            </div>

            {/* Semester */}
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

            {/* Status Verifikasi */}
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
                <option value="Menunggu">Menunggu</option>
                <option value="Diverifikasi">Diverifikasi</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Form Filter - Baris Bawah (1 Kolom) dan Tombol Refresh */}
          {/* Kita akan menggunakan grid 4 kolom di sini untuk menempatkan kd_kondisi dan Refresh */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
            {/* kd_kondisi */}
            <div>
              <label htmlFor="kd_kondisi" className="block text-sm font-medium text-gray-700 mb-1">
                kd_kondisi
              </label>
              <select
                id="kd_kondisi"
                name="kd_kondisi"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={filters.kd_kondisi}
                onChange={handleFilterChange}
              >
                <option value="">-- Pilih Kondisi --</option>
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            {/* Tombol Refresh - memanfaatkan col-span untuk mendorongnya ke kanan */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end"> {/* col-span-3 untuk mengambil sisa 3 kolom dan mendorong tombol ke kanan */}
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>

          {/* Kontrol Tabel: Show entries dan Search */}
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
            {/* Search input dengan ikon */}
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

          {/* Tabel Item Hibah */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-6">Action</th>
                  <th scope="col" className="py-3 px-6">Asal</th>
                  <th scope="col" className="py-3 px-6">Tujuan</th>
                  <th scope="col" className="py-3 px-6">No. Berita Acara</th>
                  <th scope="col" className="py-3 px-6">Tgl. Berita Acara</th>
                  <th scope="col" className="py-3 px-6">Kode Barang</th>
                  <th scope="col" className="py-3 px-6">Nama Barang</th>
                  <th scope="col" className="py-3 px-6">Merk</th> {/* Diubah dari Merk/Type ke Merk */}
                  <th scope="col" className="py-3 px-6">Jumlah Barang</th>
                  <th scope="col" className="py-3 px-6">Nilai Total</th>
                  {/* Kolom Lampiran dan Status Verifikasi tidak ada di desain */}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="10" className="py-4 px-6 text-center text-gray-600">Memuat data...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="10" className="py-4 px-6 text-center text-red-600">Error: {error}</td>
                  </tr>
                ) : tableData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-4 px-6 text-center text-gray-500">No data available in table</td>
                  </tr>
                ) : (
                  tableData.map((item) => (
                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button className="text-red-600 hover:underline">Delete</button>
                      </td>
                      <td className="py-4 px-6">{item.asal}</td>
                      <td className="py-4 px-6">{item.tujuan}</td>
                      <td className="py-4 px-6">{item.noBeritaAcara}</td>
                      <td className="py-4 px-6">{item.tglBeritaAcara}</td>
                      <td className="py-4 px-6">{item.kodeBarang}</td>
                      <td className="py-4 px-6">{item.namaBarang}</td>
                      <td className="py-4 px-6">{item.merk}</td>
                      <td className="py-4 px-6">{item.jumlahBarang}</td>
                      <td className="py-4 px-6">{item.nilaiTotal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Info Jumlah Entries dan Paginasi */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
            <div>
              Show {tableData.length > 0 ? 1 : 0} to {tableData.length} of {totalEntries} entries
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

export default ItemHibahPage;