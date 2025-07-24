import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import AddBarangModal from "./AddBarangModal";
import Swal from "sweetalert2";

const DaftarBelanjaPage = () => {
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Main data state
  const [daftarBelanjaData, setDaftarBelanjaData] = useState([]);

  // Filter dropdown data states
  const [filterOptions, setFilterOptions] = useState({
    bidang: [],
    unit: [],
    subUnit: [],
    upb: [],
    semester: [],
    tahun: [],
    kualifikasiBelanja: [],
    statusVerifikasi: [],
    statusTotalBelanja: [],
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
    statusVerifikasi: "",
    statusTotalHarga: "",
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch data function with proper loading state management
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay for better UX demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set filter dropdown options
      setFilterOptions({
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
        statusVerifikasi: [
          { id: 1, nama: "Diverifikasi" },
          { id: 2, nama: "Menunggu" },
          { id: 3, nama: "Ditolak" },
        ],
        statusTotalBelanja: [
          { id: 1, nama: "Lunas" },
          { id: 2, nama: "Belum Lunas" },
        ],
        tahun: ["2023", "2024", "2025"],
      });

      // Set main table data
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
          totalHarga: 50000000,
          nilaiRetensi: 5000000,
          nilaiRealisasi: 45000000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Diverifikasi",
          tahun: "2024",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          semester: "1",
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
          totalHarga: 75000000,
          nilaiRetensi: 7500000,
          nilaiRealisasi: 67500000,
          statusTotalHarga: "Belum Lunas",
          statusVerifikasi: "Menunggu",
          tahun: "2024",
          bidang: "Bidang Kesehatan",
          unit: "Dinas Kesehatan",
          subUnit: "Sub Unit Puskesmas",
          semester: "1",
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
          totalHarga: 2000000,
          nilaiRetensi: 0,
          nilaiRealisasi: 2000000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Diverifikasi",
          tahun: "2023",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          semester: "2",
        },
        {
          id: 4,
          upb: "UPB 001",
          tanggalBaPenerimaan: "2024-04-10",
          kodeKegiatan: "KG004",
          namaPekerjaan: "Pemasangan CCTV",
          nomorKontrak: "KTR/004/2024",
          tanggalKontrak: "2024-04-05",
          kualifikasiBelanja: "Jasa",
          totalBarang: 5,
          totalHarga: 15000000,
          nilaiRetensi: 1500000,
          nilaiRealisasi: 13500000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Diverifikasi",
          tahun: "2024",
          bidang: "Bidang Kesehatan",
          unit: "Dinas Kesehatan",
          subUnit: "Sub Unit Puskesmas",
          semester: "1",
        },
        {
          id: 5,
          upb: "UPB 002",
          tanggalBaPenerimaan: "2024-05-25",
          kodeKegiatan: "KG005",
          namaPekerjaan: "Perbaikan Jaringan",
          nomorKontrak: "KTR/005/2024",
          tanggalKontrak: "2024-05-20",
          kualifikasiBelanja: "Jasa",
          totalBarang: 1,
          totalHarga: 5000000,
          nilaiRetensi: 0,
          nilaiRealisasi: 5000000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Menunggu",
          tahun: "2024",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          semester: "2",
        },
      ];

      setDaftarBelanjaData(dummyData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
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

  // Filter data based on search term and selected filters
  const filteredData = daftarBelanjaData.filter((item) => {
    const matchesSearch = [
      item.upb,
      item.namaPekerjaan,
      item.nomorKontrak,
      item.kodeKegiatan,
      item.totalHarga?.toString(),
      item.nilaiRealisasi?.toString(),
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

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

  // Handle refresh with proper loading state
  const handleRefresh = async () => {
    setSearchTerm("");
    setFilters({
      tahun: "",
      bidang: "",
      unit: "",
      subUnit: "",
      upb: "",
      semester: "",
      kualifikasiBelanja: "",
      statusVerifikasi: "",
      statusTotalHarga: "",
    });
    setDataTablePaginationModel({ page: 0, pageSize: entriesPerPage });
    await fetchData();
  };

  const handleExport = () => {
    console.log("Exporting Daftar Belanja...");
    // Add your export logic here
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveNewDaftarBelanja = (daftarBelanjaToSave) => {
    if (daftarBelanjaToSave.id) {
      // Update existing item
      setDaftarBelanjaData((prevData) =>
        prevData.map((item) =>
          item.id === daftarBelanjaToSave.id ? daftarBelanjaToSave : item
        )
      );
      console.log("Update Daftar Belanja:", daftarBelanjaToSave);
    } else {
      // Add new item
      setDaftarBelanjaData((prevData) => [
        ...prevData,
        { id: Date.now(), ...daftarBelanjaToSave },
      ]);
      console.log("Menyimpan Daftar Belanja baru:", daftarBelanjaToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const itemToEdit = daftarBelanjaData.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data belanja yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setDaftarBelanjaData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data belanja berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Table columns configuration
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "upb", headerName: "UPB", width: 120 },
    {
      field: "tanggalBaPenerimaan",
      headerName: "Tanggal BA Penerimaan Barang",
      width: 200,
    },
    { field: "kodeKegiatan", headerName: "Kode Kegiatan", width: 150 },
    { field: "namaPekerjaan", headerName: "Nama Pekerjaan", width: 200 },
    { field: "nomorKontrak", headerName: "Nomor Kontrak", width: 150 },
    { field: "tanggalKontrak", headerName: "Tanggal Kontrak", width: 150 },
    {
      field: "kualifikasiBelanja",
      headerName: "Kualifikasi Belanja",
      width: 150,
    },
    {
      field: "totalBarang",
      headerName: "Total Barang",
      type: "number",
      width: 120,
    },
    {
      field: "totalHarga",
      headerName: "Total Harga",
      type: "number",
      width: 150,
    },
    {
      field: "nilaiRetensi",
      headerName: "Nilai Retensi",
      type: "number",
      width: 150,
    },
    {
      field: "nilaiRealisasi",
      headerName: "Nilai Realisasi",
      type: "number",
      width: 150,
    },
    { field: "statusTotalHarga", headerName: "Status Total Harga", width: 150 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleEditClick(params.row.id)}
            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(params.row.id)}
            className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Filter dropdown component
  const FilterDropdown = ({
    label,
    value,
    options,
    onChange,
    valueKey = "nama",
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">-- {label} --</option>
      {options.map((option, index) => (
        <option key={option.id || index} value={option[valueKey] || option}>
          {option[valueKey] || option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="px-8 py-8">
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Daftar Belanja APBD</h1>

          {/* Filters and Action Buttons */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-1">
              <FilterDropdown
                label="Tahun"
                value={filters.tahun}
                options={filterOptions.tahun}
                onChange={(value) => handleFilterChange("tahun", value)}
                valueKey={null}
              />
              <FilterDropdown
                label="Bidang"
                value={filters.bidang}
                options={filterOptions.bidang}
                onChange={(value) => handleFilterChange("bidang", value)}
              />
              <FilterDropdown
                label="Unit"
                value={filters.unit}
                options={filterOptions.unit}
                onChange={(value) => handleFilterChange("unit", value)}
              />
              <FilterDropdown
                label="Sub Unit"
                value={filters.subUnit}
                options={filterOptions.subUnit}
                onChange={(value) => handleFilterChange("subUnit", value)}
              />
              <FilterDropdown
                label="UPB"
                value={filters.upb}
                options={filterOptions.upb}
                onChange={(value) => handleFilterChange("upb", value)}
              />
              <FilterDropdown
                label="Semester"
                value={filters.semester}
                options={filterOptions.semester}
                onChange={(value) => handleFilterChange("semester", value)}
              />
              <FilterDropdown
                label="Kualifikasi"
                value={filters.kualifikasiBelanja}
                options={filterOptions.kualifikasiBelanja}
                onChange={(value) =>
                  handleFilterChange("kualifikasiBelanja", value)
                }
              />
              <FilterDropdown
                label="Status Verifikasi"
                value={filters.statusVerifikasi}
                options={filterOptions.statusVerifikasi}
                onChange={(value) =>
                  handleFilterChange("statusVerifikasi", value)
                }
              />
              <FilterDropdown
                label="Status Total"
                value={filters.statusTotalHarga}
                options={filterOptions.statusTotalBelanja}
                onChange={(value) =>
                  handleFilterChange("statusTotalHarga", value)
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-center lg:self-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Barang
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              />
            </div>
          </div>

          {/* Data Table */}
          {loading ? (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="Tidak ada data tersedia"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
              loading={true} // <-- ini yang penting
            />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">⚠️ Error</div>
              <div className="text-gray-600">{error}</div>
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
                loading={false} // <-- ini yang penting
              />
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddBarangModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewDaftarBelanja}
        initialData={editingItem}
      />
    </div>
  );
};

export default DaftarBelanjaPage;
