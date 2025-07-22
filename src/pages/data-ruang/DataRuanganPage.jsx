import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddRuanganModal from "./AddRuanganModal";
import DataTable from "../../components/DataTable";
import api from "../../api/axios";

const DataRuanganPage = () => {
  // State untuk pencarian dan pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // State untuk data dropdown
  const [dropdownData, setDropdownData] = useState({
    tahun: [],
    bidang: [],
    unit: [],
    subUnit: [],
    upb: [],
  });

  // State untuk filter yang dipilih
  const [filters, setFilters] = useState({
    tahun: "",
    bidang: "",
    unit: "",
    subUnit: "",
    upb: "",
  });

  // State utama
  const [ruanganData, setRuanganData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRuangan, setEditingRuangan] = useState(null);

  // State untuk pagination DataTable
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fungsi untuk fetch data dropdown
  const fetchDropdownData = useCallback(async () => {
    try {
      const [bidangRes, unitRes, subUnitRes, upbRes] = await Promise.all([
        api.get("/klasifikasi-instansi/bidang?per_page=1000"),
        api.get("/klasifikasi-instansi/unit?per_page=1000"),
        api.get("/klasifikasi-instansi/subunit?per_page=1000"),
        api.get("/klasifikasi-instansi/upb?per_page=1000"),
      ]);

      setDropdownData({
        tahun: [], // Akan diisi dari data ruangan
        bidang: bidangRes.data.data || [],
        unit: unitRes.data.data || [],
        subUnit: subUnitRes.data.data || [],
        upb: upbRes.data.data || [],
      });
    } catch (error) {
      console.error("Gagal mengambil data dropdown:", error);
      setDropdownData({
        tahun: [],
        bidang: [],
        unit: [],
        subUnit: [],
        upb: [],
      });
    }
  }, []);

  // Fungsi untuk fetch data ruangan
  const fetchRuanganData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/data-ruangan");
      const data = response.data.data || [];
      setRuanganData(data);

      // Generate tahun data dari ruangan data
      const tahunUnik = [
        ...new Set(data.map((item) => item.tahun).filter(Boolean)),
      ].sort();
      setDropdownData((prev) => ({ ...prev, tahun: tahunUnik }));
    } catch (error) {
      console.error("Gagal mengambil data ruangan:", error);
      setRuanganData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchDropdownData(), fetchRuanganData()]);
    };
    loadInitialData();
  }, [fetchDropdownData, fetchRuanganData]);

  // Update pagination model ketika entriesPerPage berubah
  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  // Filter data berdasarkan search dan filter yang dipilih
  const filteredData = ruanganData.filter((item) => {
    const matchesSearch = item.nama_ruangan
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTahun = !filters.tahun || item.tahun === filters.tahun;
    const matchesBidang =
      !filters.bidang || item.bidang?.nama === filters.bidang;
    const matchesUnit = !filters.unit || item.unit?.nama === filters.unit;
    const matchesSubUnit =
      !filters.subUnit || item.subUnit?.nama === filters.subUnit;
    const matchesUpb = !filters.upb || item.upb?.nama === filters.upb;

    return (
      matchesSearch &&
      matchesTahun &&
      matchesBidang &&
      matchesUnit &&
      matchesSubUnit &&
      matchesUpb
    );
  });

  // Handler functions
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleExport = () => {
    console.log("Exporting Data Ruangan...");
    // TODO: Implement actual export functionality
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setFilters({
      tahun: "",
      bidang: "",
      unit: "",
      subUnit: "",
      upb: "",
    });
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
      // Mode Edit
      setRuanganData((prevData) =>
        prevData.map((item) =>
          item.id === ruanganToSave.id ? ruanganToSave : item
        )
      );
      console.log("Update Ruangan:", ruanganToSave);
    } else {
      // Mode Tambah Baru
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
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setRuanganData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Ruangan dengan ID:", id);
    }
  };

  // Kolom untuk DataTable
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = filteredData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
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
    { field: "jabatan_penanggung_jawab", headerName: "Jabatan", width: 180 },
    { field: "no_register", headerName: "No Register", width: 150 },
    { field: "pemilik", headerName: "Pemilik", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleEditClick(params.row.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(params.row.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const FilterSelect = ({
    label,
    value,
    onChange,
    options,
    valueKey,
    labelKey,
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
                disabled={loading}
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
              valueKey=""
              labelKey=""
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
                {[5, 10, 25, 50, 100].map((n) => (
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
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading data...</p>
            </div>
          ) : (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="Tidak ada data ruangan tersedia"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
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
