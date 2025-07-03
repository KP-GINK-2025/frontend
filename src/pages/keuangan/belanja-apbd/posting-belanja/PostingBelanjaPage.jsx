import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react"; // Import Plus untuk konsistensi, meskipun tidak digunakan langsung.

const PostingBelanjaPage = () => {
  // State untuk menyimpan nilai filter
  const [filters, setFilters] = useState({
    bidang: "",
    unit: "",
    subUnit: "",
    upb: "",
    semester: "",
    jenisBelanja: "", // Filter baru: Jenis Belanja
    kualifikasiAset: "",
    // Tidak ada statusVerifikasi di filter utama, tapi ada di tabel
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
    console.log("Refreshing Posting Belanja data...");
    fetchData(); // Panggil ulang fetchData
  };

  // Fungsi untuk menangani Export (mirip dengan halaman sebelumnya)
  const handleExport = () => {
    console.log("Exporting Posting Belanja data...");
    alert("Fitur export Posting Belanja akan diimplementasikan!");
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
          upb: "UPB 001",
          tanggalPerolehan: "2024-01-15",
          kontrak: "KTR/001/2024",
          jenisItem: "Komputer",
          kodeBarang: "KB001",
          namaBarang: "Laptop Asus Vivobook",
          merkType: "Asus/Vivobook 15",
          jumlahBarang: 5,
          nilaiTotal: "Rp 35.000.000",
          kualifikasiAset: "Bergerak",
          peningkatanKualitas: "Tidak Ada",
          statusVerifikasi: "Diverifikasi",
          jumlahPosting: 2,
        },
        {
          id: 2,
          upb: "UPB 002",
          tanggalPerolehan: "2024-02-20",
          kontrak: "KTR/002/2024",
          jenisItem: "Renovasi",
          kodeBarang: "KB002",
          namaBarang: "Pengecatan Ulang Ruangan",
          merkType: "N/A",
          jumlahBarang: 1,
          nilaiTotal: "Rp 15.000.000",
          kualifikasiAset: "Tidak Bergerak",
          peningkatanKualitas: "Ada",
          statusVerifikasi: "Menunggu",
          jumlahPosting: 0,
        },
        {
          id: 3,
          upb: "UPB 001",
          tanggalPerolehan: "2024-03-01",
          kontrak: "KTR/003/2024",
          jenisItem: "ATK",
          kodeBarang: "KB003",
          namaBarang: "Kertas HVS A4",
          merkType: "Sinar Dunia",
          jumlahBarang: 100,
          nilaiTotal: "Rp 500.000",
          kualifikasiAset: "Habis Pakai",
          peningkatanKualitas: "Tidak Ada",
          statusVerifikasi: "Diverifikasi",
          jumlahPosting: 1,
        },
        {
          id: 4,
          upb: "UPB 004",
          tanggalPerolehan: "2024-04-05",
          kontrak: "KTR/004/2024",
          jenisItem: "Alat Kantor",
          kodeBarang: "KB004",
          namaBarang: "Proyektor Epson",
          merkType: "Epson/EB-X400",
          JumlahBarang: 2,
          nilaiTotal: "Rp 10.000.000",
          kualifikasiAset: "Bergerak",
          peningkatanKualitas: "Tidak Ada",
          statusVerifikasi: "Ditolak",
          jumlahPosting: 0,
        },
      ];

      // Simulasi filter sederhana di frontend
      const filteredData = dummyData.filter(item => {
        const itemValues = Object.values(item).map(val => String(val).toLowerCase()).join(' ');
        if (searchTerm && !itemValues.includes(searchTerm.toLowerCase())) return false;

        // Terapkan filter dari state
        if (filters.bidang && item.bidang !== filters.bidang) return false;
        if (filters.unit && item.unit !== filters.unit) return false;
        if (filters.upb && item.upb !== filters.upb) return false;
        if (filters.semester && item.semester !== filters.semester) return false; // Perlu data semester di dummy
        if (filters.jenisBelanja && item.jenisBelanja !== filters.jenisBelanja) return false; // Perlu data jenisBelanja di dummy
        if (filters.kualifikasiAset && item.kualifikasiAset !== filters.kualifikasiAset) return false;

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
          {/* Contoh: <Breadcrumbs path={["Dashboard", "Keuangan", "Belanja APBD", "Posting Belanja"]} /> */}
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
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Item Belanja APBD</h1> {/* Judul masih "Daftar Item Belanja APBD" sesuai desain */}

          {/* Form Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Bidang */}
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

            {/* Unit */}
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

            {/* Sub Unit */}
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

            {/* UPB */}
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
                <option value="UPB 001">UPB 001</option>
                <option value="UPB 002">UPB 002</option>
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

            {/* Jenis Belanja (Baru) */}
            <div>
              <label htmlFor="jenisBelanja" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Belanja
              </label>
              <select
                id="jenisBelanja"
                name="jenisBelanja"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                value={filters.jenisBelanja}
                onChange={handleFilterChange}
              >
                <option value="">-- Pilih Jenis Belanja --</option>
                <option value="barang_jasa">Barang dan Jasa</option>
                <option value="modal">Modal</option>
                <option value="pegawai">Pegawai</option>
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
                <option value="bergerak">Bergerak</option>
                <option value="tidak_bergerak">Tidak Bergerak</option>
                <option value="habis_pakai">Habis Pakai</option>
              </select>
            </div>
            {/* Status Verifikasi tidak ada di filter utama pada desain ini */}
          </div>

          {/* Tombol Refresh */}
          <div className="flex justify-end gap-2 mb-6">
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} /> Refresh
            </button>
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

          {/* Tabel Posting Belanja */}
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-6">Action</th>
                  <th scope="col" className="py-3 px-6">UPB</th>
                  <th scope="col" className="py-3 px-6">Tanggal Perolehan</th>
                  <th scope="col" className="py-3 px-6">Kontrak</th>
                  <th scope="col" className="py-3 px-6">Jenis Item</th>
                  <th scope="col" className="py-3 px-6">Kode Barang</th>
                  <th scope="col" className="py-3 px-6">Nama Barang</th>
                  <th scope="col" className="py-3 px-6">Merk/Type</th>
                  <th scope="col" className="py-3 px-6">Jumlah Barang</th>
                  <th scope="col" className="py-3 px-6">Nilai Total</th>
                  <th scope="col" className="py-3 px-6">Kualifikasi Aset</th>
                  <th scope="col" className="py-3 px-6">Peningkatan Kualitas</th>
                  <th scope="col" className="py-3 px-6">Status Verifikasi</th>
                  <th scope="col" className="py-3 px-6">Jumlah Posting</th>
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
                      <td className="py-4 px-6">{item.tanggalPerolehan}</td>
                      <td className="py-4 px-6">{item.kontrak}</td>
                      <td className="py-4 px-6">{item.jenisItem}</td>
                      <td className="py-4 px-6">{item.kodeBarang}</td>
                      <td className="py-4 px-6">{item.namaBarang}</td>
                      <td className="py-4 px-6">{item.merkType}</td>
                      <td className="py-4 px-6">{item.jumlahBarang}</td>
                      <td className="py-4 px-6">{item.nilaiTotal}</td>
                      <td className="py-4 px-6">{item.kualifikasiAset}</td>
                      <td className="py-4 px-6">{item.peningkatanKualitas}</td>
                      <td className="py-4 px-6">{item.statusVerifikasi}</td>
                      <td className="py-4 px-6">{item.jumlahPosting}</td>
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
        </div> {/* Akhir dari kontainer putih */}
      </div>
    </div>
  );
};

export default PostingBelanjaPage;