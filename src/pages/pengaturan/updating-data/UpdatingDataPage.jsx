import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdatingDataPage = () => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    if (debouncedSearchTerm || selectedUsername || startDate || endDate) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, selectedUsername, startDate, endDate]);

  // Fetch audit data (mock data)
  const fetchData = useCallback(() => {
    setLoading(true);
    setRefreshing(true);

    // Mock data
    const dummyUsers = [
      {
        id: 1,
        username: "superadmin",
        namaLengkap: "Super Admin",
        email: "superadmin@tanggamus.go.id",
        terakhirLogin: "2025-07-09T10:00:00",
        blok: "A",
        grup: "Admin",
        upb: "UPB 1",
        objek: "User",
        actionType: "Update",
        actionTitle: "Ubah Password",
        ip: "192.168.1.1",
      },
      {
        id: 2,
        username: "dispora",
        namaLengkap: "Dinas Pemuda dan Olahraga",
        email: "dispora@tanggamus.go.id",
        terakhirLogin: "2025-07-06T08:45:00",
        blok: "B",
        grup: "Keuangan",
        upb: "UPB 2",
        objek: "Laporan",
        actionType: "Delete",
        actionTitle: "Hapus Data Anggaran",
        ip: "192.168.1.12",
      },
      {
        id: 3,
        username: "bkpsdm",
        namaLengkap: "Badan Kepegawaian",
        email: "bkpsdm@tanggamus.go.id",
        terakhirLogin: "2025-07-01T13:20:00",
        blok: "A",
        grup: "Viewer",
        upb: "UPB 3",
        objek: "Dokumen",
        actionType: "Read",
        actionTitle: "Lihat Arsip",
        ip: "192.168.1.22",
      },
      {
        id: 4,
        username: "keuangan",
        namaLengkap: "Bagian Keuangan",
        email: "keuangan@tanggamus.go.id",
        terakhirLogin: "2025-07-08T14:30:00",
        blok: "B",
        grup: "Keuangan",
        upb: "UPB 4",
        objek: "Anggaran",
        actionType: "Create",
        actionTitle: "Tambah Data Anggaran",
        ip: "192.168.1.33",
      },
      {
        id: 5,
        username: "sekretaris",
        namaLengkap: "Sekretaris Daerah",
        email: "sekretaris@tanggamus.go.id",
        terakhirLogin: "2025-07-07T16:15:00",
        blok: "A",
        grup: "Sekretaris",
        upb: "UPB 5",
        objek: "Surat",
        actionType: "Update",
        actionTitle: "Edit Surat Keputusan",
        ip: "192.168.1.44",
      },
      {
        id: 6,
        username: "staff01",
        namaLengkap: "Staff Umum",
        email: "staff01@tanggamus.go.id",
        terakhirLogin: "2025-07-05T09:20:00",
        blok: "B",
        grup: "Staff",
        upb: "UPB 6",
        objek: "File",
        actionType: "Delete",
        actionTitle: "Hapus File Lama",
        ip: "192.168.1.55",
      },
    ];

    setTimeout(() => {
      // Apply filters
      let filteredData = dummyUsers;

      // Search filter
      if (debouncedSearchTerm) {
        filteredData = filteredData.filter(
          (item) =>
            item.username
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            item.namaLengkap
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            item.ip.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            item.objek
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            item.actionTitle
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
        );
      }

      // Username filter
      if (selectedUsername) {
        filteredData = filteredData.filter(
          (item) => item.username === selectedUsername
        );
      }

      // Date range filter
      if (startDate || endDate) {
        filteredData = filteredData.filter((item) => {
          const loginDate = new Date(item.terakhirLogin);
          const matchesStartDate = startDate ? loginDate >= startDate : true;
          const matchesEndDate = endDate ? loginDate <= endDate : true;
          return matchesStartDate && matchesEndDate;
        });
      }

      // Pagination
      const startIndex = paginationModel.page * paginationModel.pageSize;
      const endIndex = startIndex + paginationModel.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setAuditData(paginatedData);
      setTotalRows(filteredData.length);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedUsername,
    startDate,
    endDate,
    refreshTrigger,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Event handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setSearchTerm(""); // Reset pencarian
      setSelectedUsername(""); // Reset filter username
      setStartDate(null); // Reset start date
      setEndDate(null); // Reset end date
      setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset halaman
      setRefreshTrigger((prev) => prev + 1);

      // Simulasi delay agar animasi terlihat
      await new Promise((resolve) => setTimeout(resolve, 800));

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data aktivitas berhasil dimuat ulang.",
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

  const handleExport = () => {
    console.log("Exporting audit data...");
    alert("Fitur export belum diimplementasikan.");
  };

  const handleEditClick = (id) => {
    console.log("Edit audit with ID:", id);
    alert(`Edit audit dengan ID: ${id} belum diimplementasikan.`);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data aktivitas yang dihapus tidak dapat dikembalikan!",
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
      // Mock delete - in real implementation, call API here
      console.log("Deleting audit with ID:", id);

      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data aktivitas berhasil dihapus.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Refresh data after delete
      handleRefresh();
    } catch (error) {
      console.error("Gagal menghapus audit:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  // Get unique usernames for dropdown
  const uniqueUsernames = [
    ...new Set([
      "superadmin",
      "dispora",
      "bkpsdm",
      "keuangan",
      "sekretaris",
      "staff01",
    ]),
  ];

  // Helper function to get action type badge color
  const getActionTypeBadge = (actionType) => {
    const colors = {
      Create: "bg-green-100 text-green-800",
      Read: "bg-blue-100 text-blue-800",
      Update: "bg-yellow-100 text-yellow-800",
      Delete: "bg-red-100 text-red-800",
    };
    return colors[actionType] || "bg-gray-100 text-gray-800";
  };

  // Table columns configuration
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
      field: "terakhirLogin",
      headerName: "Waktu Aktivitas",
      width: 230,
      renderCell: (params) => (
        <span className="text-sm">
          {new Date(params.row.terakhirLogin).toLocaleString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      field: "ip",
      headerName: "IP Address",
      width: 200,
      renderCell: (params) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
          {params.row.ip}
        </span>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => (
        <span className="font-medium text-gray-900">{params.row.username}</span>
      ),
    },
    {
      field: "objek",
      headerName: "Objek",
      width: 200,
    },
    {
      field: "actionType",
      headerName: "Action Type",
      width: 200,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getActionTypeBadge(
            params.row.actionType
          )}`}
        >
          {params.row.actionType}
        </span>
      ),
    },
    {
      field: "actionTitle",
      headerName: "Action Title",
      flex: 1,
      minWidth: 200,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Audittrail
            </h1>
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

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4">
            {/* Left: Date and Username Filters */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Date Range Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Periode:
                </label>
                <div className="flex items-center gap-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Tanggal awal"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">s/d</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Tanggal akhir"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Username Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Username</label>
                <select
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer"
                >
                  <option value="">-- Semua Username --</option>
                  {uniqueUsernames.map((username) => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Show</span>
                <select
                  value={paginationModel.pageSize}
                  onChange={(e) =>
                    setPaginationModel({
                      page: 0,
                      pageSize: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer"
                >
                  {[5, 10, 25, 50, 75, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-gray-600 text-sm">entries</span>
              </div>
            </div>

            {/* Right: Search */}
            <div className="relative w-full lg:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            rows={auditData}
            columns={columns}
            rowCount={totalRows}
            loading={loading}
            paginationMode="server"
            filterMode="server"
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatingDataPage;
