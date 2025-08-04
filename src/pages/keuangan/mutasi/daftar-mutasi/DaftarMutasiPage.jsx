import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import AddMutasiModal from "./AddMutasiModal";
import Swal from "sweetalert2";

const DaftarMutasiPage = () => {
  // State untuk data dan loading
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [mutasiData, setMutasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State untuk data dropdown filter
  const [filterData, setFilterData] = useState({
    kualifikasiPerolehan: [],
    asal: [],
    tujuan: [],
    semester: [],
    statusVerifikasi: [],
  });

  // State untuk filter yang dipilih
  const [selectedFilters, setSelectedFilters] = useState({
    kualifikasiPerolehan: "",
    asal: "",
    tujuan: "",
    semester: "",
    statusVerifikasi: "",
  });

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
        ],
        tujuan: [
          { id: 1, nama: "Bandar Lampung" },
          { id: 2, nama: "Metro" },
        ],
        semester: [
          { id: 1, nama: "Ganjil" },
          { id: 2, nama: "Genap" },
        ],
        statusVerifikasi: [
          { id: 1, nama: "Diverifikasi" },
          { id: 2, nama: "Menunggu" },
          { id: 3, nama: "Ditolak" },
        ],
      };

      // Data mutasi dummy
      const dummyMutasiData = [
        {
          id: 1,
          kualifikasiPerolehan: "Dropping Pusat",
          asal: "Jakarta",
          tujuan: "Bandar Lampung",
          tanggalBeritaAcara: "2024-01-10",
          nomorBeritaAcara: "BA/DP/001",
          totalBarang: 50,
          totalHarga: 250000000,
          lampiran: "lampiran_dp001.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Dokumen lengkap",
          tahunPerolehan: "2024",
          nomorSp2d: "SP2D/001",
          tanggalSp2d: "2024-01-05",
          nomorSuratPengantar: "SP/PST/001",
          tanggalSuratPengantar: "2024-01-01",
          semester: "Ganjil",
        },
        {
          id: 2,
          kualifikasiPerolehan: "Dropping Pemda",
          asal: "Metro",
          tujuan: "Bandar Lampung",
          tanggalBeritaAcara: "2024-02-15",
          nomorBeritaAcara: "BA/DPM/002",
          totalBarang: 20,
          totalHarga: 75000000,
          lampiran: "lampiran_dpm002.pdf",
          statusVerifikasi: "Menunggu",
          catatanVerifikasi: "",
          opdAsal: "Dinas Pendidikan",
          opdTujuan: "Dinas Kesehatan",
          nomorSkpd: "SKPD/001",
          tanggalSkpd: "2024-02-10",
          semester: "Ganjil",
        },
        {
          id: 3,
          kualifikasiPerolehan: "Pembelian",
          asal: "Bandar Lampung",
          tujuan: "Bandar Lampung",
          tanggalBeritaAcara: "2024-03-01",
          nomorBeritaAcara: "BA/PBL/003",
          totalBarang: 5,
          totalHarga: 10000000,
          lampiran: "lampiran_pbl003.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Pembelian rutin",
          semester: "Genap",
        },
      ];

      setFilterData(newFilterData);
      setMutasiData(dummyMutasiData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);

      // Show error toast
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal memuat data. Silakan coba lagi.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
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
    setIsRefreshing(true);
    setSearchTerm("");
    setSelectedFilters({
      kualifikasiPerolehan: "",
      asal: "",
      tujuan: "",
      semester: "",
      statusVerifikasi: "",
    });
    setDataTablePaginationModel({ page: 0, pageSize: entriesPerPage });

    await fetchData();
    setIsRefreshing(false);

    // Show success toast
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil dimuat ulang.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Export functionality
  const handleExport = () => {
    console.log("Exporting Daftar Mutasi...");
    Swal.fire({
      icon: "info",
      title: "Export",
      text: "Fitur export sedang dalam pengembangan.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
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

  // Save new or edited mutasi
  const handleSaveNewMutasi = (mutasiToSave) => {
    if (mutasiToSave.id) {
      // Edit mode
      setMutasiData((prevData) =>
        prevData.map((item) =>
          item.id === mutasiToSave.id ? mutasiToSave : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data mutasi berhasil diperbarui.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      // Add new mode
      setMutasiData((prevData) => [
        ...prevData,
        { ...mutasiToSave, id: Date.now() },
      ]);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data mutasi baru berhasil ditambahkan.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    handleCloseAddModal();
  };

  // Edit mutasi
  const handleEditClick = (id) => {
    const itemToEdit = mutasiData.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setIsAddModalOpen(true);
    }
  };

  // Delete mutasi with SweetAlert2
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: false,
    });

    if (result.isConfirmed) {
      setMutasiData((prevData) => prevData.filter((item) => item.id !== id));

      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data mutasi berhasil dihapus.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // Table columns definition
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2 h-full">
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
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "kualifikasiPerolehan",
      headerName: "Kualifikasi Perolehan",
      width: 200,
    },
    { field: "asal", headerName: "Asal", width: 120 },
    { field: "tujuan", headerName: "Tujuan", width: 120 },
    {
      field: "tanggalBeritaAcara",
      headerName: "Tgl. Berita Acara",
      width: 150,
    },
    { field: "nomorBeritaAcara", headerName: "No. Berita Acara", width: 150 },
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
      valueFormatter: (params) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(params.value),
    },
    { field: "lampiran", headerName: "Lampiran", width: 100 },
    {
      field: "statusVerifikasi",
      headerName: "Status Verifikasi",
      width: 150,
      renderCell: (params) => {
        const status = params.value;
        let bgColor = "bg-gray-100 text-gray-800";

        if (status === "Diverifikasi") {
          bgColor = "bg-green-100 text-green-800";
        } else if (status === "Menunggu") {
          bgColor = "bg-yellow-100 text-yellow-800";
        } else if (status === "Ditolak") {
          bgColor = "bg-red-100 text-red-800";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}
          >
            {status}
          </span>
        );
      },
    },
    { field: "catatanVerifikasi", headerName: "Catatan Verifikasi", flex: 1 },
  ];

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">
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
                  "semester",
                  "-- Semester --",
                  filterData.semester
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
      </div>

      {/* Add/Edit Modal */}
      <AddMutasiModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewMutasi}
        initialData={editingItem}
      />
    </div>
  );
};

export default DaftarMutasiPage;
