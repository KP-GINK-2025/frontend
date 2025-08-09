import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import {
  RefreshCw,
  Plus,
  Download,
  Search,
  Printer,
  Trash2,
  Navigation,
} from "lucide-react";
import AddMutasiModal from "./AddMutasiModal";
import { ColumnManager } from "@/components/table";
import Swal from "sweetalert2";

const DaftarMutasiPage = () => {
  // State untuk data dan loading
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [mutasiData, setMutasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data dropdown filter
  const [filterData, setFilterData] = useState({
    kualifikasiPerolehan: [],
    asal: [],
    tujuan: [],
    statusVerifikasi: [],
  });

  // State untuk filter yang dipilih
  const [selectedFilters, setSelectedFilters] = useState({
    kualifikasiPerolehan: "",
    asal: "",
    tujuan: "",
    statusVerifikasi: "",
  });

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State untuk column visibility
  const [columnVisibility, setColumnVisibility] = useState({
    action: true,
    no: true,
    id: false,
    kualifikasiPerolehan: true,
    asal: true,
    tujuan: true,
    tahun: false,
    semester: false,
    nomorBeritaAcara: true,
    tanggalBeritaAcara: true,
    totalBarang: true,
    totalHarga: true,
    lampiran: true,
    statusVerifikasi: true,
    catatanVerifikasi: false,
  });

  // State untuk pagination
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: entriesPerPage,
  });

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulasi delay untuk menunjukkan loading
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Data dropdown filter
      const newFilterData = {
        kualifikasiPerolehan: [
          { id: 1, nama: "Dropping Pusat" },
          { id: 2, nama: "Dropping Pemda" },
          { id: 3, nama: "Hibah" },
          { id: 4, nama: "Pembelian" },
        ],
        asal: [
          { id: 1, nama: "Jakarta" },
          { id: 2, nama: "Lampung" },
          { id: 3, nama: "Dinas Lingkungan Hidup" },
          { id: 4, nama: "Dinas Perpustakaan dan Kearsipan Daerah" },
          { id: 5, nama: "Badan Pengelola Keuangan Daerah" },
          {
            id: 6,
            nama: "Dinas Pariwisata, Kebudayaan, Kepemudaan dan Olahraga",
          },
          { id: 7, nama: "Sekretariat DPRD" },
        ],
        tujuan: [
          { id: 1, nama: "Bandar Lampung" },
          { id: 2, nama: "Metro" },
          { id: 3, nama: "Dinas Pekerjaan Umum dan Perumahan Rakyat" },
          { id: 4, nama: "Sekretariat Daerah" },
          { id: 5, nama: "Badan Pendapatan Daerah" },
          { id: 6, nama: "Dinas Pendidikan" },
          { id: 7, nama: "Dinas Sosial" },
        ],
        statusVerifikasi: [
          { id: 1, nama: "Diverifikasi" },
          { id: 2, nama: "Menunggu" },
          { id: 3, nama: "Ditolak" },
          { id: 4, nama: "Draft" },
          { id: 5, nama: "Valid" },
        ],
      };

      // Data mutasi dummy
      const dummyMutasiData = [
        {
          id: 1,
          kualifikasiPerolehan: "Mutasi SKPD Lain(Aset Lama)",
          asal: "Dinas Lingkungan Hidup",
          tujuan: "Dinas Pekerjaan Umum dan Perumahan Rakyat",
          tanggalBeritaAcara: "17/12/2024",
          nomorBeritaAcara: "028/374.a/33/2024",
          totalBarang: 2,
          totalHarga: 868400000,
          lampiran: "",
          statusVerifikasi: "Draft",
        },
        {
          id: 2,
          kualifikasiPerolehan: "Mutasi SKPD Lain(Aset Lama)",
          asal: "Dinas Perpustakaan dan Kearsipan Daerah",
          tujuan: "Sekretariat Daerah",
          tanggalBeritaAcara: "04/06/2025",
          nomorBeritaAcara: "024/58/37/2025",
          totalBarang: 0,
          totalHarga: 0,
          lampiran: "B A S T Randis dpkd (perpus - sekda).jpg",
          statusVerifikasi: "Draft",
        },
        {
          id: 3,
          kualifikasiPerolehan: "Mutasi SKPD Lain(Aset Lama)",
          asal: "Badan Pengelola Keuangan Daerah",
          tujuan: "Badan Pendapatan Daerah",
          tanggalBeritaAcara: "06/01/2025",
          nomorBeritaAcara: "900/1080/43/2025",
          totalBarang: 344,
          totalHarga: 22616897221.5,
          lampiran: "BAST MUTASI KE BAAPENDA 2025.pdf",
          statusVerifikasi: "Draft",
        },
        {
          id: 4,
          kualifikasiPerolehan: "Mutasi SKPD Lain(Aset Lama)",
          asal: "Dinas Pariwisata, Kebudayaan, Kepemudaan dan Olahraga",
          tujuan: "Dinas Pendidikan",
          tanggalBeritaAcara: "03/03/2025",
          nomorBeritaAcara: "027/1122/22/2025",
          totalBarang: 12,
          totalHarga: 41869429,
          lampiran:
            "BA mutasi barang disparekraf kpd disdikbud 2026-compressed.pdf",
          statusVerifikasi: "Valid",
        },
        {
          id: 5,
          kualifikasiPerolehan: "Mutasi SKPD Lain(Aset Lama)",
          asal: "Sekretariat DPRD",
          tujuan: "Dinas Sosial",
          tanggalBeritaAcara: "30/06/2025",
          nomorBeritaAcara: "4567",
          totalBarang: 0,
          totalHarga: 0,
          lampiran: "",
          statusVerifikasi: "Draft",
        },
      ];

      setFilterData(newFilterData);
      setMutasiData(dummyMutasiData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
      showToast("error", "Error!", "Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Update pagination when entries per page changes
  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  // Utility function untuk menampilkan toast
  const showToast = (icon, title, text, timer = 2000) => {
    Swal.fire({
      icon,
      title,
      text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer,
    });
  };

  // Filter data based on search and selected filters
  const filteredData = mutasiData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(selectedFilters).every(
      ([key, value]) => {
        if (!value) return true;
        return item[key] === value;
      }
    );

    return matchesSearch && matchesFilters;
  });

  // Calculate totals from the filtered data
  const totalBarang = filteredData.reduce(
    (sum, item) => sum + item.totalBarang,
    0
  );
  const totalHarga = filteredData.reduce(
    (sum, item) => sum + item.totalHarga,
    0
  );

  // Create a total row object and add it to the filtered data array
  const totalRow = {
    id: "total",
    no: "Total", // Pindahkan label "Total" ke kolom no
    kualifikasiPerolehan: "", // Kosongkan kolom kualifikasi
    totalBarang: totalBarang,
    totalHarga: totalHarga,
    asal: "",
    tujuan: "",
    tanggalBeritaAcara: "",
    nomorBeritaAcara: "",
    lampiran: "",
    statusVerifikasi: "",
  };
  const dataWithTotal = [...filteredData, totalRow];

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // Reset all filters and refresh data
  const handleRefresh = async () => {
    setSearchTerm("");
    setSelectedFilters({
      kualifikasiPerolehan: "",
      asal: "",
      tujuan: "",
      statusVerifikasi: "",
    });
    setDataTablePaginationModel({ page: 0, pageSize: entriesPerPage });

    await fetchData();
    showToast("success", "Berhasil!", "Data berhasil dimuat ulang.");
  };

  // Export functionality
  const handleExport = () => {
    console.log("Exporting Daftar Mutasi...");
    showToast("info", "Export", "Fitur export sedang dalam pengembangan.");
  };

  // Modal handlers
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  // Save new mutasi
  const handleSaveNewMutasi = (mutasiToSave) => {
    setMutasiData((prevData) => [
      ...prevData,
      { ...mutasiToSave, id: Date.now() },
    ]);

    showToast("success", "Berhasil!", "Data mutasi baru berhasil ditambahkan.");
    handleCloseAddModal();
  };

  // Handler for "Lihat" (View) button
  const handleLihatClick = (id) => {
    const itemToView = mutasiData.find((item) => item.id === id);
    if (!itemToView) return;

    Swal.fire({
      title: "Detail Mutasi",
      html: `
        <div class="text-left">
          <p><strong>Kualifikasi Perolehan:</strong> ${
            itemToView.kualifikasiPerolehan
          }</p>
          <p><strong>Asal:</strong> ${itemToView.asal}</p>
          <p><strong>Tujuan:</strong> ${itemToView.tujuan}</p>
          <p><strong>Tanggal Berita Acara:</strong> ${
            itemToView.tanggalBeritaAcara
          }</p>
          <p><strong>Nomor Berita Acara:</strong> ${
            itemToView.nomorBeritaAcara
          }</p>
          <p><strong>Total Barang:</strong> ${itemToView.totalBarang}</p>
          <p><strong>Total Harga:</strong> ${new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(itemToView.totalHarga)}</p>
          <p><strong>Status Verifikasi:</strong> ${
            itemToView.statusVerifikasi
          }</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Tutup",
      width: 600,
      customClass: {
        confirmButton:
          "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700",
      },
    });
  };

  // Handler for "Cetak" (Print) button
  const handleCetakClick = (id) => {
    showToast(
      "info",
      "Cetak Mutasi",
      `Fitur cetak untuk mutasi ID ${id} sedang dalam pengembangan.`
    );
  };

  // Handler for "Hapus" (Delete) button
  const handleHapusClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: false,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 text-white px-4 py-2 mr-1 rounded-md hover:bg-red-700 hover:outline-none cursor-pointer",
        cancelButton:
          "bg-gray-200 text-gray-700 px-4 py-2 ml-1 rounded-md hover:bg-gray-300 hover:outline-none cursor-pointer",
        popup: "rounded-lg shadow-lg",
      },
    });

    if (result.isConfirmed) {
      setMutasiData((prevData) => prevData.filter((item) => item.id !== id));
      showToast("success", "Terhapus!", "Data mutasi berhasil dihapus.");
    }
  };

  // Table columns definition
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return (
          <div className="flex items-center gap-3 h-full">
            <button
              onClick={() => handleLihatClick(params.row.id)}
              className="text-blue-600 hover:text-blue-800 cursor-pointer p-1 hover:bg-blue-50 rounded"
              title="Lihat"
            >
              <Navigation size={16} />
            </button>
            <button
              onClick={() => handleCetakClick(params.row.id)}
              className="text-green-600 hover:text-green-800 cursor-pointer p-1 hover:bg-green-50 rounded"
              title="Cetak"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={() => handleHapusClick(params.row.id)}
              className="text-red-600 hover:text-red-800 cursor-pointer p-1 hover:bg-red-50 rounded"
              title="Hapus"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === "total") {
          return <span className="font-bold">Total</span>;
        }
        return (
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1 +
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize
        );
      },
    },
    {
      field: "id",
      headerName: "ID",
      width: 120,
      renderCell: (params) => {
        // Return null untuk total row agar tidak ada konten yang ditampilkan
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "kualifikasiPerolehan",
      headerName: "Kualifikasi Perolehan",
      width: 200,
    },
    { field: "asal", headerName: "Asal", width: 120 },
    { field: "tujuan", headerName: "Tujuan", width: 120 },
    { field: "tahun", headerName: "Tahun", width: 120 },
    { field: "semester", headerName: "Semester", width: 120 },
    { field: "nomorBeritaAcara", headerName: "No. Berita Acara", width: 150 },
    {
      field: "tanggalBeritaAcara",
      headerName: "Tgl. Berita Acara",
      width: 150,
    },
    {
      field: "totalBarang",
      headerName: "Total Barang",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <span className={params.row.id === "total" ? "font-bold" : ""}>
          {params.value}
        </span>
      ),
    },
    {
      field: "totalHarga",
      headerName: "Total Harga",
      type: "number",
      width: 150,
      renderCell: (params) => {
        const formattedValue = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);

        return (
          <span className={params.row.id === "total" ? "font-bold" : ""}>
            {formattedValue}
          </span>
        );
      },
    },
    { field: "lampiran", headerName: "Lampiran", width: 100 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 150,
    },
  ];

  // Filter visible columns based on columnVisibility state
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.field] !== false
  );

  // Render filter dropdown
  const renderFilterSelect = (filterKey, placeholder, options) => (
    <select
      value={selectedFilters[filterKey]}
      onChange={(e) => handleFilterChange(filterKey, e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.nama}>
          {option.nama}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Daftar Mutasi
            </h1>

            {/* Filters and Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6">
              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1">
                {renderFilterSelect(
                  "kualifikasiPerolehan",
                  "-- Kualifikasi Perolehan --",
                  filterData.kualifikasiPerolehan
                )}
                {renderFilterSelect("asal", "-- Asal --", filterData.asal)}
                {renderFilterSelect(
                  "tujuan",
                  "-- Tujuan --",
                  filterData.tujuan
                )}
                {renderFilterSelect(
                  "statusVerifikasi",
                  "-- Status Verifikasi --",
                  filterData.statusVerifikasi
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 items-center">
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
                <button
                  onClick={handleOpenAddModal}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                  Add Mutasi
                </button>
              </div>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>entries</span>
                <ColumnManager
                  columns={columns}
                  columnVisibility={columnVisibility}
                  onColumnVisibilityChange={setColumnVisibility}
                />
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
                  disabled={loading}
                />
              </div>
            </div>

            {/* Data Table */}
            {error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-2">⚠️ Error</div>
                <div className="text-gray-600">{error}</div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <DataTable
                  rows={dataWithTotal}
                  columns={visibleColumns}
                  initialPageSize={entriesPerPage}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  height={500}
                  emptyRowsMessage="Tidak ada data tersedia"
                  paginationModel={dataTablePaginationModel}
                  onPaginationModelChange={setDataTablePaginationModel}
                  loading={loading}
                  getRowClassName={(params) =>
                    params.id === "total" ? "bg-gray-100 font-bold" : ""
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AddMutasiModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewMutasi}
      />
    </div>
  );
};

export default DaftarMutasiPage;
