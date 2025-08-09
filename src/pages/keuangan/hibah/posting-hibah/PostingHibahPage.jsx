import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { ColumnManager } from "@/components/table";
import { Search, Download, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import {
  handleExport,
  commonFormatters,
  createExportConfig,
} from "../../../../handlers/exportHandler";

const PostingHibahPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [postingHibahData, setPostingHibahData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [exporting, setExporting] = useState(false);

  // State untuk Column Manager
  const [columnVisibility, setColumnVisibility] = useState({
    action: true,
    no: true,
    asal: true,
    tujuan: true,
    noBeritaAcara: true,
    tglBeritaAcara: true,
    totalBarang: true,
    totalHarga: true,
    lampiran: true,
    statusVerifikasi: true,
  });

  // State untuk Filter
  const [filters, setFilters] = useState({
    asal: "",
    semester: "",
    statusVerifikasi: "",
  });

  // State untuk Paginasi DataTable
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Reset halaman ke 0 ketika debouncedSearchTerm atau filters berubah
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, searchTerm]);

  useEffect(() => {
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [filters]);

  // Fetch data utama
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRefreshing(true);
      try {
        const params = new URLSearchParams();
        params.append("page", dataTablePaginationModel.page + 1);
        params.append("per_page", dataTablePaginationModel.pageSize);

        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });

        // TODO: Ganti dengan endpoint API yang sesuai
        // const response = await api.get(`/posting-hibah?${params.toString()}`);

        // SIMULASI DATA - Ganti dengan API call yang sebenarnya
        await new Promise((resolve) => setTimeout(resolve, 500));

        const dummyData = [
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
            tujuan: "Dinas Pertanian",
            noBeritaAcara: "BA/Hibah/004/2024",
            tglBeritaAcara: "2024-04-05",
            totalBarang: 15,
            totalHarga: 75000000,
            lampiran: "Doc_Hibah_004.pdf",
            statusVerifikasi: "Diverifikasi",
            semester: "2",
          },
          {
            id: 5,
            asal: "Swasta DEF",
            tujuan: "Dinas Lingkungan Hidup",
            noBeritaAcara: "BA/Hibah/005/2024",
            tglBeritaAcara: "2024-05-12",
            totalBarang: 5,
            totalHarga: 30000000,
            lampiran: "Doc_Hibah_005.pdf",
            statusVerifikasi: "Menunggu",
            semester: "1",
          },
        ];

        // Simulasi filtering
        let filteredData = dummyData;

        if (debouncedSearchTerm) {
          filteredData = filteredData.filter((item) =>
            Object.values(item).some((value) =>
              String(value)
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
            )
          );
        }

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            filteredData = filteredData.filter((item) =>
              String(item[key]).toLowerCase().includes(value.toLowerCase())
            );
          }
        });

        // Simulasi pagination
        const startIndex =
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize;
        const paginatedData = filteredData.slice(
          startIndex,
          startIndex + dataTablePaginationModel.pageSize
        );

        setPostingHibahData(paginatedData);
        setRowCount(filteredData.length);
      } catch (error) {
        console.error("Gagal fetch data posting hibah:", error);
        setPostingHibahData([]);
        setRowCount(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
  }, [dataTablePaginationModel, debouncedSearchTerm, refreshTrigger, filters]);

  // Format currency untuk display
  const formatCurrency = (value) => {
    if (!value || value === 0) return "0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handler untuk export
  const handleExportClick = async () => {
    const fetchAllDataForExport = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", 1);
        params.append("per_page", 10000);

        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });

        // TODO: Ganti dengan endpoint API yang sesuai
        // const response = await api.get(`/posting-hibah?${params.toString()}`);
        // return response.data.data;

        // SIMULASI - return dummy data untuk export
        return [
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
        ];
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
      { field: "totalBarang", headerName: "Total Barang" },
      { field: "totalHarga", headerName: "Total Harga" },
      { field: "lampiran", headerName: "Lampiran" },
      { field: "statusVerifikasi", headerName: "Status Verifikasi" },
      { field: "semester", headerName: "Semester" },
    ];

    const exportConfig = {
      fetchDataFunction: fetchAllDataForExport,
      columns: exportColumns,
      filename: "data-posting-hibah",
      sheetName: "Data Posting Hibah",
      setExporting: setExporting,
    };

    await handleExport(exportConfig);
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

  const handleEditClick = (id) => {
    const itemToEdit = postingHibahData.find((item) => item.id === id);
    if (itemToEdit) {
      console.log("Edit item:", itemToEdit);
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
      text: "Data posting hibah yang dihapus tidak dapat dikembalikan!",
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
      // TODO: Implement actual delete API call
      // await api.delete(`/posting-hibah/${id}`);

      console.log("Berhasil menghapus posting hibah dengan ID:", id);
      Swal.fire({
        title: "Berhasil Delete",
        text: "Data posting hibah berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleRefresh();
    } catch (error) {
      console.error("Gagal menghapus posting hibah:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handler untuk column visibility - hapus fungsi manual karena akan menggunakan ColumnManager component
  // const handleColumnVisibilityChange, handleToggleAllColumns, handleResetColumns sudah tidak diperlukan

  // Hitung total dari data yang sudah difilter
  const totalBarang = postingHibahData.reduce(
    (sum, item) => sum + item.totalBarang,
    0
  );
  const totalHarga = postingHibahData.reduce(
    (sum, item) => sum + item.totalHarga,
    0
  );

  // Buat objek baris total
  const totalRow = {
    id: "total",
    no: "Total", // Pindahkan label Total ke kolom no
    asal: "",
    totalBarang: totalBarang,
    totalHarga: totalHarga,
    // Kosongkan field lain yang tidak relevan di baris total
    action: "",
    tujuan: "",
    noBeritaAcara: "",
    tglBeritaAcara: "",
    lampiran: "",
    statusVerifikasi: "",
    semester: "",
  };

  // Gabungkan baris total ke data yang akan ditampilkan
  const dataWithTotal = [...postingHibahData, totalRow];

  // Definisi semua kolom
  const allColumns = [
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
          return <span className="font-bold">{params.value}</span>; // Tampilkan "Total" dengan bold
        }
        const index = postingHibahData.findIndex(
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
      minWidth: 150,
    },
    {
      field: "tujuan",
      headerName: "Tujuan",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "noBeritaAcara",
      headerName: "No. Berita Acara",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "tglBeritaAcara",
      headerName: "Tgl. Berita Acara",
      width: 150,
    },
    {
      field: "totalBarang",
      headerName: "Total Barang",
      width: 130,
      type: "number",
      renderCell: (params) => (
        <span className="font-semibold">{params.value}</span>
      ),
    },
    {
      field: "totalHarga",
      headerName: "Total Harga",
      width: 150,
      renderCell: (params) => (
        <span className="font-semibold">{formatCurrency(params.value)}</span>
      ),
    },
    {
      field: "lampiran",
      headerName: "Lampiran",
      width: 180,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        return (
          <a
            href="#"
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              console.log("Download file:", params.value);
              alert(`Download ${params.value}`);
            }}
          >
            {params.value}
          </a>
        );
      },
    },
    {
      field: "statusVerifikasi",
      headerName: "Status Verifikasi",
      width: 150,
      renderCell: (params) => {
        if (params.row.id === "total") return null;
        const getStatusColor = (status) => {
          switch (status.toLowerCase()) {
            case "diverifikasi":
              return "bg-green-100 text-green-800";
            case "menunggu":
              return "bg-yellow-100 text-yellow-800";
            case "ditolak":
              return "bg-red-100 text-red-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              params.value
            )}`}
          >
            {params.value}
          </span>
        );
      },
    },
  ];

  // Filter kolom berdasarkan visibility
  const visibleColumns = allColumns.filter(
    (col) => columnVisibility[col.field] !== false
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExportClick}
            disabled={exporting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} className={exporting ? "animate-pulse" : ""} />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Posting Hibah</h1>
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
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Asal */}
              <div>
                <label
                  htmlFor="asal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Asal
                </label>
                <select
                  id="asal"
                  name="asal"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                  value={filters.asal}
                  onChange={handleFilterChange}
                >
                  <option value="">-- Pilih Asal --</option>
                  <option value="Kementerian A">Kementerian A</option>
                  <option value="Kementerian B">Kementerian B</option>
                  <option value="Swasta XYZ">Swasta XYZ</option>
                  <option value="Swasta DEF">Swasta DEF</option>
                  <option value="Yayasan ABC">Yayasan ABC</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                  value={filters.semester}
                  onChange={handleFilterChange}
                >
                  <option value="">-- Pilih Semester --</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>

              {/* Status Verifikasi */}
              <div>
                <label
                  htmlFor="statusVerifikasi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status Verifikasi
                </label>
                <select
                  id="statusVerifikasi"
                  name="statusVerifikasi"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                  value={filters.statusVerifikasi}
                  onChange={handleFilterChange}
                >
                  <option value="">-- Pilih Status --</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diverifikasi">Diverifikasi</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={dataTablePaginationModel.pageSize}
                onChange={(e) => {
                  setDataTablePaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0,
                  }));
                }}
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 25, 50, 75, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
              <ColumnManager
                columns={allColumns}
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
              />
            </div>
          </div>

          <DataTable
            rows={dataWithTotal}
            columns={visibleColumns}
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
            getRowClassName={(params) =>
              params.id === "total" ? "bg-gray-100 font-bold" : ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PostingHibahPage;
