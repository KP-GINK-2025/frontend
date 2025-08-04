import React, { useState, useEffect, useCallback } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import Swal from "sweetalert2";

const GroupPage = () => {
  const [groupData, setGroupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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

  // Reset pagination when search changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm]);

  // Fetch group data (mock data)
  const fetchData = useCallback(() => {
    setLoading(true);
    setRefreshing(true);

    // Mock data
    const dummyData = [
      {
        id: 1,
        nama: "Admin",
        keterangan: "Administrator Sistem",
        aktif: true,
      },
      {
        id: 2,
        nama: "Keuangan",
        keterangan: "Akses modul keuangan",
        aktif: true,
      },
      {
        id: 3,
        nama: "Viewer",
        keterangan: "Hanya dapat melihat data",
        aktif: false,
      },
      {
        id: 4,
        nama: "Sekretaris",
        keterangan: "Akses modul sekretariat",
        aktif: true,
      },
      {
        id: 5,
        nama: "Kepala Dinas",
        keterangan: "Akses kepala dinas",
        aktif: true,
      },
      {
        id: 6,
        nama: "Staff",
        keterangan: "Akses untuk staff umum",
        aktif: false,
      },
    ];

    setTimeout(() => {
      // Apply search filter
      let filteredData = dummyData;

      if (debouncedSearchTerm) {
        filteredData = filteredData.filter(
          (item) =>
            item.nama
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            item.keterangan
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
        );
      }

      // Pagination
      const startIndex = paginationModel.page * paginationModel.pageSize;
      const endIndex = startIndex + paginationModel.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setGroupData(paginatedData);
      setTotalRows(filteredData.length);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  }, [paginationModel, debouncedSearchTerm, refreshTrigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Event handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setSearchTerm(""); // Reset pencarian
      setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset halaman
      setRefreshTrigger((prev) => prev + 1);

      // Simulasi delay agar animasi terlihat
      await new Promise((resolve) => setTimeout(resolve, 800));

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data grup berhasil dimuat ulang.",
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
    console.log("Exporting group data...");
    alert("Fitur export belum diimplementasikan.");
  };

  const handleAddGroup = () => {
    console.log("Add group clicked");
    alert("Fitur tambah group belum diimplementasikan.");
  };

  const handleEditClick = (id) => {
    console.log("Edit group with ID:", id);
    alert(`Edit group dengan ID: ${id} belum diimplementasikan.`);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data grup yang dihapus tidak dapat dikembalikan!",
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
      console.log("Deleting group with ID:", id);

      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data grup berhasil dihapus.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Refresh data after delete
      handleRefresh();
    } catch (error) {
      console.error("Gagal menghapus group:", error);
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
      field: "nama",
      headerName: "Nama",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "keterangan",
      headerName: "Keterangan",
      flex: 2,
      minWidth: 250,
    },
    {
      field: "aktif",
      headerName: "Aktif",
      width: 100,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.row.aktif
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.row.aktif ? "Ya" : "Tidak"}
        </span>
      ),
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
            <h1 className="text-2xl font-bold text-gray-800">Daftar Grup</h1>
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
                onClick={handleAddGroup}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Group
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            {/* Left: Page Size Selector */}
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
            rows={groupData}
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

export default GroupPage;
