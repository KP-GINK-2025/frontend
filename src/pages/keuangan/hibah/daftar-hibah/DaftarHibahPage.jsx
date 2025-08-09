import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { ColumnManager } from "@/components/table";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const DaftarHibahPage = () => {
  // Data states
  const [daftarHibahData, setDaftarHibahData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    asal: "",
    semester: "",
    statusVerifikasi: "",
  });

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Column visibility state - sesuai dengan checklist yang diberikan
  const [columnVisibility, setColumnVisibility] = useState({
    action: true, // Action - checked
    no: true, // No - checked
    id: false, // ID - unchecked
    tahun: false, // Tahun - unchecked
    semester: false, // Semester - unchecked
    asal: true, // Asal - checked
    tujuan: true, // Tujuan - checked
    noBeritaAcara: true, // No. Berita Acara - checked
    tglBeritaAcara: true, // Tgl. Berita Acara - checked
    totalBarang: true, // Total Barang - checked
    totalHarga: true, // Total Harga - checked
    lampiran: true, // Lampiran - checked
    statusVerifikasi: true, // Status Verifikasi - checked
    catatanVerifikasi: false, // Catatan Verifikasi - unchecked
  });

  // Static filter options
  const filterOptions = {
    asal: [
      "Kementerian A",
      "Kementerian B",
      "Kementerian C",
      "Swasta XYZ",
      "Swasta ABC",
      "Yayasan ABC",
      "Yayasan XYZ",
    ],
    semester: ["1", "2"],
    statusVerifikasi: ["Menunggu", "Diverifikasi", "Ditolak"],
  };

  // Mock data
  const mockData = [
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
      tahun: "2024",
      catatanVerifikasi: "Dokumen lengkap dan valid",
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
      tahun: "2024",
      catatanVerifikasi: "Menunggu verifikasi admin",
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
      tahun: "2024",
      catatanVerifikasi: "Dokumen tidak sesuai ketentuan",
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
      tahun: "2024",
      catatanVerifikasi: "Proses verifikasi selesai",
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
      tahun: "2024",
      catatanVerifikasi: "Dalam antrian verifikasi",
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
      tahun: "2024",
      catatanVerifikasi: "Hibah telah diverifikasi",
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
      tahun: "2024",
      catatanVerifikasi: "Sedang dalam proses review",
    },
  ];

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
      timerProgressBar: true,
    });
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Apply filters to data
  const applyFilters = useCallback(
    (data) => {
      return data.filter((item) => {
        // Search filter
        const matchesSearch =
          !debouncedSearchTerm ||
          Object.values(item).some((val) =>
            String(val)
              ?.toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
          );

        // Dropdown filters
        const matchesFilters =
          (!filters.asal || item.asal === filters.asal) &&
          (!filters.semester || item.semester === filters.semester) &&
          (!filters.statusVerifikasi ||
            item.statusVerifikasi === filters.statusVerifikasi);

        return matchesSearch && matchesFilters;
      });
    },
    [debouncedSearchTerm, filters]
  );

  // Get filtered and paginated data
  const getDisplayData = useCallback(() => {
    const filteredData = applyFilters(mockData);
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + paginationModel.pageSize
    );

    return { paginatedData, totalCount: filteredData.length };
  }, [applyFilters, paginationModel]);

  // Calculate totals for current filtered data (all pages)
  const getTotals = useCallback(() => {
    const filteredData = applyFilters(mockData);
    return {
      totalBarang: filteredData.reduce(
        (sum, item) => sum + item.totalBarang,
        0
      ),
      totalHarga: filteredData.reduce((sum, item) => sum + item.totalHarga, 0),
    };
  }, [applyFilters]);

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const { paginatedData, totalCount } = getDisplayData();
        setDaftarHibahData(paginatedData);
        setRowCount(totalCount);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDaftarHibahData([]);
        setRowCount(0);
        showToast("error", "Error!", "Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getDisplayData]);

  // Event handlers
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleRefresh = async () => {
    setSearchTerm("");
    setFilters({ asal: "", semester: "", statusVerifikasi: "" });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));

    // Trigger data refresh
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    showToast("success", "Berhasil!", "Data berhasil dimuat ulang.");
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const filteredData = applyFilters(mockData);

      if (filteredData.length === 0) {
        showToast(
          "warning",
          "Tidak Ada Data",
          "Tidak ada data untuk diekspor."
        );
        return;
      }

      // Format data for export
      const exportData = filteredData.map((item, index) => ({
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
        Tahun: item.tahun,
        "Catatan Verifikasi": item.catatanVerifikasi,
      }));

      // Add totals row
      const totals = getTotals();
      exportData.push({
        No: "",
        Asal: "",
        Tujuan: "",
        "No. Berita Acara": "",
        "Tgl. Berita Acara": "TOTAL",
        "Total Barang": totals.totalBarang,
        "Total Harga": totals.totalHarga,
        Lampiran: "",
        "Status Verifikasi": "",
        Semester: "",
        Tahun: "",
        "Catatan Verifikasi": "",
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      // Set column widths
      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 25 },
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Hibah");

      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:.]/g, "-");
      const filename = `data-hibah-${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);

      showToast(
        "success",
        "Export Berhasil!",
        `Data berhasil diekspor ke file ${filename}`,
        3000
      );
    } catch (error) {
      console.error("Export error:", error);
      showToast(
        "error",
        "Export Gagal!",
        "Terjadi kesalahan saat mengekspor data.",
        3000
      );
    } finally {
      setExporting(false);
    }
  };

  const handleAddHibah = () => {
    showToast(
      "info",
      "Add Hibah",
      "Fitur tambah hibah sedang dalam pengembangan."
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "")
      .trim();
  };

  // Get totals for display
  const totals = getTotals();

  // Create total row - pindahkan label "Total" ke kolom no
  const totalRow = {
    id: "total",
    no: "Total", // Label "Total" di kolom no
    asal: "", // Kosongkan kolom asal
    tujuan: "",
    noBeritaAcara: "",
    tglBeritaAcara: "",
    totalBarang: totals.totalBarang,
    totalHarga: totals.totalHarga,
    lampiran: "",
    statusVerifikasi: "",
    semester: "",
    tahun: "",
    catatanVerifikasi: "",
  };

  const dataWithTotal = [...daftarHibahData, totalRow];

  // Filter dropdown component
  const FilterDropdown = ({ label, value, options, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        disabled={loading}
      >
        <option value="">-- Pilih {label} --</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Table columns
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return (
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
          paginationModel.page * paginationModel.pageSize
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
    { field: "tahun", headerName: "Tahun", width: 100 },
    { field: "semester", headerName: "Semester", width: 120 },
    { field: "asal", headerName: "Asal", width: 250 },
    { field: "tujuan", headerName: "Tujuan", width: 200 },
    { field: "noBeritaAcara", headerName: "No. Berita Acara", width: 180 },
    { field: "tglBeritaAcara", headerName: "Tgl. Berita Acara", width: 150 },
    {
      field: "totalBarang",
      headerName: "Total Barang",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <span
          className={params.row.id === "total" ? "font-bold" : "font-semibold"}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "totalHarga",
      headerName: "Total Harga",
      type: "number",
      width: 150,
      renderCell: (params) => (
        <span
          className={params.row.id === "total" ? "font-bold" : "font-semibold"}
        >
          {formatCurrency(params.value)}
        </span>
      ),
    },
    { field: "lampiran", headerName: "Lampiran", width: 280 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 250,
    },
  ];

  // Filter visible columns based on columnVisibility state
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.field] !== false
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
            disabled={exporting || loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} className={exporting ? "animate-pulse" : ""} />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Hibah</h1>
            <div className="flex gap-3">
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
                onClick={handleAddHibah}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Hibah
              </button>
            </div>
          </div>

          {/* Filters */}
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

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={paginationModel.pageSize}
                onChange={(e) =>
                  setPaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0,
                  }))
                }
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {[5, 10, 25, 50, 75, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
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
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <DataTable
              rows={dataWithTotal}
              columns={visibleColumns}
              rowCount={rowCount}
              loading={loading}
              paginationMode="server"
              pageSizeOptions={[5, 10, 25, 50, 75, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              height={500}
              emptyRowsMessage="Tidak ada data tersedia"
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              getRowClassName={(params) =>
                params.id === "total"
                  ? "bg-gray-100 font-bold border-t-2 border-gray-300"
                  : ""
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarHibahPage;
