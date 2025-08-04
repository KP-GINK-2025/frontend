import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import Swal from "sweetalert2";

const PenggunaPage = () => {
  const [penggunaData, setPenggunaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedBlok, setSelectedBlok] = useState("");
  const [selectedGrup, setSelectedGrup] = useState("");

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
    if (debouncedSearchTerm || selectedBlok || selectedGrup) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, selectedBlok, selectedGrup]);

  // Fetch pengguna data (mock data)
  const fetchData = useCallback(() => {
    setLoading(true);
    setRefreshing(true);

    // Mock data
    const dummyUsers = [
      {
        id: 1,
        username: "admin01",
        namaLengkap: "Administrator Satu",
        email: "admin01@tanggamus.go.id",
        terakhirLogin: "2025-07-09 10:00",
        blok: "A",
        grup: "Admin",
        upb: "UPB 1",
      },
      {
        id: 2,
        username: "keuangan02",
        namaLengkap: "Keuangan Dua",
        email: "keuangan02@tanggamus.go.id",
        terakhirLogin: "2025-07-08 16:30",
        blok: "B",
        grup: "Keuangan",
        upb: "UPB 2",
      },
      {
        id: 3,
        username: "sekretaris03",
        namaLengkap: "Sekretaris Tiga",
        email: "sekretaris03@tanggamus.go.id",
        terakhirLogin: "2025-07-07 14:15",
        blok: "A",
        grup: "Sekretaris",
        upb: "UPB 1",
      },
      {
        id: 4,
        username: "kepala04",
        namaLengkap: "Kepala Empat",
        email: "kepala04@tanggamus.go.id",
        terakhirLogin: "2025-07-06 09:45",
        blok: "B",
        grup: "Kepala",
        upb: "UPB 3",
      },
      {
        id: 5,
        username: "staff05",
        namaLengkap: "Staff Lima",
        email: "staff05@tanggamus.go.id",
        terakhirLogin: "2025-07-05 11:20",
        blok: "A",
        grup: "Staff",
        upb: "UPB 2",
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
            item.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      // Blok filter
      if (selectedBlok) {
        filteredData = filteredData.filter(
          (item) => item.blok === selectedBlok
        );
      }

      // Grup filter
      if (selectedGrup) {
        filteredData = filteredData.filter(
          (item) => item.grup === selectedGrup
        );
      }

      // Pagination
      const startIndex = paginationModel.page * paginationModel.pageSize;
      const endIndex = startIndex + paginationModel.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setPenggunaData(paginatedData);
      setTotalRows(filteredData.length);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedBlok,
    selectedGrup,
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
      setSelectedBlok(""); // Reset filter blok
      setSelectedGrup(""); // Reset filter grup
      setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset halaman
      setRefreshTrigger((prev) => prev + 1);

      // Simulasi delay agar animasi terlihat
      await new Promise((resolve) => setTimeout(resolve, 800));

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data user berhasil dimuat ulang.",
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
    console.log("Exporting pengguna data...");
    alert("Fitur export belum diimplementasikan.");
  };

  const handleAddUser = () => {
    console.log("Add user clicked");
    alert("Fitur tambah user belum diimplementasikan.");
  };

  const handleEditClick = (id) => {
    console.log("Edit user with ID:", id);
    alert(`Edit user dengan ID: ${id} belum diimplementasikan.`);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data user yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: false,
    });

    if (!result.isConfirmed) return;

    try {
      // Mock delete - in real implementation, call API here
      console.log("Deleting user with ID:", id);

      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data user berhasil dihapus.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Refresh data after delete
      handleRefresh();
    } catch (error) {
      console.error("Gagal menghapus user:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
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
      field: "username",
      headerName: "Username",
      width: 150,
    },
    {
      field: "namaLengkap",
      headerName: "Nama Lengkap",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "terakhirLogin",
      headerName: "Terakhir Login",
      width: 160,
    },
    {
      field: "blok",
      headerName: "Blok",
      width: 80,
    },
    {
      field: "grup",
      headerName: "Grup",
      width: 120,
    },
    {
      field: "upb",
      headerName: "UPB",
      width: 100,
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
            <h1 className="text-2xl font-bold text-gray-800">Daftar User</h1>
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
                onClick={handleAddUser}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add User
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            {/* Left: Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Blok Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Blok</label>
                <select
                  value={selectedBlok}
                  onChange={(e) => setSelectedBlok(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
                >
                  <option value="">-- Semua Blok --</option>
                  <option value="A">Blok A</option>
                  <option value="B">Blok B</option>
                </select>
              </div>

              {/* Grup Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Grup</label>
                <select
                  value={selectedGrup}
                  onChange={(e) => setSelectedGrup(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
                >
                  <option value="">-- Semua Grup --</option>
                  <option value="Admin">Admin</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Sekretaris">Sekretaris</option>
                  <option value="Kepala">Kepala</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2 mt-2 md:mt-0">
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            rows={penggunaData}
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

export default PenggunaPage;
