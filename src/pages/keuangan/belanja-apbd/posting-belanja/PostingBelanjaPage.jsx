import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Download, Search } from "lucide-react";
import Swal from "sweetalert2";

const PostingBelanjaPage = () => {
  // Main states
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [postingBelanjaData, setPostingBelanjaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter dropdown data states
  const [filterOptions, setFilterOptions] = useState({
    bidang: [],
    unit: [],
    subUnit: [],
    upb: [],
    semester: [],
    kualifikasiBelanja: [],
    kualifikasiAset: [],
  });

  // Selected filter states
  const [filters, setFilters] = useState({
    bidang: "",
    unit: "",
    subUnit: "",
    upb: "",
    semester: "",
    kualifikasiBelanja: "",
    kualifikasiAset: "",
  });

  // Pagination state
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Mock data functions
  const getMockFilterOptions = () => ({
    bidang: [
      { id: 1, nama: "Bidang Pendidikan" },
      { id: 2, nama: "Bidang Kesehatan" },
    ],
    unit: [
      { id: 1, nama: "Dinas Pendidikan" },
      { id: 2, nama: "Dinas Kesehatan" },
    ],
    subUnit: [
      { id: 1, nama: "Sub Unit Sekolah" },
      { id: 2, nama: "Sub Unit Puskesmas" },
    ],
    upb: [
      { id: 1, nama: "UPB 001" },
      { id: 2, nama: "UPB 002" },
    ],
    semester: [
      { id: 1, nama: "1" },
      { id: 2, nama: "2" },
    ],
    kualifikasiBelanja: [
      { id: 1, nama: "Barang" },
      { id: 2, nama: "Jasa" },
      { id: 3, nama: "Modal" },
    ],
    kualifikasiAset: [
      { id: 1, nama: "Aset Tetap" },
      { id: 2, nama: "Bukan Aset" },
    ],
  });

  const getMockPostingData = () => [
    {
      id: 1,
      belanjaApbdId: "BLJ001",
      bidang: "Bidang Pendidikan",
      unit: "Dinas Pendidikan",
      subUnit: "Sub Unit Sekolah",
      upb: "UPB 001",
      semester: "1",
      tanggalPerolehan: "2024-01-15",
      kegiatan: "Kegiatan A",
      pekerjaan: "Pengadaan Komputer",
      kontrak: "Kontrak-A-001",
      kualifikasiBelanja: "Barang",
      jenisItem: "Elektronik",
      kodeBarang: "KB001",
      namaBarang: "Laptop ASUS",
      merkType: "ASUS/X441",
      ukuran: "14 inci",
      jumlahBarang: 10,
      nilaiTotal: 50000000,
      kualifikasiAset: "Aset Tetap",
      peningkatanKualitas: "Tidak ada",
      statusVerifikasi: "Diverifikasi",
      catatanVerifikasi: "Sesuai",
      jumlahPosting: 2,
    },
    {
      id: 2,
      belanjaApbdId: "BLJ002",
      bidang: "Bidang Kesehatan",
      unit: "Dinas Kesehatan",
      subUnit: "Sub Unit Puskesmas",
      upb: "UPB 002",
      semester: "1",
      tanggalPerolehan: "2024-02-20",
      kegiatan: "Kegiatan B",
      pekerjaan: "Renovasi Gedung",
      kontrak: "Kontrak-B-001",
      kualifikasiBelanja: "Jasa",
      jenisItem: "Konstruksi",
      kodeBarang: "KC001",
      namaBarang: "Cat Dinding",
      merkType: "Dulux/Weatherbond",
      ukuran: "5 kg",
      jumlahBarang: 50,
      nilaiTotal: 25000000,
      kualifikasiAset: "Bukan Aset",
      peningkatanKualitas: "Ada",
      statusVerifikasi: "Menunggu",
      catatanVerifikasi: "",
      jumlahPosting: 0,
    },
    {
      id: 3,
      belanjaApbdId: "BLJ003",
      bidang: "Bidang Pendidikan",
      unit: "Dinas Pendidikan",
      subUnit: "Sub Unit Sekolah",
      upb: "UPB 001",
      semester: "2",
      tanggalPerolehan: "2024-03-01",
      kegiatan: "Kegiatan C",
      pekerjaan: "Pemasangan CCTV",
      kontrak: "Kontrak-C-001",
      kualifikasiBelanja: "Jasa",
      jenisItem: "Elektronik",
      kodeBarang: "KB002",
      namaBarang: "CCTV Outdoor",
      merkType: "Hikvision/DS-2CE",
      ukuran: "2MP",
      jumlahBarang: 5,
      nilaiTotal: 7500000,
      kualifikasiAset: "Aset Tetap",
      peningkatanKualitas: "Tidak ada",
      statusVerifikasi: "Diverifikasi",
      catatanVerifikasi: "Selesai",
      jumlahPosting: 1,
    },
    {
      id: 4,
      belanjaApbdId: "BLJ004",
      bidang: "Bidang Kesehatan",
      unit: "Dinas Kesehatan",
      subUnit: "Sub Unit Puskesmas",
      upb: "UPB 002",
      semester: "2",
      tanggalPerolehan: "2024-04-10",
      kegiatan: "Kegiatan D",
      pekerjaan: "Pembelian Obat-obatan",
      kontrak: "Kontrak-D-001",
      kualifikasiBelanja: "Barang",
      jenisItem: "Farmasi",
      kodeBarang: "KF001",
      namaBarang: "Paracetamol 500mg",
      merkType: "Sanbe/500mg",
      ukuran: "Strip",
      jumlahBarang: 1000,
      nilaiTotal: 15000000,
      kualifikasiAset: "Bukan Aset",
      peningkatanKualitas: "Tidak ada",
      statusVerifikasi: "Diverifikasi",
      catatanVerifikasi: "Lengkap dan sesuai standar",
      jumlahPosting: 3,
    },
  ];

  // Reset filters to initial state
  const resetFilters = () => {
    setFilters({
      bidang: "",
      unit: "",
      subUnit: "",
      upb: "",
      semester: "",
      kualifikasiBelanja: "",
      kualifikasiAset: "",
    });
  };

  // Fetch data function
  const fetchData = async (showSuccessMessage = false) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFilterOptions(getMockFilterOptions());
      setPostingBelanjaData(getMockPostingData());

      // Show success message if requested
      if (showSuccessMessage) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil dimuat ulang.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);

      if (showSuccessMessage) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat memuat data.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Update pagination model when entriesPerPage changes
  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  // Filter data based on search and selected filters
  const filteredData = postingBelanjaData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return item[key] === value;
    });

    return matchesSearch && matchesFilters;
  });

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // Handle refresh with proper loading state and SweetAlert
  const handleRefresh = async () => {
    setSearchTerm("");
    resetFilters();
    setDataTablePaginationModel({ page: 0, pageSize: entriesPerPage });
    await fetchData(true); // Pass true to show success message
  };

  const handleExport = () => {
    console.log("Exporting Posting Belanja...");
    Swal.fire({
      icon: "info",
      title: "Export",
      text: "Fitur export sedang dalam pengembangan.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleViewDetail = (itemId) => {
    console.log("Lihat Detail Item ID:", itemId);
    Swal.fire({
      icon: "info",
      title: "Detail Item",
      text: "Fitur detail item sedang dalam pengembangan.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Filter dropdown component
  const FilterSelect = ({ value, onChange, options, placeholder }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.nama}>
          {option.nama}
        </option>
      ))}
    </select>
  );

  // Table columns configuration
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "belanjaApbdId", headerName: "No Belanja APBD", width: 150 },
    { field: "bidang", headerName: "Bidang", width: 150 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "subUnit", headerName: "Sub Unit", width: 150 },
    { field: "upb", headerName: "UPB", width: 120 },
    { field: "semester", headerName: "Semester", width: 100 },
    { field: "tanggalPerolehan", headerName: "Tanggal Perolehan", width: 150 },
    { field: "kegiatan", headerName: "Kegiatan", width: 200 },
    { field: "pekerjaan", headerName: "Pekerjaan", width: 200 },
    { field: "kontrak", headerName: "Kontrak", width: 150 },
    { field: "kualifikasiBelanja", headerName: "Jenis Belanja", width: 150 },
    { field: "jenisItem", headerName: "Jenis Item", width: 120 },
    { field: "kodeBarang", headerName: "Kode Barang", width: 120 },
    { field: "namaBarang", headerName: "Nama Barang", width: 200 },
    { field: "merkType", headerName: "Merk/Type", width: 150 },
    { field: "ukuran", headerName: "Ukuran", width: 100 },
    {
      field: "jumlahBarang",
      headerName: "Jumlah Barang",
      type: "number",
      width: 120,
    },
    {
      field: "nilaiTotal",
      headerName: "Nilai Total",
      type: "number",
      width: 150,
    },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 150 },
    {
      field: "peningkatanKualitas",
      headerName: "Peningkatan Kualitas",
      width: 150,
    },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 200,
    },
    {
      field: "jumlahPosting",
      headerName: "Jumlah Posting",
      type: "number",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleViewDetail(params.row.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
        >
          Lihat
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-4 md:px-8 py-6 md:py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Posting Belanja APBD
          </h1>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 flex-1 w-full">
              <FilterSelect
                value={filters.bidang}
                onChange={(value) => handleFilterChange("bidang", value)}
                options={filterOptions.bidang}
                placeholder="-- Bidang --"
              />
              <FilterSelect
                value={filters.unit}
                onChange={(value) => handleFilterChange("unit", value)}
                options={filterOptions.unit}
                placeholder="-- Unit --"
              />
              <FilterSelect
                value={filters.subUnit}
                onChange={(value) => handleFilterChange("subUnit", value)}
                options={filterOptions.subUnit}
                placeholder="-- Sub Unit --"
              />
              <FilterSelect
                value={filters.upb}
                onChange={(value) => handleFilterChange("upb", value)}
                options={filterOptions.upb}
                placeholder="-- UPB --"
              />
              <FilterSelect
                value={filters.semester}
                onChange={(value) => handleFilterChange("semester", value)}
                options={filterOptions.semester}
                placeholder="-- Semester --"
              />
              <FilterSelect
                value={filters.kualifikasiBelanja}
                onChange={(value) =>
                  handleFilterChange("kualifikasiBelanja", value)
                }
                options={filterOptions.kualifikasiBelanja}
                placeholder="-- Jenis Belanja --"
              />
              <FilterSelect
                value={filters.kualifikasiAset}
                onChange={(value) =>
                  handleFilterChange("kualifikasiAset", value)
                }
                options={filterOptions.kualifikasiAset}
                placeholder="-- Kualifikasi Aset --"
              />
            </div>

            {/* Refresh Button */}
            <div className="flex gap-2 items-center lg:self-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Table Controls: Show entries and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setDataTablePaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0,
                  }));
                }}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* DataTable Component */}
          {error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-600 text-lg mb-2">⚠️ Error</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button
                onClick={() => fetchData()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <DataTable
                rows={filteredData}
                columns={columns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostingBelanjaPage;
