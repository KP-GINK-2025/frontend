import React, { useState, useEffect, useMemo } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Buttons } from "@/components/ui";
import { SearchInput } from "@/components/form";
import { ColumnManager } from "@/components/table";
import { Search, Download, RefreshCw, Plus, Upload } from "lucide-react";
import AddLraModal from "./AddLraModal";
import Swal from "sweetalert2";
import api from "../../api/axios"; // Changed to relative path and 'api' variable name

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];
const DEFAULT_ENTRIES_PER_PAGE = 10;

const INITIAL_FILTERS = {
  bidang: "",
  unit: "",
  subUnit: "",
  upb: "",
  semester: "",
};

// Utility Components
const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  valueKey = "id",
  labelKey = "nama",
  disabled = false,
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border border-gray-300 hover:border-gray-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-2 focus:border-[#B53C3C] disabled:bg-gray-100 cursor-pointer"
    disabled={disabled}
  >
    <option value="">{label}</option>
    {options.map((option) => (
      <option
        key={typeof option === "string" ? option : option[valueKey]}
        value={typeof option === "string" ? option : option[labelKey]}
      >
        {typeof option === "string" ? option : option[labelKey]}
      </option>
    ))}
  </select>
);

const LraPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLra, setEditingLra] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({});

  // Dropdown data states
  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [lraData, setLraData] = useState([]);

  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_ENTRIES_PER_PAGE,
  });

  // Initialize column visibility
  useEffect(() => {
    const initialVisibility = {};
    columns.forEach((col) => {
      // Set default visibility based on screenshot
      if (col.field === "tahun" || col.field.startsWith("nilaiLraKib")) {
        initialVisibility[col.field] = false; // Initially hidden as per screenshot
      } else {
        initialVisibility[col.field] = true;
      }
    });
    setColumnVisibility(initialVisibility);
  }, []);

  // API Functions
  const fetchDropdownData = async () => {
    try {
      const [bidangRes, unitRes, subUnitRes, upbRes, semesterRes] =
        await Promise.all([
          api.get("/klasifikasi-instansi/bidang"),
          api.get("/klasifikasi-instansi/unit"),
          api.get("/klasifikasi-instansi/subunit"),
          api.get("/klasifikasi-instansi/upb"),
          api.get("/lra/semester"),
        ]);

      setBidangData(bidangRes.data?.data || bidangRes.data || []);
      setUnitData(unitRes.data?.data || unitRes.data || []);
      setSubUnitData(subUnitRes.data?.data || subUnitRes.data || []);
      setUpbData(upbRes.data?.data || upbRes.data || []);
      setSemesterData(semesterRes.data?.data || semesterRes.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      throw error;
    }
  };

  const fetchLraData = async () => {
    try {
      const response = await api.get("/lra");
      setLraData(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error fetching LRA data:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchDropdownData(), fetchLraData()]);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil data.");

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal mengambil data LRA",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  // Data filtering
  const filteredData = lraData.filter((item) => {
    const matchesSearch =
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nilaiTotalLra // Use nilaiTotalLra for consistency with AddLraModal
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const filterChecks = [
      !filters.bidang || item.bidang === filters.bidang,
      !filters.unit || item.unit === filters.unit,
      !filters.subUnit || item.subUnit === filters.subUnit,
      !filters.upb || item.upb === filters.upb,
      !filters.semester || item.semester === filters.semester,
    ];

    return matchesSearch && filterChecks.every(Boolean);
  });

  // Helper function for currency formatting
  const currencyFormatter = (value) => {
    if (value == null) {
      return "";
    }
    return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
  };

  // Table columns configuration
  const columns = useMemo(
    () => [
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
          return (
            params.api.getRowIndexRelativeToVisibleRows(params.id) +
            1 +
            dataTablePaginationModel.page * dataTablePaginationModel.pageSize
          );
        },
      },
      { field: "tahun", headerName: "Tahun", width: 100 }, // Added Tahun column
      { field: "semester", headerName: "Semester", width: 120 },
      { field: "bidang", headerName: "Bidang", width: 180 },
      { field: "unit", headerName: "Unit", width: 150 },
      { field: "subUnit", headerName: "Sub Unit", width: 150 },
      { field: "upb", headerName: "UPB", width: 120 },
      {
        field: "nilaiLraKibA",
        headerName: "Nilai LRA KIB A/Tanah",
        width: 200,
        valueFormatter: (params) => currencyFormatter(params.value),
      },
      {
        field: "nilaiLraKibB",
        headerName: "Nilai LRA KIB B/Peralatan dan Mesin",
        width: 250,
        valueFormatter: (params) => currencyFormatter(params.value),
      },
      {
        field: "nilaiLraKibC",
        headerName: "Nilai LRA KIB C/Gedung dan Bangunan",
        width: 250,
        valueFormatter: (params) => currencyFormatter(params.value),
      },
      {
        field: "nilaiLraKibD",
        headerName: "Nilai LRA KIB D/Jalan, Irigasi dan Jaringan",
        width: 280,
        valueFormatter: (params) => currencyFormatter(params.value),
      },
      {
        field: "nilaiLraKibE",
        headerName: "Nilai LRA KIB E/Aset Tetap Lainnya",
        width: 250,
        valueFormatter: (params) => currencyFormatter(params.value),
      },
      {
        field: "nilaiLraKibF",
        headerName: "Nilai LRA KIB F/Konstruksi Dalam Pengerjaan",
        width: 300,
        valueFormatter: (params) => currencyFormatter(params.value),
      },
      {
        field: "nilaiTotalLra", // Changed field name to match AddLraModal's state
        headerName: "Nilai Total",
        width: 180,
        valueFormatter: (params) => currencyFormatter(params.value),
      },
      { field: "keterangan", headerName: "Keterangan", flex: 1 },
    ],
    [dataTablePaginationModel]
  );

  // Event handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Swal.fire({
        icon: "info",
        title: "Export Data",
        text: "Fitur export sedang dalam pengembangan",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
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
      setFilters(INITIAL_FILTERS);
      await fetchData();

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

  const handleOpenAddModal = () => {
    setEditingLra(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingLra(null);
  };

  const handleSaveNewLra = (lraToSave) => {
    if (lraToSave.id) {
      // Edit Mode
      setLraData((prevData) =>
        prevData.map((item) => (item.id === lraToSave.id ? lraToSave : item))
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data LRA berhasil diperbarui",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      // Add New Mode
      setLraData((prevData) => [...prevData, { id: Date.now(), ...lraToSave }]);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data LRA baru berhasil ditambahkan",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const lraToEdit = lraData.find((item) => item.id === id);
    if (lraToEdit) {
      setEditingLra(lraToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data LRA yang dihapus tidak dapat dikembalikan!",
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
    }).then((result) => {
      if (result.isConfirmed) {
        setLraData((prevData) => prevData.filter((item) => item.id !== id));

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data LRA berhasil dihapus.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleColumnVisibilityChange = (newVisibility) => {
    setColumnVisibility(newVisibility);
  };

  // Filter visible columns
  const visibleColumns = columns.filter((col) => {
    return columnVisibility[col.field] !== false;
  });

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="p-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mt-4 mb-4">
          <Buttons variant="danger" onClick={handleExport} disabled={exporting}>
            <Upload size={16} className={exporting ? "animate-pulse" : ""} />
            {exporting ? "Mengekspor..." : "Ekspor"}
          </Buttons>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Laporan Realisasi Anggaran
            </h1>
            <div className="flex gap-3">
              <Buttons
                variant="info"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </Buttons>
              <Buttons variant="success" onClick={handleOpenAddModal}>
                <Plus size={16} />
                Add LRA
              </Buttons>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <FilterSelect
              label="-- Bidang --"
              value={filters.bidang}
              onChange={(value) => handleFilterChange("bidang", value)}
              options={bidangData}
              disabled={loading}
            />
            <FilterSelect
              label="-- Unit --"
              value={filters.unit}
              onChange={(value) => handleFilterChange("unit", value)}
              options={unitData}
              disabled={loading}
            />
            <FilterSelect
              label="-- Sub Unit --"
              value={filters.subUnit}
              onChange={(value) => handleFilterChange("subUnit", value)}
              options={subUnitData}
              disabled={loading}
            />
            <FilterSelect
              label="-- UPB --"
              value={filters.upb}
              onChange={(value) => handleFilterChange("upb", value)}
              options={upbData}
              disabled={loading}
            />
            <FilterSelect
              label="-- Semester --"
              value={filters.semester}
              onChange={(value) => handleFilterChange("semester", value)}
              options={semesterData}
              disabled={loading}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="border border-gray-300 hover:border-gray-500 rounded px-2 py-1 disabled:bg-gray-100 cursor-pointer focus:outline-none focus:border-2 focus:border-[#B53C3C]"
                  disabled={loading}
                >
                  {ENTRIES_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>

              {/* Column Manager */}
              <ColumnManager
                columns={columns}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={handleColumnVisibilityChange}
              />
            </div>

            <div className="relative w-full md:w-64">
              <SearchInput
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">⚠️ Error</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button
                onClick={fetchData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <DataTable
                rows={filteredData}
                columns={visibleColumns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={ENTRIES_PER_PAGE_OPTIONS}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={loading}
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddLraModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewLra}
        initialData={editingLra}
      />
    </div>
  );
};

export default LraPage;
