import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddNeracaAsetModal from "./AddNeracaAsetModal";
import Swal from "sweetalert2";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];
const DEFAULT_ENTRIES_PER_PAGE = 10;

const INITIAL_FILTERS = {
  tahun: "",
  semester: "",
  subRincianAset: "",
  unit: "",
  subUnit: "",
  upb: "",
  kualifikasiAset: "",
  kelompokAset: "",
  jenisAset: "",
  objekAset: "",
};

// Utility Components
const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  valueKey = "id",
  labelKey = "nama",
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

const SaldoAwalPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSaldoAwal, setEditingSaldoAwal] = useState(null);
  const [error, setError] = useState(null);

  // Dropdown data states
  const [tahunData, setTahunData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [subRincianAsetData, setSubRincianAsetData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [kualifikasiAsetData, setKualifikasiAsetData] = useState([]);
  const [kelompokAsetData, setKelompokAsetData] = useState([]);
  const [jenisAsetData, setJenisAsetData] = useState([]);
  const [objekAsetData, setObjekAsetData] = useState([]);
  const [saldoAwalData, setSaldoAwalData] = useState([]);

  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_ENTRIES_PER_PAGE,
  });

  // API Functions
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Dummy data untuk filter
      setTahunData(["2023", "2024", "2025"]);
      setSemesterData([
        { id: 1, nama: "Ganjil" },
        { id: 2, nama: "Genap" },
      ]);
      setSubRincianAsetData([
        { id: 1, nama: "Sub Rincian A" },
        { id: 2, nama: "Sub Rincian B" },
      ]);
      setUnitData([
        { id: 1, nama: "Unit A" },
        { id: 2, nama: "Unit B" },
      ]);
      setSubUnitData([
        { id: 1, nama: "Sub Unit X" },
        { id: 2, nama: "Sub Unit Y" },
      ]);
      setUpbData([
        { id: 1, nama: "UPB 1" },
        { id: 2, nama: "UPB 2" },
      ]);
      setKualifikasiAsetData([
        { id: 1, nama: "Tanah" },
        { id: 2, nama: "Bangunan" },
      ]);
      setKelompokAsetData([
        { id: 1, nama: "Gedung" },
        { id: 2, nama: "Peralatan" },
      ]);
      setJenisAsetData([
        { id: 1, nama: "Meja" },
        { id: 2, nama: "Kursi" },
      ]);
      setObjekAsetData([
        { id: 1, nama: "Komputer" },
        { id: 2, nama: "Laptop" },
      ]);

      // Dummy data untuk Saldo Awal
      setSaldoAwalData([
        {
          id: 1,
          tahun: "2024",
          semester: "Ganjil",
          subRincianAset: "Sub Rincian A",
          unit: "Unit A",
          subUnit: "Sub Unit X",
          upb: "UPB 1",
          kualifikasiAset: "Tanah",
          kelompokAset: "Gedung",
          jenisAset: "Meja",
          objekAset: "Komputer",
          jumlahBarang: 10,
          nilaiBarang: 15000000,
        },
        {
          id: 2,
          tahun: "2023",
          semester: "Genap",
          subRincianAset: "Sub Rincian B",
          unit: "Unit B",
          subUnit: "Sub Unit Y",
          upb: "UPB 2",
          kualifikasiAset: "Bangunan",
          kelompokAset: "Peralatan",
          jenisAset: "Kursi",
          objekAset: "Laptop",
          jumlahBarang: 5,
          nilaiBarang: 7500000,
        },
        {
          id: 3,
          tahun: "2024",
          semester: "Ganjil",
          subRincianAset: "Sub Rincian A",
          unit: "Unit A",
          subUnit: "Sub Unit X",
          upb: "UPB 1",
          kualifikasiAset: "Tanah",
          kelompokAset: "Gedung",
          jenisAset: "Meja",
          objekAset: "Komputer",
          jumlahBarang: 3,
          nilaiBarang: 4500000,
        },
      ]);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil data.");

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal mengambil data saldo awal",
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
  const filteredData = saldoAwalData.filter((item) => {
    const matchesSearch =
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kualifikasiAset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisAset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.objekAset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jumlahBarang?.toString().includes(searchTerm.toLowerCase()) ||
      item.nilaiBarang?.toString().includes(searchTerm.toLowerCase());

    const filterChecks = [
      !filters.tahun || item.tahun === filters.tahun,
      !filters.semester || item.semester === filters.semester,
      !filters.subRincianAset || item.subRincianAset === filters.subRincianAset,
      !filters.unit || item.unit === filters.unit,
      !filters.subUnit || item.subUnit === filters.subUnit,
      !filters.upb || item.upb === filters.upb,
      !filters.kualifikasiAset ||
        item.kualifikasiAset === filters.kualifikasiAset,
      !filters.kelompokAset || item.kelompokAset === filters.kelompokAset,
      !filters.jenisAset || item.jenisAset === filters.jenisAset,
      !filters.objekAset || item.objekAset === filters.objekAset,
    ];

    return matchesSearch && filterChecks.every(Boolean);
  });

  // Event handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleExport = () => {
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
  };

  const handleRefresh = async () => {
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
    }
  };

  const handleOpenAddModal = () => {
    setEditingSaldoAwal(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSaldoAwal(null);
  };

  const handleSaveNewSaldoAwal = (saldoAwalToSave) => {
    if (saldoAwalToSave.id) {
      // Mode Edit
      setSaldoAwalData((prevData) =>
        prevData.map((item) =>
          item.id === saldoAwalToSave.id ? saldoAwalToSave : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data saldo awal berhasil diperbarui",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      // Mode Tambah Baru
      setSaldoAwalData((prevData) => [
        ...prevData,
        { id: Date.now(), ...saldoAwalToSave },
      ]);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data saldo awal baru berhasil ditambahkan",
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
    const saldoAwalToEdit = saldoAwalData.find((item) => item.id === id);
    if (saldoAwalToEdit) {
      setEditingSaldoAwal(saldoAwalToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data saldo awal yang dihapus tidak dapat dikembalikan!",
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
        setSaldoAwalData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data saldo awal berhasil dihapus.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
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
    { field: "semester", headerName: "Semester", width: 120 },
    { field: "subRincianAset", headerName: "Sub Rincian Aset", width: 180 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "subUnit", headerName: "Sub Unit", width: 150 },
    { field: "upb", headerName: "UPB", width: 120 },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 180 },
    { field: "kelompokAset", headerName: "Kelompok Aset", width: 180 },
    { field: "jenisAset", headerName: "Jenis Aset", width: 150 },
    { field: "objekAset", headerName: "Objek Aset", width: 150 },
    {
      field: "jumlahBarang",
      headerName: "Jumlah Barang",
      type: "number",
      width: 150,
    },
    {
      field: "nilaiBarang",
      headerName: "Nilai Barang",
      type: "number",
      width: 150,
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        return `Rp ${new Intl.NumberFormat("id-ID").format(params.value)}`;
      },
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
            <h1 className="text-2xl font-bold text-gray-800">Saldo Awal</h1>
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
                Add Saldo Awal
              </button>
            </div>
          </div>

          {/* Filters - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <FilterSelect
              label="-- Tahun --"
              value={filters.tahun}
              onChange={(value) => handleFilterChange("tahun", value)}
              options={tahunData}
            />
            <FilterSelect
              label="-- Semester --"
              value={filters.semester}
              onChange={(value) => handleFilterChange("semester", value)}
              options={semesterData}
            />
            <FilterSelect
              label="-- Sub Rincian Aset --"
              value={filters.subRincianAset}
              onChange={(value) => handleFilterChange("subRincianAset", value)}
              options={subRincianAsetData}
            />
            <FilterSelect
              label="-- Unit --"
              value={filters.unit}
              onChange={(value) => handleFilterChange("unit", value)}
              options={unitData}
            />
            <FilterSelect
              label="-- Sub Unit --"
              value={filters.subUnit}
              onChange={(value) => handleFilterChange("subUnit", value)}
              options={subUnitData}
            />
          </div>

          {/* Filters - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <FilterSelect
              label="-- UPB --"
              value={filters.upb}
              onChange={(value) => handleFilterChange("upb", value)}
              options={upbData}
            />
            <FilterSelect
              label="-- Kualifikasi Aset --"
              value={filters.kualifikasiAset}
              onChange={(value) => handleFilterChange("kualifikasiAset", value)}
              options={kualifikasiAsetData}
            />
            <FilterSelect
              label="-- Kelompok Aset --"
              value={filters.kelompokAset}
              onChange={(value) => handleFilterChange("kelompokAset", value)}
              options={kelompokAsetData}
            />
            <FilterSelect
              label="-- Jenis Aset --"
              value={filters.jenisAset}
              onChange={(value) => handleFilterChange("jenisAset", value)}
              options={jenisAsetData}
            />
            <FilterSelect
              label="-- Objek Aset --"
              value={filters.objekAset}
              onChange={(value) => handleFilterChange("objekAset", value)}
              options={objekAsetData}
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
          {error ? (
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
                pageSizeOptions={ENTRIES_PER_PAGE_OPTIONS}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddNeracaAsetModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewSaldoAwal}
        initialData={editingSaldoAwal}
      />
    </div>
  );
};

export default SaldoAwalPage;
