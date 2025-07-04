import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Download, Search } from "lucide-react"; // Tidak ada Plus karena Add Mutasi tidak ada di desain ini

const ItemMutasiPage = () => {
  // State untuk menyimpan nilai filter
  const [filters, setFilters] = useState({
    kualifikasiPerolehan: "",
    asal: "",
    tujuan: "",
    semester: "",
    statusVerifikasi: "",
    kualifikasiAset: "",
    kondisi: "", // Filter baru: Kondisi
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
    console.log("Refreshing Item Mutasi data...");
    fetchData(); // Panggil ulang fetchData
  };

  // Fungsi untuk menangani Export
  const handleExport = () => {
    console.log("Exporting Item Mutasi data...");
    alert("Fitur export Item Mutasi akan diimplementasikan!");
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
          asal: "UPB 001",
          tujuan: "UPB 002",
          noBeritaAcara: "BA/Mutasi/001/2024",
          tanggalPerolehan: "2024-01-20",
          kodeBarang: "KB001",
          namaBarang: "Laptop Asus Vivobook",
          merkType: "Asus/Vivobook 15",
          jumlahBarang: 1,
          nilaiTotal: "Rp 7.000.000",
          kualifikasiAset: "Bergerak",
          statusVerifikasi: "Diverifikasi",
          kondisi: "Baik", // Dummy data for 'kondisi'
          kualifikasiPerolehan: "Hibah", // Dummy data for 'kualifikasiPerolehan'
          semester: "1", // Dummy data for 'semester'
        },
        {
          id: 2,
          asal: "Gudang Utama",
          tujuan: "UPB 003",
          noBeritaAcara: "BA/Mutasi/002/2024",
          tanggalPerolehan: "2024-02-10",
          kodeBarang: "KB003",
          namaBarang: "Meja Kerja",
          merkType: "N/A",
          jumlahBarang: 2,
          nilaiTotal: "Rp 3.000.000",
          kualifikasiAset: "Tidak Bergerak",
          statusVerifikasi: "Menunggu",
          kondisi: "Rusak Ringan",
          kualifikasiPerolehan: "Pembelian",
          semester: "1",
        },
        {
          id: 3,
          asal: "UPB 002",
          tujuan: "UPB 001",
          noBeritaAcara: "BA/Mutasi/003/2024",
          tanggalPerolehan: "2024-03-05",
          kodeBarang: "KB004",
          namaBarang: "Printer Laser",
          merkType: "HP/LaserJet Pro",
          jumlahBarang: 1,
          nilaiTotal: "Rp 2.500.000",
          kualifikasiAset: "Bergerak",
          statusVerifikasi: "Ditolak",
          kondisi: "Baik",
          kualifikasiPerolehan: "Transfer",
          semester: "2",
        },
      ];

      // Simulasi filter sederhana di frontend
      const filteredData = dummyData.filter(item => {
        const itemValues = Object.values(item).map(val => String(val).toLowerCase()).join(' ');
        if (searchTerm && !itemValues.includes(searchTerm.toLowerCase())) return false;

        // Terapkan filter dari state
        if (filters.kualifikasiPerolehan && item.kualifikasiPerolehan.toLowerCase() !== filters.kualifikasiPerolehan.toLowerCase()) return false;
        if (filters.asal && item.asal.toLowerCase() !== filters.asal.toLowerCase()) return false;
        if (filters.tujuan && item.tujuan.toLowerCase() !== filters.tujuan.toLowerCase()) return false;
        if (filters.semester && item.semester !== filters.semester) return false;
        if (filters.statusVerifikasi && item.statusVerifikasi.toLowerCase() !== filters.statusVerifikasi.toLowerCase()) return false;
        if (filters.kualifikasiAset && item.kualifikasiAset.toLowerCase() !== filters.kualifikasiAset.toLowerCase()) return false;
        if (filters.kondisi && item.kondisi.toLowerCase() !== filters.kondisi.toLowerCase()) return false;

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
          {/* Contoh: <Breadcrumbs path={["Dashboard", "Keuangan", "Mutasi", "Item Mutasi"]} /> */}
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
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Item Mutasi</h1> {/* Judul diubah sesuai desain */}

          {/* Form Filter - Baris Atas (4 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Kualifikasi Perolehan */}
            <div>
              <label htmlFor="kualifikasiPerolehan" className="block text-sm font-medium text-gray-700 mb-1">
                Kualifikasi Perolehan
              </label>
              <select
                id="kualifikasiPerolehan"
                name="kualifikasiPerolehan"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={filters.kualifikasiPerolehan}
                onChange={handleFilterChange}
              >
                <option value="">-- Pilih Kualifikasi --</option>
                <option value="Hibah">Hibah</option>
                <option value="Pembelian">Pembelian</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

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
                <option value="UPB 001">UPB 001</option>
                <option value="Gudang Utama">Gudang Utama</option>
              </select>
            </div>

            {/* Tujuan */}
            <div>
              <label htmlFor="tujuan" className="block text-sm font-medium text-gray-700 mb-1">
                Tujuan
              </label>
              <select
                id="tujuan"
                name="tujuan"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={filters.tujuan}
                onChange={handleFilterChange}
              >
                <option value="">-- Pilih Tujuan --</option>
                <option value="UPB 001">UPB 001</option>
                <option value="UPB 002">UPB 002</option>
                <option value="UPB 003">UPB 003</option>
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
          </div>

          {/* Form Filter - Baris Bawah (3 Kolom) dan Tombol */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end"> {/* Menggunakan items-end untuk mensejajarkan tombol */}
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

            {/* Kualifikasi Aset */}
            <div>
              <label htmlFor="kualifikasiAset" className="block text-sm font-medium text-gray-700 mb-1">
                Kualifikasi Aset
              </label>
              <select
                id="kualifikasiAset"
                name="kualifikasiAset"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={filters.kualifikasiAset}
                onChange={handleFilterChange}
              >
                <option value="">-- Pilih Kualifikasi Aset --</option>
                <option value="Bergerak">Bergerak</option>
                <option value="Tidak Bergerak">Tidak Bergerak</option>
                <option value="Habis Pakai">Habis Pakai</option>
              </select>
            </div>

            {/* Kondisi (Baru) */}
            <div>
              <label htmlFor="kondisi" className="block text-sm font-medium text-gray-700 mb-1">
                Kondisi
              </label>
              <select
                id="kondisi"
                name="kondisi"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={filters.kondisi}
                onChange={handleFilterChange}
              >
                <option value="">-- Pilih Kondisi --</option>
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            {/* Tombol Refresh - berada dalam grid yang sama */}
            {/* Menggunakan `col-span-1` karena hanya satu tombol di sini */}
            <div className="col-span-1 flex justify-end">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              {/* Tidak ada tombol Add Mutasi di sini */}
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

          {/* Tabel Item Mutasi */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-6">Action</th>
                  <th scope="col" className="py-3 px-6">Asal</th>
                  <th scope="col" className="py-3 px-6">Tujuan</th>
                  <th scope="col" className="py-3 px-6">No. Berita Acara</th>
                  <th scope="col" className="py-3 px-6">Tanggal Perolehan</th>
                  <th scope="col" className="py-3 px-6">Kode Barang</th>
                  <th scope="col" className="py-3 px-6">Nama Barang</th>
                  <th scope="col" className="py-3 px-6">Merk/Type</th>
                  <th scope="col" className="py-3 px-6">Jumlah Barang</th>
                  <th scope="col" className="py-3 px-6">Nilai Total</th>
                  <th scope="col" className="py-3 px-6">Kualifikasi Aset</th>
                  <th scope="col" className="py-3 px-6">Status Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="12" className="py-4 px-6 text-center text-gray-600">Memuat data...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="12" className="py-4 px-6 text-center text-red-600">Error: {error}</td>
                  </tr>
                ) : tableData.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="py-4 px-6 text-center text-gray-500">No data available in table</td>
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
                      <td className="py-4 px-6">{item.tanggalPerolehan}</td>
                      <td className="py-4 px-6">{item.kodeBarang}</td>
                      <td className="py-4 px-6">{item.namaBarang}</td>
                      <td className="py-4 px-6">{item.merkType}</td>
                      <td className="py-4 px-6">{item.jumlahBarang}</td>
                      <td className="py-4 px-6">{item.nilaiTotal}</td>
                      <td className="py-4 px-6">{item.kualifikasiAset}</td>
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

export default ItemMutasiPage;