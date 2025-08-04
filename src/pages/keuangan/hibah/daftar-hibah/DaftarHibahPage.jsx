import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const DaftarHibahPage = () => {
  // --- State untuk Data dan Filter ---
  const [searchTerm, setSearchTerm] = useState("");
  const [daftarHibahData, setDaftarHibahData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [rowCount, setRowCount] = useState(0); // Total jumlah baris dari API
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [exporting, setExporting] = useState(false); // State untuk loading export

  // --- State untuk Filter Dropdown ---
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

  // --- State untuk Paginasi DataTable ---
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0, // Halaman saat ini (0-indexed)
    pageSize: 10, // Jumlah baris per halaman
  });

  // --- OPTIMISASI: Debounce search term ---
  // State untuk menyimpan search term yang di-debounce
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Tunggu 300ms setelah user berhenti mengetik

    return () => {
      clearTimeout(timer); // Bersihkan timer jika searchTerm berubah sebelum 300ms
    };
  }, [searchTerm]);

  // Reset halaman ke 0 ketika debouncedSearchTerm berubah
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, searchTerm]);

  // Mock data functions
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
    {
      id: 6,
      asal: "Kementerian C",
      tujuan: "Dinas Pariwisata",
      noBeritaAcara: "BA/Hibah/006/2024",
      tglBeritaAcara: "2024-06-15",
      totalBarang: 20,
      totalHarga: 100000000,
      lampiran: "Doc_Hibah_006.pdf",
      statusVerifikasi: "Diverifikasi",
      semester: "2",
    },
    {
      id: 7,
      asal: "Yayasan XYZ",
      tujuan: "Dinas Kebudayaan",
      noBeritaAcara: "BA/Hibah/007/2024",
      tglBeritaAcara: "2024-07-22",
      totalBarang: 8,
      totalHarga: 30000000,
      lampiran: "Doc_Hibah_007.pdf",
      statusVerifikasi: "Menunggu",
      semester: "2",
    },
  ];

  const getMockFilterOptions = () => ({
    asal: [
      { id: 1, nama: "Kementerian A" },
      { id: 2, nama: "Kementerian B" },
      { id: 3, nama: "Kementerian C" },
      { id: 4, nama: "Swasta XYZ" },
      { id: 5, nama: "Swasta ABC" },
      { id: 6, nama: "Yayasan ABC" },
      { id: 7, nama: "Yayasan XYZ" },
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

  // --- EFEK UTAMA UNTUK FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRefreshing(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulate API parameters
        const params = new URLSearchParams();
        params.append("page", dataTablePaginationModel.page + 1);
        params.append("per_page", dataTablePaginationModel.pageSize);
        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }
        if (filters.asal) {
          params.append("asal", filters.asal);
        }
        if (filters.semester) {
          params.append("semester", filters.semester);
        }
        if (filters.statusVerifikasi) {
          params.append("status_verifikasi", filters.statusVerifikasi);
        }

        // Get mock data and apply filters
        let mockData = getMockData();

        // Apply search filter
        if (debouncedSearchTerm) {
          mockData = mockData.filter((item) =>
            [
              item.asal,
              item.tujuan,
              item.noBeritaAcara,
              item.tglBeritaAcara,
              item.totalBarang?.toString(),
              item.totalHarga?.toString(),
              item.lampiran,
              item.statusVerifikasi,
            ].some((field) =>
              field?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
          );
        }

        // Apply dropdown filters
        if (filters.asal) {
          mockData = mockData.filter((item) => item.asal === filters.asal);
        }
        if (filters.semester) {
          mockData = mockData.filter(
            (item) => item.semester === filters.semester
          );
        }
        if (filters.statusVerifikasi) {
          mockData = mockData.filter(
            (item) => item.statusVerifikasi === filters.statusVerifikasi
          );
        }

        // Apply pagination
        const startIndex =
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize;
        const paginatedData = mockData.slice(
          startIndex,
          startIndex + dataTablePaginationModel.pageSize
        );

        setDaftarHibahData(paginatedData);
        setRowCount(mockData.length);
        setFilterOptions(getMockFilterOptions());
      } catch (error) {
        console.error("Gagal fetch data hibah:", error);
        setDaftarHibahData([]);
        setRowCount(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
  }, [dataTablePaginationModel, debouncedSearchTerm, refreshTrigger, filters]);

  // --- Handler Fungsi ---
  const handleExport = async () => {
    setExporting(true);

    try {
      // Simulate fetching all data for export
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let allData = getMockData();

      // Apply current filters to export data
      if (debouncedSearchTerm) {
        allData = allData.filter((item) =>
          [
            item.asal,
            item.tujuan,
            item.noBeritaAcara,
            item.tglBeritaAcara,
            item.totalBarang?.toString(),
            item.totalHarga?.toString(),
            item.lampiran,
            item.statusVerifikasi,
          ].some((field) =>
            field?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
        );
      }

      if (filters.asal) {
        allData = allData.filter((item) => item.asal === filters.asal);
      }
      if (filters.semester) {
        allData = allData.filter((item) => item.semester === filters.semester);
      }
      if (filters.statusVerifikasi) {
        allData = allData.filter(
          (item) => item.statusVerifikasi === filters.statusVerifikasi
        );
      }

      if (allData.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Tidak Ada Data",
          text: "Tidak ada data untuk diekspor.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        return;
      }

      // Format data untuk export
      const exportData = allData.map((item, index) => ({
        No: index + 1,
        Asal: item.asal,
        Tujuan: item.tujuan,
        "No. Berita Acara": item.noBeritaAcara,
        "Tgl. Berita Acara": item.tglBeritaAcara,
        "Total Barang": item.totalBarang,
        "Total Harga": item.totalHarga,
        Lampiran: item.lampiran,
        "Status Verifikasi": item.statusVerifikasi,
        Semester: item.semester,
      }));

      // Buat worksheet dan workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      // Set column widths
      const columnWidths = [
        { wch: 5 }, // No
        { wch: 20 }, // Asal
        { wch: 20 }, // Tujuan
        { wch: 20 }, // No. Berita Acara
        { wch: 15 }, // Tgl. Berita Acara
        { wch: 12 }, // Total Barang
        { wch: 15 }, // Total Harga
        { wch: 20 }, // Lampiran
        { wch: 15 }, // Status Verifikasi
        { wch: 10 }, // Semester
      ];
      worksheet["!cols"] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Hibah");

      // Generate filename dengan timestamp
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, "-");
      const filename = `data-hibah-${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);

      // Tampilkan notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Export Berhasil!",
        text: `Data berhasil diekspor ke file ${filename}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Gagal export data:", error);
      Swal.fire({
        icon: "error",
        title: "Export Gagal!",
        text: "Terjadi kesalahan saat mengekspor data.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setSearchTerm("");
      setFilters({
        asal: "",
        semester: "",
        statusVerifikasi: "",
      });
      setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
      setRefreshTrigger((c) => c + 1);

      await new Promise((resolve) => setTimeout(resolve, 800));

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
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal memuat ulang data",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddHibah = () => {
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

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data hibah yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 text-white px-4 py-2 mr-1 rounded-md hover:bg-red-700 hover:outline-none cursor-pointer",
        cancelButton:
          "bg-gray-200 text-gray-700 px-4 py-2 ml-1 rounded-md hover:bg-gray-300 hover:outline-none cursor-pointer",
        popup: "rounded-lg shadow-lg",
      },
    });

    if (!result.isConfirmed) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      Swal.fire({
        title: "Berhasil Delete",
        text: "Data hibah berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleRefresh(); // Refresh data
    } catch (error) {
      console.error("Gagal menghapus hibah:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 })); // Reset to first page
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  // --- Konfigurasi Kolom DataTable ---
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
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = daftarHibahData.findIndex(
          (row) => row.id === params.row.id
        );
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    {
      field: "asal",
      headerName: "Asal",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "tujuan",
      headerName: "Tujuan",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "noBeritaAcara",
      headerName: "No. Berita Acara",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "tglBeritaAcara",
      headerName: "Tgl. Berita Acara",
      width: 150,
    },
    {
      field: "totalBarang",
      headerName: "Total Barang",
      width: 120,
      renderCell: (params) => <div className="text-center">{params.value}</div>,
    },
    {
      field: "totalHarga",
      headerName: "Total Harga",
      width: 150,
      renderCell: (params) => (
        <div className="text-green-600 font-medium">
          {formatCurrency(params.value)}
        </div>
      ),
    },
    {
      field: "lampiran",
      headerName: "Lampiran",
      width: 150,
      renderCell: (params) => (
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {params.value}
        </span>
      ),
    },
    {
      field: "statusVerifikasi",
      headerName: "Status Verifikasi",
      width: 150,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.value === "Diverifikasi"
              ? "bg-green-100 text-green-800"
              : params.value === "Menunggu"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} className={exporting ? "animate-pulse" : ""} />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Hibah</h1>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={handleAddHibah}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Hibah
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                value={dataTablePaginationModel.pageSize}
                onChange={(e) => {
                  setDataTablePaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0,
                  }));
                }}
                className="border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer"
              >
                {[5, 10, 25, 50, 75, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600 text-sm">entries</span>
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
              />
            </div>
          </div>

          <DataTable
            rows={daftarHibahData}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            filterMode="server"
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            paginationModel={dataTablePaginationModel}
            onPaginationModelChange={setDataTablePaginationModel}
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
          />
        </div>
      </div>
    </div>
  );
};

export default DaftarHibahPage;
