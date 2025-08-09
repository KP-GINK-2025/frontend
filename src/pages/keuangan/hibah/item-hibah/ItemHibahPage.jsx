import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { ColumnManager } from "@/components/table";
import { Search, Download, RefreshCw, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { handleExport } from "../../../../handlers/exportHandler";

const ItemHibahPage = () => {
  // Data states
  const [itemHibahData, setItemHibahData] = useState([]);
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
    kd_kondisi: "",
  });

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Column visibility state - sesuai screenshot checklist
  const [columnVisibility, setColumnVisibility] = useState({
    action: true, // Action - checked
    no: true, // No - checked
    mutasi_id: false, // mutasi_id - unchecked
    id: false, // id - unchecked
    asal: true, // Asal - checked
    tujuan: true, // Tujuan - checked
    semester: false, // Semester - unchecked
    noBeritaAcara: true, // No. Berita Acara - checked
    tglBeritaAcara: true, // Tgl. Berita Acara - checked
    kd_barang: true, // kd_barang - checked
    nm_barang: true, // nm_barang - checked
    merk: true, // merk - checked
    tahun_barang: false, // tahun_barang - unchecked
    ukuran: false, // ukuran - unchecked
    bahan: false, // bahan - unchecked
    harga_satuan: false, // harga_satuan - unchecked
    jumlah_barang: true, // jumlah_barang - checked
    nilai_total: true, // nilai_total - checked
    nm_ruang: false, // nm_ruang - unchecked
    kd_kondisi: false, // kd_kondisi - unchecked
    keterangan: false, // keterangan - unchecked
    lampiran: false, // lampiran - unchecked
    catatanVerifikasi: false, // Catatan Verifikasi - unchecked
  });

  // Static filter options
  const filterOptions = {
    asal: ["Kementerian A", "Swasta XYZ", "Yayasan ABC"],
    semester: ["1", "2"],
    statusVerifikasi: ["Menunggu", "Diverifikasi", "Ditolak"],
    kd_kondisi: ["Baik", "Rusak Ringan", "Rusak Berat"],
  };

  // Mock data - disesuaikan dengan field yang baru
  const mockData = [
    {
      id: 1,
      mutasi_id: "MUT001",
      asal: "Kementerian A",
      tujuan: "Dinas Pendidikan",
      noBeritaAcara: "BA/Hibah/001/2024",
      tglBeritaAcara: "2024-01-15",
      kd_barang: "B001",
      nm_barang: "Laptop",
      merk: "Lenovo",
      tahun_barang: "2023",
      ukuran: "14 inch",
      bahan: "Plastik",
      harga_satuan: 7000000,
      jumlah_barang: 5,
      nilai_total: 35000000,
      nm_ruang: "Ruang IT",
      semester: "1",
      statusVerifikasi: "Diverifikasi",
      kd_kondisi: "Baik",
      keterangan: "Kondisi baik, siap pakai",
      lampiran: "Doc_Hibah_001.pdf",
      catatanVerifikasi: "Dokumen lengkap dan valid",
    },
    {
      id: 2,
      mutasi_id: "MUT002",
      asal: "Swasta XYZ",
      tujuan: "Dinas Kesehatan",
      noBeritaAcara: "BA/Hibah/002/2024",
      tglBeritaAcara: "2024-02-20",
      kd_barang: "M002",
      nm_barang: "Meja Kantor",
      merk: "Chitose",
      tahun_barang: "2022",
      ukuran: "120x60 cm",
      bahan: "Kayu",
      harga_satuan: 1000000,
      jumlah_barang: 10,
      nilai_total: 10000000,
      nm_ruang: "Ruang Administrasi",
      semester: "1",
      statusVerifikasi: "Menunggu",
      kd_kondisi: "Rusak Ringan",
      keterangan: "Ada sedikit goresan",
      lampiran: "Doc_Hibah_002.pdf",
      catatanVerifikasi: "Menunggu verifikasi admin",
    },
    {
      id: 3,
      mutasi_id: "MUT003",
      asal: "Yayasan ABC",
      tujuan: "Dinas Sosial",
      noBeritaAcara: "BA/Hibah/003/2024",
      tglBeritaAcara: "2024-03-10",
      kd_barang: "P003",
      nm_barang: "Printer",
      merk: "Epson",
      tahun_barang: "2023",
      ukuran: "A4",
      bahan: "Plastik",
      harga_satuan: 2500000,
      jumlah_barang: 2,
      nilai_total: 5000000,
      nm_ruang: "Ruang Cetak",
      semester: "2",
      statusVerifikasi: "Ditolak",
      kd_kondisi: "Baik",
      keterangan: "Kondisi sangat baik",
      lampiran: "Doc_Hibah_003.pdf",
      catatanVerifikasi: "Dokumen tidak sesuai ketentuan",
    },
    {
      id: 4,
      mutasi_id: "MUT004",
      asal: "Kementerian A",
      tujuan: "Dinas Perhubungan",
      noBeritaAcara: "BA/Hibah/004/2024",
      tglBeritaAcara: "2024-03-25",
      kd_barang: "K004",
      nm_barang: "Kursi Kantor",
      merk: "Ergotec",
      tahun_barang: "2023",
      ukuran: "Standar",
      bahan: "Fabric",
      harga_satuan: 500000,
      jumlah_barang: 15,
      nilai_total: 7500000,
      nm_ruang: "Ruang Kerja",
      semester: "2",
      statusVerifikasi: "Diverifikasi",
      kd_kondisi: "Baik",
      keterangan: "Kondisi prima",
      lampiran: "Doc_Hibah_004.pdf",
      catatanVerifikasi: "Proses verifikasi selesai",
    },
    {
      id: 5,
      mutasi_id: "MUT005",
      asal: "Swasta XYZ",
      tujuan: "Dinas Lingkungan",
      noBeritaAcara: "BA/Hibah/005/2024",
      tglBeritaAcara: "2024-04-10",
      kd_barang: "A005",
      nm_barang: "AC Split",
      merk: "Daikin",
      tahun_barang: "2023",
      ukuran: "1 PK",
      bahan: "Metal",
      harga_satuan: 4000000,
      jumlah_barang: 3,
      nilai_total: 12000000,
      nm_ruang: "Ruang Rapat",
      semester: "2",
      statusVerifikasi: "Menunggu",
      kd_kondisi: "Rusak Ringan",
      keterangan: "Perlu service ringan",
      lampiran: "Doc_Hibah_005.pdf",
      catatanVerifikasi: "Dalam antrian verifikasi",
    },
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [filters]);

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
        const matchesFilters = Object.entries(filters).every(
          ([key, value]) =>
            !value || String(item[key])?.toLowerCase() === value.toLowerCase()
        );

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

  // Calculate totals for current filtered data
  const getTotals = useCallback(() => {
    const filteredData = applyFilters(mockData);
    return {
      totalBarang: filteredData.reduce(
        (sum, item) => sum + item.jumlah_barang,
        0
      ),
      totalNilai: filteredData.reduce((sum, item) => sum + item.nilai_total, 0),
      totalItems: filteredData.length,
    };
  }, [applyFilters]);

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { paginatedData, totalCount } = getDisplayData();
        setItemHibahData(paginatedData);
        setRowCount(totalCount);
      } catch (error) {
        console.error("Error fetching data:", error);
        setItemHibahData([]);
        setRowCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getDisplayData]);

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

  // Event handlers
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefresh = async () => {
    setSearchTerm("");
    setFilters({
      asal: "",
      semester: "",
      statusVerifikasi: "",
      kd_kondisi: "",
    });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

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
  };

  const handleEditClick = (id) => {
    const item = itemHibahData.find((item) => item.id === id);
    if (item) {
      console.log("Edit item:", item);
      Swal.fire({
        title: "Info",
        text: "Fitur edit akan diimplementasikan!",
        icon: "info",
      });
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data item hibah yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 text-white px-4 py-2 mr-1 rounded-md hover:bg-red-700 cursor-pointer",
        cancelButton:
          "bg-gray-200 text-gray-700 px-4 py-2 ml-1 rounded-md hover:bg-gray-300 cursor-pointer",
      },
    });

    if (!result.isConfirmed) return;

    try {
      console.log("Deleted item with ID:", id);
      Swal.fire({
        title: "Berhasil Delete",
        text: "Data item hibah berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  // Export handler
  const handleExportClick = async () => {
    const fetchAllDataForExport = async () => {
      try {
        return applyFilters(mockData);
      } catch (error) {
        console.error("Failed to fetch export data:", error);
        throw error;
      }
    };

    const exportColumns = [
      { field: "no", headerName: "No" },
      { field: "asal", headerName: "Asal" },
      { field: "tujuan", headerName: "Tujuan" },
      { field: "noBeritaAcara", headerName: "No. Berita Acara" },
      { field: "tglBeritaAcara", headerName: "Tgl. Berita Acara" },
      { field: "kodeBarang", headerName: "Kode Barang" },
      { field: "namaBarang", headerName: "Nama Barang" },
      { field: "merk", headerName: "Merk" },
      { field: "jumlahBarang", headerName: "Jumlah Barang" },
      { field: "nilaiTotal", headerName: "Nilai Total" },
      { field: "semester", headerName: "Semester" },
      { field: "statusVerifikasi", headerName: "Status Verifikasi" },
      { field: "kd_kondisi", headerName: "Kondisi" },
    ];

    const exportConfig = {
      fetchDataFunction: fetchAllDataForExport,
      columns: exportColumns,
      filename: "data-item-hibah",
      sheetName: "Data Item Hibah",
      setExporting: setExporting,
    };

    await handleExport(exportConfig);
  };

  // Get totals for display
  const totals = getTotals();

  // Create total row for table - label "Total" pindah ke kolom no
  const totalRow = {
    id: "total",
    no: "Total", // Pindah label "Total" ke kolom no
    asal: "", // Kosongkan kolom asal
    jumlah_barang: totals.totalBarang,
    nilai_total: totals.totalNilai,
  };

  const dataWithTotal = [...itemHibahData, totalRow];

  // Filter component
  const FilterSelect = ({ label, name, value, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => handleFilterChange(name, e.target.value)}
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

  // Table columns - sesuaikan dengan field baru dan urutkan sesuai screenshot
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEditClick(params.row.id)}
              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => handleDeleteClick(params.row.id)}
              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 size={14} />
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
        const index = itemHibahData.findIndex(
          (row) => row.id === params.row.id
        );
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    {
      field: "mutasi_id",
      headerName: "Mutasi ID",
      width: 120,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "id",
      headerName: "ID",
      width: 80,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "asal",
      headerName: "Asal",
      width: 150,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "tujuan",
      headerName: "Tujuan",
      width: 150,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "semester",
      headerName: "Semester",
      width: 100,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "noBeritaAcara",
      headerName: "No. Berita Acara",
      width: 180,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "tglBeritaAcara",
      headerName: "Tgl. Berita Acara",
      width: 150,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "kd_barang",
      headerName: "kd_barang",
      width: 120,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "nm_barang",
      headerName: "nm_barang",
      width: 180,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "merk",
      headerName: "merk",
      width: 120,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "tahun_barang",
      headerName: "tahun_barang",
      width: 130,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "ukuran",
      headerName: "ukuran",
      width: 120,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "bahan",
      headerName: "bahan",
      width: 120,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "harga_satuan",
      headerName: "harga_satuan",
      width: 150,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return (
          <span className="font-semibold">{formatCurrency(params.value)}</span>
        );
      },
    },
    {
      field: "jumlah_barang",
      headerName: "jumlah_barang",
      width: 140,
      type: "number",
      renderCell: (params) => (
        <span className="font-semibold">{params.value}</span>
      ),
    },
    {
      field: "nilai_total",
      headerName: "nilai_total",
      width: 150,
      renderCell: (params) => (
        <span className="font-semibold">{formatCurrency(params.value)}</span>
      ),
    },
    {
      field: "nm_ruang",
      headerName: "nm_ruang",
      width: 120,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "kd_kondisi",
      headerName: "kd_kondisi",
      width: 120,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "keterangan",
      headerName: "keterangan",
      width: 200,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "lampiran",
      headerName: "lampiran",
      width: 200,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
    },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 250,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return params.value;
      },
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
            onClick={handleExportClick}
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
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Item Barang Hibah
            </h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <FilterSelect
              label="Asal"
              name="asal"
              value={filters.asal}
              options={filterOptions.asal}
            />
            <FilterSelect
              label="Semester"
              name="semester"
              value={filters.semester}
              options={filterOptions.semester}
            />
            <FilterSelect
              label="Status Verifikasi"
              name="statusVerifikasi"
              value={filters.statusVerifikasi}
              options={filterOptions.statusVerifikasi}
            />
            <FilterSelect
              label="Kondisi"
              name="kd_kondisi"
              value={filters.kd_kondisi}
              options={filterOptions.kd_kondisi}
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
              filterMode="server"
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

export default ItemHibahPage;
