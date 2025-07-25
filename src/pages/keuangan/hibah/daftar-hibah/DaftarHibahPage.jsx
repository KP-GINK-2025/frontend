import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import Swal from "sweetalert2";

const DaftarHibahPage = () => {
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Main data state
  const [daftarHibahData, setDaftarHibahData] = useState([]);

  // Filter dropdown data states
  const [filterOptions, setFilterOptions] = useState({
    asal: [],
    semester: [],
    statusVerifikasi: [],
  });

  // Selected filter states
  const [filters, setFilters] = useState({
    asal: "",
    semester: "",
    statusVerifikasi: "",
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data
  const getMockData = () => [
    {
      id: 1,
      asal: "Kementerian A",
      tujuan: "Dinas Pendidikan",
      noBeritaAcara: "BA/Hibah/001/2024",
      tglBeritaAcara: "2024-01-15",
      totalBarang: 10,
      totalHarga: 50000000,
      lampiran: "Doc_Hibah_001.pdf",
      statusVerifikasi: "Diverifikasi",
      semester: "1",
    },
    {
      id: 2,
      asal: "Swasta XYZ",
      tujuan: "Dinas Kesehatan",
      noBeritaAcara: "BA/Hibah/002/2024",
      tglBeritaAcara: "2024-02-20",
      totalBarang: 3,
      totalHarga: 15000000,
      lampiran: "Doc_Hibah_002.pdf",
      statusVerifikasi: "Menunggu",
      semester: "1",
    },
    {
      id: 3,
      asal: "Yayasan ABC",
      tujuan: "Dinas Sosial",
      noBeritaAcara: "BA/Hibah/003/2024",
      tglBeritaAcara: "2024-03-10",
      totalBarang: 7,
      totalHarga: 25000000,
      lampiran: "Doc_Hibah_003.pdf",
      statusVerifikasi: "Ditolak",
      semester: "2",
    },
    {
      id: 4,
      asal: "Kementerian B",
      tujuan: "Dinas Pekerjaan Umum",
      noBeritaAcara: "BA/Hibah/004/2024",
      tglBeritaAcara: "2024-04-12",
      totalBarang: 15,
      totalHarga: 75000000,
      lampiran: "Doc_Hibah_004.pdf",
      statusVerifikasi: "Diverifikasi",
      semester: "2",
    },
    {
      id: 5,
      asal: "Swasta ABC",
      tujuan: "Dinas Lingkungan Hidup",
      noBeritaAcara: "BA/Hibah/005/2024",
      tglBeritaAcara: "2024-05-08",
      totalBarang: 5,
      totalHarga: 12000000,
      lampiran: "Doc_Hibah_005.pdf",
      statusVerifikasi: "Menunggu",
      semester: "1",
    },
  ];

  const getMockFilterOptions = () => ({
    asal: [
      { id: 1, nama: "Kementerian A" },
      { id: 2, nama: "Kementerian B" },
      { id: 3, nama: "Swasta XYZ" },
      { id: 4, nama: "Swasta ABC" },
      { id: 5, nama: "Yayasan ABC" },
    ],
    semester: [
      { id: 1, nama: "1" },
      { id: 2, nama: "2" },
    ],
    statusVerifikasi: [
      { id: 1, nama: "Menunggu" },
      { id: 2, nama: "Diverifikasi" },
      { id: 3, nama: "Ditolak" },
    ],
  });

  // Reset filters to initial state
  const resetFilters = () => {
    setFilters({
      asal: "",
      semester: "",
      statusVerifikasi: "",
    });
  };

  // Fetch data function with proper loading state management
  const fetchData = useCallback(async (showSuccessMessage = false) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set filter dropdown options
      setFilterOptions(getMockFilterOptions());

      // Set main table data
      setDaftarHibahData(getMockData());

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
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data based on search term and selected filters
  const filteredData = daftarHibahData.filter((item) => {
    const matchesSearch = [
      item.asal,
      item.tujuan,
      item.noBeritaAcara,
      item.tglBeritaAcara,
      item.totalBarang?.toString(),
      item.totalHarga?.toString(),
      item.lampiran,
      item.statusVerifikasi,
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
  };

  // Handle refresh with proper loading state and SweetAlert
  const handleRefresh = async () => {
    setSearchTerm("");
    resetFilters();
    await fetchData(true); // Pass true to show success message
  };

  const handleExport = () => {
    console.log("Exporting Daftar Hibah...");
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

  const handleAddHibah = () => {
    console.log("Adding new Hibah...");
    Swal.fire({
      icon: "info",
      title: "Add Hibah",
      text: "Fitur tambah hibah sedang dalam pengembangan.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleEditClick = (id) => {
    console.log("Edit hibah:", id);
    Swal.fire({
      icon: "info",
      title: "Edit Hibah",
      text: "Fitur edit hibah sedang dalam pengembangan.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data hibah yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setDaftarHibahData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data hibah berhasil dihapus.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Pagination calculations
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const currentPage = 1; // For now, we'll keep it simple with page 1
  const displayedData = filteredData.slice(0, entriesPerPage);

  // Filter dropdown component
  const FilterDropdown = ({
    label,
    value,
    options,
    onChange,
    valueKey = "nama",
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="">-- Pilih {label} --</option>
        {options.map((option, index) => (
          <option key={option.id || index} value={option[valueKey] || option}>
            {option[valueKey] || option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <Breadcrumbs />
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Daftar Hibah
          </h1>

          {/* Filters and Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
            <FilterDropdown
              label="Asal"
              value={filters.asal}
              options={filterOptions.asal}
              onChange={(value) => handleFilterChange("asal", value)}
            />

            <FilterDropdown
              label="Semester"
              value={filters.semester}
              options={filterOptions.semester}
              onChange={(value) => handleFilterChange("semester", value)}
            />

            <FilterDropdown
              label="Status Verifikasi"
              value={filters.statusVerifikasi}
              options={filterOptions.statusVerifikasi}
              onChange={(value) =>
                handleFilterChange("statusVerifikasi", value)
              }
            />

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
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
              <button
                onClick={handleAddHibah}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium cursor-pointer"
              >
                <Plus size={16} /> Add Hibah
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
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
              />
            </div>
          </div>

          {/* Data Table */}
          {error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <div className="text-red-600 text-lg mb-2">⚠️ Error</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button
                onClick={() => fetchData()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Action
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Asal
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Tujuan
                    </th>
                    <th scope="col" className="py-3 px-6">
                      No. Berita Acara
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Tgl. Berita Acara
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Total Barang
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Total Harga
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Lampiran
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Status Verifikasi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="py-8 px-6 text-center text-gray-600"
                      >
                        <div className="flex items-center justify-center">
                          <RefreshCw size={20} className="animate-spin mr-2" />
                          Memuat data...
                        </div>
                      </td>
                    </tr>
                  ) : displayedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="py-8 px-6 text-center text-gray-500"
                      >
                        Tidak ada data tersedia
                      </td>
                    </tr>
                  ) : (
                    displayedData.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(item.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item.id)}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900">
                          {item.asal}
                        </td>
                        <td className="py-4 px-6">{item.tujuan}</td>
                        <td className="py-4 px-6">{item.noBeritaAcara}</td>
                        <td className="py-4 px-6">{item.tglBeritaAcara}</td>
                        <td className="py-4 px-6 text-center">
                          {item.totalBarang}
                        </td>
                        <td className="py-4 px-6 font-medium text-green-600">
                          {formatCurrency(item.totalHarga)}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            {item.lampiran}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.statusVerifikasi === "Diverifikasi"
                                ? "bg-green-100 text-green-800"
                                : item.statusVerifikasi === "Menunggu"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.statusVerifikasi}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Info */}
          {!loading && !error && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-700 gap-4">
              <div>
                Menampilkan {displayedData.length > 0 ? 1 : 0} sampai{" "}
                {displayedData.length} dari {totalEntries} entri
                {filteredData.length !== daftarHibahData.length &&
                  ` (difilter dari ${daftarHibahData.length} total entri)`}
              </div>
              <div className="flex gap-2">
                <button
                  className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="py-1 px-3 border border-gray-300 rounded-md bg-blue-50 text-blue-600">
                  {currentPage}
                </span>
                <button
                  className="py-1 px-3 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaftarHibahPage;
