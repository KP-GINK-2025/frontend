import React, { useState, useEffect, useCallback } from "react";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import DataTable from "../../components/DataTable";
import AddRuanganModal from "./AddRuanganModal";
import api from "../../api/axios";
import Swal from "sweetalert2";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];
const DEFAULT_ENTRIES_PER_PAGE = 10;

const INITIAL_FILTERS = {
  tahun: "",
  bidang: "",
  unit: "",
  subUnit: "",
  upb: "",
};

const INITIAL_DROPDOWN_DATA = {
  tahun: [],
  bidang: [],
  unit: [],
  subUnit: [],
  upb: [],
};

// Utility Components
const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  valueKey = "",
  labelKey = "",
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value="">{label}</option>
    {options.map((option) => (
      <option
        key={option[valueKey] || option}
        value={option[labelKey] || option}
      >
        {option[labelKey] || option}
      </option>
    ))}
  </select>
);

const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <p className="mt-2 text-gray-500">Loading data...</p>
  </div>
);

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex gap-2 items-center">
    <button
      onClick={onEdit}
      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors cursor-pointer"
    >
      Edit
    </button>
    <button
      onClick={onDelete}
      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors cursor-pointer"
    >
      Delete
    </button>
  </div>
);

const DataRuanganPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [dropdownData, setDropdownData] = useState(INITIAL_DROPDOWN_DATA);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [ruanganData, setRuanganData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRuangan, setEditingRuangan] = useState(null);
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_ENTRIES_PER_PAGE,
  });

  // API Functions
  const fetchDropdownData = useCallback(async () => {
    try {
      const [bidangRes, unitRes, subUnitRes, upbRes] = await Promise.all([
        api.get("/klasifikasi-instansi/bidang?per_page=1000"),
        api.get("/klasifikasi-instansi/unit?per_page=1000"),
        api.get("/klasifikasi-instansi/subunit?per_page=1000"),
        api.get("/klasifikasi-instansi/upb?per_page=1000"),
      ]);

      setDropdownData((prev) => ({
        ...prev,
        bidang: bidangRes.data.data || [],
        unit: unitRes.data.data || [],
        subUnit: subUnitRes.data.data || [],
        upb: upbRes.data.data || [],
      }));
    } catch (error) {
      console.error("Gagal mengambil data dropdown:", error);
    }
  }, []);

  const fetchRuanganData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/data-ruangan");
      const data = response.data.data || [];
      setRuanganData(data);

      // Extract unique years from data
      const uniqueYears = [
        ...new Set(data.map((item) => item.tahun).filter(Boolean)),
      ].sort();
      setDropdownData((prev) => ({ ...prev, tahun: uniqueYears }));
    } catch (error) {
      console.error("Gagal mengambil data ruangan:", error);
      setRuanganData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchDropdownData(), fetchRuanganData()]);
    };
    loadInitialData();
  }, [fetchDropdownData, fetchRuanganData]);

  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  // Data filtering
  const filteredData = ruanganData.filter((item) => {
    const matchesSearch = item.nama_ruangan
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const filterChecks = [
      !filters.tahun || item.tahun === filters.tahun,
      !filters.bidang || item.bidang?.nama === filters.bidang,
      !filters.unit || item.unit?.nama === filters.unit,
      !filters.subUnit || item.subUnit?.nama === filters.subUnit,
      !filters.upb || item.upb?.nama === filters.upb,
    ];

    return matchesSearch && filterChecks.every(Boolean);
  });

  // Event handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleExport = () => {
    console.log("Exporting Data Ruangan...");
    // TODO: Implement actual export functionality
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setFilters(INITIAL_FILTERS);
    fetchRuanganData();
  };

  const handleOpenAddModal = () => {
    setEditingRuangan(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingRuangan(null);
  };

  const handleSaveRuangan = (ruanganToSave) => {
    if (ruanganToSave.id) {
      // Edit mode
      setRuanganData((prevData) =>
        prevData.map((item) =>
          item.id === ruanganToSave.id ? ruanganToSave : item
        )
      );
      console.log("Update Ruangan:", ruanganToSave);
    } else {
      // Add new mode
      const newRuangan = { id: Date.now(), ...ruanganToSave };
      setRuanganData((prevData) => [...prevData, newRuangan]);
      console.log("Menyimpan Ruangan baru:", newRuangan);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const ruanganToEdit = ruanganData.find((item) => item.id === id);
    if (ruanganToEdit) {
      setEditingRuangan(ruanganToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ruangan yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setRuanganData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data ruangan berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Table columns configuration
  const columns = [
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
    { field: "tahun", headerName: "Tahun", width: 100 },
    { field: "provinsi", headerName: "Provinsi", width: 120 },
    { field: "kabupaten_kota", headerName: "Kabupaten/Kota", width: 150 },
    {
      field: "bidang",
      headerName: "Bidang",
      width: 120,
      renderCell: (params) => params.row.bidang?.nama || "-",
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 120,
      renderCell: (params) => params.row.unit?.nama || "-",
    },
    {
      field: "subUnit",
      headerName: "Sub Unit",
      width: 120,
      renderCell: (params) => params.row.subUnit?.nama || "-",
    },
    {
      field: "upb",
      headerName: "UPB",
      width: 120,
      renderCell: (params) => params.row.upb?.nama || "-",
    },
    { field: "kode_ruangan", headerName: "Kode Ruangan", width: 150 },
    { field: "nama_ruangan", headerName: "Nama Ruangan", width: 200 },
    {
      field: "nama_penanggung_jawab",
      headerName: "Nama Penanggung Jawab",
      width: 200,
    },
    {
      field: "nip_penanggung_jawab",
      headerName: "NIP Penanggung Jawab",
      width: 180,
    },
    {
      field: "jabatan_penanggung_jawab",
      headerName: "Jabatan Penanggung Jawab",
      width: 180,
    },
    {
      field: "akun",
      headerName: "Akun",
      width: 150,
      renderCell: (params) => params.row.akun?.nama || "-",
    },
    {
      field: "kelompok",
      headerName: "Kelompok",
      width: 150,
      renderCell: (params) => params.row.kelompok?.nama || "-",
    },
    {
      field: "jenis",
      headerName: "Jenis",
      width: 150,
      renderCell: (params) => params.row.jenis?.nama || "-",
    },
    {
      field: "objek",
      headerName: "Objek",
      width: 150,
      renderCell: (params) => params.row.objek?.nama || "-",
    },
    {
      field: "rincian_objek",
      headerName: "Rincian Objek",
      width: 150,
      renderCell: (params) => params.row.rincian_objek?.nama || "-",
    },
    {
      field: "sub_rincian",
      headerName: "Sub Rincian",
      width: 150,
      renderCell: (params) => params.row.sub_rincian?.nama || "-",
    },
    {
      field: "sub_sub_rincian",
      headerName: "Sub Sub Rincian",
      width: 150,
      renderCell: (params) => params.row.sub_sub_rincian?.nama || "-",
    },
    { field: "no_register", headerName: "No Register", width: 150 },
    { field: "pemilik", headerName: "Pemilik", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <ActionButtons
          onEdit={() => handleEditClick(params.row.id)}
          onDelete={() => handleDeleteClick(params.row.id)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Ruangan</h1>
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
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Add Ruangan
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <FilterSelect
              label="-- Tahun --"
              value={filters.tahun}
              onChange={(value) => handleFilterChange("tahun", value)}
              options={dropdownData.tahun}
            />
            <FilterSelect
              label="-- Bidang --"
              value={filters.bidang}
              onChange={(value) => handleFilterChange("bidang", value)}
              options={dropdownData.bidang}
              valueKey="id"
              labelKey="nama_bidang"
            />
            <FilterSelect
              label="-- Unit --"
              value={filters.unit}
              onChange={(value) => handleFilterChange("unit", value)}
              options={dropdownData.unit}
              valueKey="id"
              labelKey="nama_unit"
            />
            <FilterSelect
              label="-- Sub Unit --"
              value={filters.subUnit}
              onChange={(value) => handleFilterChange("subUnit", value)}
              options={dropdownData.subUnit}
              valueKey="id"
              labelKey="nama_sub_unit"
            />
            <FilterSelect
              label="-- UPB --"
              value={filters.upb}
              onChange={(value) => handleFilterChange("upb", value)}
              options={dropdownData.upb}
              valueKey="id"
              labelKey="nama_upb"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {ENTRIES_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Table */}
          {loading ? (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="Tidak ada data tersedia"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
              loading={true} // <-- ini yang penting
            />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">⚠️ Error</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <DataTable
                rows={filteredData}
                columns={columns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={false} // <-- ini yang penting
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddRuanganModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveRuangan}
        initialData={editingRuangan}
      />
    </div>
  );
};

export default DataRuanganPage;
