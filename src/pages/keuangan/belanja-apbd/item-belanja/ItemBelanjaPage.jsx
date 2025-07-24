import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Download, Search } from "lucide-react";
import DataTable from "../../../../components/DataTable";

const ItemBelanjaPage = () => {
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Data states
  const [itemBelanjaData, setItemBelanjaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dropdown filter data
  const [filterData, setFilterData] = useState({
    bidang: [],
    unit: [],
    subUnit: [],
    upb: [],
    semester: [],
    tahun: [],
    kualifikasiBelanja: [],
    kualifikasiAset: [],
    statusVerifikasi: [],
  });

  // Selected filter states
  const [filters, setFilters] = useState({
    tahun: "",
    bidang: "",
    unit: "",
    subUnit: "",
    upb: "",
    semester: "",
    kualifikasiBelanja: "",
    kualifikasiAset: "",
    statusVerifikasi: "",
  });

  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: entriesPerPage,
  });

  // Dummy data generator functions
  const generateFilterData = () => ({
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
    tahun: ["2023", "2024", "2025"],
    kualifikasiBelanja: [
      { id: 1, nama: "Barang" },
      { id: 2, nama: "Jasa" },
      { id: 3, nama: "Modal" },
    ],
    kualifikasiAset: [
      { id: 1, nama: "Aset Tetap" },
      { id: 2, nama: "Bukan Aset" },
    ],
    statusVerifikasi: [
      { id: 1, nama: "Diverifikasi" },
      { id: 2, nama: "Menunggu" },
      { id: 3, nama: "Ditolak" },
    ],
  });

  const generateDummyData = () => [
    {
      id: 1,
      belanjaApbdId: "BLJ001",
      idBelanja: 1,
      bidang: "Bidang Pendidikan",
      unit: "Dinas Pendidikan",
      subUnit: "Sub Unit Sekolah",
      upb: "UPB 001",
      semester: "1",
      tahun: "2024",
      tanggalBaPenerimaan: "2024-01-15",
      namaKegiatan: "Kegiatan Pengadaan",
      namaPekerjaan: "Pengadaan Komputer Kantor",
      nomorKontrak: "KTR/001/2024",
      kualifikasiBelanja: "Barang",
      jenisItem: "Elektronik",
      kodeBarang: "KB001",
      jenis: "Komputer",
      objek: "Laptop",
      namaBarang: "Laptop ASUS VivoBook",
      merkType: "ASUS/X441",
      ukuran: "14 inci",
      bahan: "Plastik/Logam",
      hargaSatuan: 5000000,
      penambahanBiayaLain: 50000,
      hargaSatuanSetelahBiayaLainnya: 5050000,
      nilaiTotal: 50500000,
      jumlahBarang: 10,
      lokasiRuangan: "Ruang IT",
      kualifikasiAset: "Aset Tetap",
      peningkatanKualitas: "Tidak Ada",
      noNhpd: "NHPD-001",
      keterangan: "Pengadaan rutin",
      statusVerifikasi: "Diverifikasi",
      catatanVerifikasi: "Lengkap",
      lampiran: "lampiran_001.pdf",
    },
    {
      id: 2,
      belanjaApbdId: "BLJ002",
      idBelanja: 2,
      bidang: "Bidang Kesehatan",
      unit: "Dinas Kesehatan",
      subUnit: "Sub Unit Puskesmas",
      upb: "UPB 002",
      semester: "1",
      tahun: "2024",
      tanggalBaPenerimaan: "2024-02-20",
      namaKegiatan: "Kegiatan Renovasi",
      namaPekerjaan: "Renovasi Ruang Rapat",
      nomorKontrak: "KTR/002/2024",
      kualifikasiBelanja: "Jasa",
      jenisItem: "Jasa Konstruksi",
      kodeBarang: "JK001",
      jenis: "Renovasi",
      objek: "Ruangan",
      namaBarang: "Pengecatan Dinding",
      merkType: "Dulux/Catylac",
      ukuran: "50m2",
      bahan: "Cat Tembok",
      hargaSatuan: 1000000,
      penambahanBiayaLain: 0,
      hargaSatuanSetelahBiayaLainnya: 1000000,
      nilaiTotal: 1000000,
      jumlahBarang: 1,
      lokasiRuangan: "Ruang Rapat Utama",
      kualifikasiAset: "Bukan Aset",
      peningkatanKualitas: "Tidak Ada",
      noNhpd: "NHPD-002",
      keterangan: "Perbaikan",
      statusVerifikasi: "Menunggu",
      catatanVerifikasi: "",
      lampiran: "lampiran_002.pdf",
    },
    {
      id: 3,
      belanjaApbdId: "BLJ003",
      idBelanja: 3,
      bidang: "Bidang Pendidikan",
      unit: "Dinas Pendidikan",
      subUnit: "Sub Unit Sekolah",
      upb: "UPB 003",
      semester: "2",
      tahun: "2023",
      tanggalBaPenerimaan: "2024-03-01",
      namaKegiatan: "Kegiatan Rutin",
      namaPekerjaan: "Pembelian ATK",
      nomorKontrak: "KTR/003/2024",
      kualifikasiBelanja: "Barang",
      jenisItem: "ATK",
      kodeBarang: "ATK001",
      jenis: "Alat Tulis",
      objek: "Pulpen",
      namaBarang: "Pulpen Faster C600",
      merkType: "Faster/C600",
      ukuran: "0.5mm",
      bahan: "Plastik",
      hargaSatuan: 2000,
      penambahanBiayaLain: 0,
      hargaSatuanSetelahBiayaLainnya: 2000,
      nilaiTotal: 200000,
      jumlahBarang: 100,
      lokasiRuangan: "Gudang ATK",
      kualifikasiAset: "Bukan Aset",
      peningkatanKualitas: "Tidak Ada",
      noNhpd: "NHPD-003",
      keterangan: "Pengadaan bulanan",
      statusVerifikasi: "Diverifikasi",
      catatanVerifikasi: "Sesuai spesifikasi",
      lampiran: "lampiran_003.pdf",
    },
  ];

  // Fetch data function with proper loading simulation
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFilterData(generateFilterData());
      setItemBelanjaData(generateDummyData());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update pagination model when entries per page changes
  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  // Filter data based on search term and selected filters
  const filteredData = itemBelanjaData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(
      ([key, value]) => value === "" || item[key] === value
    );

    return matchesSearch && matchesFilters;
  });

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // Reset all filters and search
  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      tahun: "",
      bidang: "",
      unit: "",
      subUnit: "",
      upb: "",
      semester: "",
      kualifikasiBelanja: "",
      kualifikasiAset: "",
      statusVerifikasi: "",
    });
  };

  // Handle refresh with proper loading state
  const handleRefresh = async () => {
    resetFilters();
    await fetchData();
  };

  const handleExport = () => {
    console.log("Exporting Item Belanja...");
    // Implement export functionality here
  };

  const handleViewDetail = (itemId) => {
    console.log("Lihat Detail Item:", itemId);
    // Implement view detail modal here
  };

  // Column definitions
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "belanjaApbdId", headerName: "No Belanja APBD", width: 150 },
    { field: "bidang", headerName: "Bidang", width: 150 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "subUnit", headerName: "Sub Unit", width: 150 },
    { field: "upb", headerName: "UPB", width: 120 },
    { field: "semester", headerName: "Semester", width: 100 },
    {
      field: "tanggalBaPenerimaan",
      headerName: "Tanggal BA Penerimaan Barang",
      width: 200,
    },
    { field: "namaKegiatan", headerName: "Nama Kegiatan", width: 200 },
    { field: "namaPekerjaan", headerName: "Nama Pekerjaan", width: 200 },
    { field: "nomorKontrak", headerName: "Nomor Kontrak", width: 150 },
    {
      field: "kualifikasiBelanja",
      headerName: "Kualifikasi Belanja",
      width: 150,
    },
    { field: "jenisItem", headerName: "Jenis Item", width: 120 },
    { field: "kodeBarang", headerName: "Kode Barang", width: 120 },
    { field: "jenis", headerName: "Jenis", width: 120 },
    { field: "objek", headerName: "Objek", width: 120 },
    { field: "namaBarang", headerName: "Nama Barang", width: 200 },
    { field: "merkType", headerName: "Merk/Type", width: 150 },
    { field: "ukuran", headerName: "Ukuran", width: 100 },
    { field: "bahan", headerName: "Bahan", width: 100 },
    {
      field: "hargaSatuan",
      headerName: "Harga Satuan",
      type: "number",
      width: 150,
    },
    {
      field: "penambahanBiayaLain",
      headerName: "Penambahan Biaya Lain",
      type: "number",
      width: 180,
    },
    {
      field: "hargaSatuanSetelahBiayaLainnya",
      headerName: "Harga Satuan Setelah Ditambah Biaya Lainnya",
      type: "number",
      width: 250,
    },
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
    { field: "lokasiRuangan", headerName: "Lokasi/Ruangan", width: 150 },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 150 },
    {
      field: "peningkatanKualitas",
      headerName: "Peningkatan Kualitas",
      width: 150,
    },
    { field: "noNhpd", headerName: "No NHPD", width: 120 },
    { field: "keterangan", headerName: "Keterangan", flex: 1 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 200,
    },
    { field: "lampiran", headerName: "Lampiran", width: 100 },
    {
      field: "action",
      headerName: "Detail",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleViewDetail(params.row.id)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          Lihat
        </button>
      ),
    },
  ];

  // Filter component for reusability
  const FilterSelect = ({
    value,
    onChange,
    options,
    placeholder,
    keyField = "nama",
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={option.id || index} value={option[keyField] || option}>
          {option[keyField] || option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Item Belanja APBD
          </h1>

          {/* Filters and Action Buttons */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-1">
              <FilterSelect
                value={filters.tahun}
                onChange={(value) => handleFilterChange("tahun", value)}
                options={filterData.tahun}
                placeholder="-- Tahun --"
                keyField={null}
              />

              <FilterSelect
                value={filters.bidang}
                onChange={(value) => handleFilterChange("bidang", value)}
                options={filterData.bidang}
                placeholder="-- Bidang --"
              />

              <FilterSelect
                value={filters.unit}
                onChange={(value) => handleFilterChange("unit", value)}
                options={filterData.unit}
                placeholder="-- Unit --"
              />

              <FilterSelect
                value={filters.subUnit}
                onChange={(value) => handleFilterChange("subUnit", value)}
                options={filterData.subUnit}
                placeholder="-- Sub Unit --"
              />

              <FilterSelect
                value={filters.upb}
                onChange={(value) => handleFilterChange("upb", value)}
                options={filterData.upb}
                placeholder="-- UPB --"
              />

              <FilterSelect
                value={filters.semester}
                onChange={(value) => handleFilterChange("semester", value)}
                options={filterData.semester}
                placeholder="-- Semester --"
              />

              <FilterSelect
                value={filters.kualifikasiBelanja}
                onChange={(value) =>
                  handleFilterChange("kualifikasiBelanja", value)
                }
                options={filterData.kualifikasiBelanja}
                placeholder="-- Kualifikasi Belanja --"
              />

              <FilterSelect
                value={filters.kualifikasiAset}
                onChange={(value) =>
                  handleFilterChange("kualifikasiAset", value)
                }
                options={filterData.kualifikasiAset}
                placeholder="-- Kualifikasi Aset --"
              />

              <FilterSelect
                value={filters.statusVerifikasi}
                onChange={(value) =>
                  handleFilterChange("statusVerifikasi", value)
                }
                options={filterData.statusVerifikasi}
                placeholder="-- Status Verifikasi --"
              />
            </div>

            {/* Tombol Refresh */}
            <div className="flex gap-2 items-center lg:self-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* BARIS Kontrol Tabel: Show entries dan Search */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              Show
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
                className="border border-gray-300 rounded px-2 py-1"
                disabled={loading}
              >
                <option value="5">5</option>
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
                disabled={loading}
              />
            </div>
          </div>

          {/* DataTable Component */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-2">⚠️ Error</div>
                <div className="text-gray-600">{error}</div>
                <button
                  onClick={fetchData}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemBelanjaPage;
