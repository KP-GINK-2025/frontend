import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Download, Search, Navigation } from "lucide-react";
import { ColumnManager } from "@/components/table";
import Swal from "sweetalert2";

const PostingMutasiPage = () => {
  // Data states
  const [postingMutasiData, setPostingMutasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKualifikasiPerolehan, setSelectedKualifikasiPerolehan] =
    useState("");
  const [selectedAsal, setSelectedAsal] = useState("");
  const [selectedTujuan, setSelectedTujuan] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Pagination state
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Column visibility state - sesuai dengan checklist yang diberikan
  const [columnVisibility, setColumnVisibility] = useState({
    action: true, // Action - checked
    no: true, // No - checked
    id: false, // ID - unchecked
    kualifikasiPerolehan: true, // Kualifikasi Perolehan - checked
    asal: true, // Asal - checked
    tujuan: true, // Tujuan - checked
    tahun: false, // Tahun - unchecked (tidak ada di data tapi ada di checklist)
    semester: false, // Semester - unchecked
    noBeritaAcara: true, // No. Berita Acara - checked
    tglBeritaAcara: true, // Tgl. Berita Acara - checked
    totalBarang: true, // Total Barang - checked
    totalHarga: true, // Total Harga - checked
    lampiran: true, // Lampiran - checked
    statusVerifikasi: true, // Status Verifikasi - checked
    catatanVerifikasi: false, // Catatan Verifikasi - unchecked
    posting: false, // Posting - unchecked
  });

  // Dropdown data - menggunakan static data karena tidak berubah
  const kualifikasiPerolehanOptions = [
    "Mutasi SKPD Lain(Aset Lama)",
    "Hibah Bertambah",
  ];

  const asalOptions = [
    "Dinas Pariwisata, Kebudayaan, Kepemudaan dan Olahraga",
    "Pusat",
  ];

  const tujuanOptions = [
    "Dinas Pendidikan",
    "Dinas Perhubungan",
    "Bandar Lampung",
  ];

  const semesterOptions = ["Ganjil", "Genap"];

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

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const dummyData = [
        {
          id: 1,
          kualifikasiPerolehan: "Mutasi SKPD Lain(Aset Lama)",
          asal: "Dinas Pariwisata, Kebudayaan, Kepemudaan dan Olahraga",
          tujuan: "Dinas Pendidikan",
          noBeritaAcara: "027/11222/22/2025",
          tglBeritaAcara: "03/03/2025",
          totalBarang: 12,
          totalHarga: 41869429.0,
          lampiran:
            "BA mutasi barang dispareklraf kpd disdikbud 2025-compressed.pdf",
          statusVerifikasi: "Valid",
          semester: "Ganjil",
          tahun: "2025",
          catatanVerifikasi: "Semua dokumen lengkap",
          posting: "Posted",
        },
        {
          id: 2,
          kualifikasiPerolehan: "Hibah Bertambah",
          asal: "Pusat",
          tujuan: "Dinas Perhubungan",
          noBeritaAcara: "011/2025",
          tglBeritaAcara: "01/07/2025",
          totalBarang: 6,
          totalHarga: 547862800.0,
          lampiran: "11_2025.pdf",
          statusVerifikasi: "Valid",
          semester: "Genap",
          tahun: "2025",
          catatanVerifikasi: "Verifikasi selesai",
          posting: "Posted",
        },
      ];

      setPostingMutasiData(dummyData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
      showToast("error", "Error!", "Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update pagination when entries per page changes
  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  // Filter data
  const filteredData = postingMutasiData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters =
      (!selectedKualifikasiPerolehan ||
        item.kualifikasiPerolehan === selectedKualifikasiPerolehan) &&
      (!selectedAsal || item.asal === selectedAsal) &&
      (!selectedTujuan || item.tujuan === selectedTujuan) &&
      (!selectedSemester || item.semester === selectedSemester);

    return matchesSearch && matchesFilters;
  });

  // Calculate totals
  const totalBarang = filteredData.reduce(
    (sum, item) => sum + item.totalBarang,
    0
  );
  const totalHarga = filteredData.reduce(
    (sum, item) => sum + item.totalHarga,
    0
  );

  const totalRow = {
    id: "total",
    no: "Total", // Label "Total" di kolom no
    kualifikasiPerolehan: "", // Kosongkan kolom kualifikasi
    totalBarang,
    totalHarga,
    asal: "",
    tujuan: "",
    noBeritaAcara: "",
    tglBeritaAcara: "",
    lampiran: "",
    statusVerifikasi: "",
    semester: "",
    tahun: "",
    catatanVerifikasi: "",
    posting: "",
  };

  const dataWithTotal = [...filteredData, totalRow];

  // Event handlers
  const handleRefresh = async () => {
    // Reset all filters
    setSearchTerm("");
    setSelectedKualifikasiPerolehan("");
    setSelectedAsal("");
    setSelectedTujuan("");
    setSelectedSemester("");
    setPaginationModel({ page: 0, pageSize: entriesPerPage });

    await fetchData();
    showToast("success", "Berhasil!", "Data berhasil dimuat ulang.");
  };

  const handleExport = () => {
    console.log("Exporting Posting Mutasi...");
    showToast("info", "Export", "Fitur export sedang dalam pengembangan.");
  };

  const handleLihatClick = (id) => {
    const itemToView = postingMutasiData.find((item) => item.id === id);
    if (!itemToView) return;

    Swal.fire({
      title: "Detail Posting Mutasi",
      html: `
        <div class="text-left">
          <p><strong>Kualifikasi Perolehan:</strong> ${
            itemToView.kualifikasiPerolehan
          }</p>
          <p><strong>Asal:</strong> ${itemToView.asal}</p>
          <p><strong>Tujuan:</strong> ${itemToView.tujuan}</p>
          <p><strong>No. Berita Acara:</strong> ${itemToView.noBeritaAcara}</p>
          <p><strong>Tgl. Berita Acara:</strong> ${
            itemToView.tglBeritaAcara
          }</p>
          <p><strong>Total Barang:</strong> ${itemToView.totalBarang}</p>
          <p><strong>Total Harga:</strong> ${new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(itemToView.totalHarga)}</p>
          <p><strong>Status Verifikasi:</strong> ${
            itemToView.statusVerifikasi
          }</p>
          <p><strong>Semester:</strong> ${itemToView.semester}</p>
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

  const handleEntriesChange = (newSize) => {
    setEntriesPerPage(newSize);
  };

  const resetPaginationOnFilter = () => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // Table columns definition
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return (
          <button
            onClick={() => handleLihatClick(params.row.id)}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
            title="Lihat"
          >
            <Navigation size={16} />
          </button>
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
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "kualifikasiPerolehan",
      headerName: "Kualifikasi Perolehan",
      width: 220,
    },
    { field: "asal", headerName: "Asal", width: 250 },
    { field: "tujuan", headerName: "Tujuan", width: 200 },
    { field: "tahun", headerName: "Tahun", width: 100 },
    { field: "semester", headerName: "Semester", width: 120 },
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
      renderCell: (params) => {
        const formattedPrice = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value);

        return (
          <span
            className={
              params.row.id === "total" ? "font-bold" : "font-semibold"
            }
          >
            {formattedPrice}
          </span>
        );
      },
    },
    { field: "lampiran", headerName: "Lampiran", width: 280 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 200,
    },
    { field: "posting", headerName: "Posting", width: 100 },
  ];

  // Filter visible columns based on columnVisibility state
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.field] !== false
  );

  // Render filter select
  const renderSelect = (
    value,
    onChange,
    options,
    placeholder,
    disabled = false
  ) => (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        resetPaginationOnFilter();
      }}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={disabled || loading}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
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
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Posting Mutasi</h1>

          {/* Filters and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
              {renderSelect(
                selectedKualifikasiPerolehan,
                setSelectedKualifikasiPerolehan,
                kualifikasiPerolehanOptions,
                "-- Kualifikasi Perolehan --"
              )}
              {renderSelect(
                selectedAsal,
                setSelectedAsal,
                asalOptions,
                "-- Asal --"
              )}
              {renderSelect(
                selectedTujuan,
                setSelectedTujuan,
                tujuanOptions,
                "-- Tujuan --"
              )}
              {renderSelect(
                selectedSemester,
                setSelectedSemester,
                semesterOptions,
                "-- Semester --"
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => handleEntriesChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
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
                rows={dataWithTotal}
                columns={visibleColumns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={loading}
                getRowClassName={(params) =>
                  params.id === "total" ? "bg-gray-100 font-bold" : ""
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostingMutasiPage;
