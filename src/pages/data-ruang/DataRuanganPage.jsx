import React, { useState, useEffect, useCallback } from "react";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import AddRuanganModal from "./AddRuanganModal";
import api from "../../api/axios";
import Swal from "sweetalert2";
import ColumnManager from "../../components/table/ColumnManager";
import {
  handleExport as universalHandleExport,
  commonFormatters,
  createExportConfig,
} from "../../handlers/exportHandler";

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
const TOAST_OPTIONS = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
};
const SWAL_DELETE_OPTIONS = {
  title: "Apakah Anda yakin?",
  text: "Data ruangan yang dihapus tidak dapat dikembalikan!",
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
};

// Utility Components (moved out for better readability)
const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  valueKey = "",
  labelKey = "",
  codeKey = "",
  disabled = false,
  loading = false,
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    disabled={disabled || loading}
  >
    <option value="">{loading ? "Memuat..." : label}</option>
    {options.map((option) => (
      <option
        key={option[valueKey] || option}
        value={option[valueKey] || option}
      >
        {codeKey && option[codeKey] ? `${option[codeKey]} - ` : ""}
        {option[labelKey] || option}
      </option>
    ))}
  </select>
);

const DataRuanganPage = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [ruanganData, setRuanganData] = useState([]);
  const [editingRuangan, setEditingRuangan] = useState(null);

  // State for UI and data fetching status
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // State for dropdown data and loading
  const [tahunList, setTahunList] = useState([]);
  const [bidangList, setBidangList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [subUnitList, setSubUnitList] = useState([]);
  const [upbList, setUpbList] = useState([]);

  // Memoized data for cascading dropdowns
  const [allKlasifikasi, setAllKlasifikasi] = useState({
    bidangs: [],
    units: [],
    subUnits: [],
    upbs: [],
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState({
    bidang: false,
    unit: false,
    subUnit: false,
    upb: false,
  });

  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_ENTRIES_PER_PAGE,
  });

  // Data fetching functions
  const fetchAllInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ruanganRes, bidangRes, unitRes, subUnitRes, upbRes] =
        await Promise.all([
          api.get("/data-ruangan"),
          api.get("/klasifikasi-instansi/bidang?per_page=1000"),
          api.get("/klasifikasi-instansi/unit?per_page=1000"),
          api.get("/klasifikasi-instansi/subunit?per_page=1000"),
          api.get("/klasifikasi-instansi/upb?per_page=1000"),
        ]);

      const ruanganDataRaw = ruanganRes.data.data || [];
      const { data: bidangData } = bidangRes.data;
      const { data: unitData } = unitRes.data;
      const { data: subUnitData } = subUnitRes.data;
      const { data: upbData } = upbRes.data;

      setAllKlasifikasi({
        bidangs: bidangData,
        units: unitData,
        subUnits: subUnitData,
        upbs: upbData,
      });

      const createMap = (data) =>
        data.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
      const bidangMap = createMap(bidangData);
      const unitMap = createMap(unitData);
      const subUnitMap = createMap(subUnitData);
      const upbMap = createMap(upbData);

      const enrichedRuanganData = ruanganDataRaw.map((ruangan) => {
        const upb = ruangan.upb || upbMap[ruangan.upb?.id];
        const subUnit = upb?.sub_unit || subUnitMap[upb?.sub_unit_id];
        const unit = subUnit?.unit || unitMap[subUnit?.unit_id];
        const bidang = unit?.bidang || bidangMap[unit?.bidang_id];

        return { ...ruangan, bidang, unit, subUnit, upb };
      });

      setRuanganData(enrichedRuanganData);

      const uniqueYears = [
        ...new Set(ruanganDataRaw.map((item) => item.tahun).filter(Boolean)),
      ].sort((a, b) => a - b);
      setTahunList(uniqueYears);

      const sortedBidang = bidangData.sort(
        (a, b) => parseInt(a.kode_bidang) - parseInt(b.kode_bidang)
      );
      setBidangList(sortedBidang);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cascading dropdown logic
  const fetchDropdownData = useCallback(
    (type, parentId) => {
      setLoadingDropdowns((prev) => ({ ...prev, [type]: true }));
      let filteredData = [];
      const parentKey =
        type === "unit" ? "bidang" : type === "subUnit" ? "unit" : "sub_unit";
      const dataSet = allKlasifikasi[`${type}s`];

      if (parentId) {
        filteredData = dataSet.filter(
          (item) => item[parentKey]?.id === parseInt(parentId)
        );
      }

      const sortedData = filteredData.sort(
        (a, b) => parseInt(a[`kode_${type}`]) - parseInt(b[`kode_${type}`])
      );

      if (type === "unit") setUnitList(sortedData);
      if (type === "subUnit") setSubUnitList(sortedData);
      if (type === "upb") setUpbList(sortedData);

      setLoadingDropdowns((prev) => ({ ...prev, [type]: false }));
    },
    [allKlasifikasi]
  );

  // Effects
  useEffect(() => {
    fetchAllInitialData();
  }, [fetchAllInitialData]);

  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
      page: 0,
    }));
  }, [entriesPerPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Handle cascading dropdowns
  useEffect(() => {
    if (filters.bidang) {
      fetchDropdownData("unit", filters.bidang);
      setFilters((prev) => ({ ...prev, unit: "", subUnit: "", upb: "" }));
    } else {
      setUnitList([]);
      setSubUnitList([]);
      setUpbList([]);
    }
  }, [filters.bidang, fetchDropdownData]);

  useEffect(() => {
    if (filters.unit) {
      fetchDropdownData("subUnit", filters.unit);
      setFilters((prev) => ({ ...prev, subUnit: "", upb: "" }));
    } else {
      setSubUnitList([]);
      setUpbList([]);
    }
  }, [filters.unit, fetchDropdownData]);

  useEffect(() => {
    if (filters.subUnit) {
      fetchDropdownData("upb", filters.subUnit);
      setFilters((prev) => ({ ...prev, upb: "" }));
    } else {
      setUpbList([]);
    }
  }, [filters.subUnit, fetchDropdownData]);

  // Data filtering logic
  const filteredData = ruanganData.filter((item) => {
    const debouncedSearchLower = debouncedSearchTerm.toLowerCase();
    const matchesSearch = [
      item.nama_ruangan,
      item.kode_ruangan,
      item.nama_penanggung_jawab,
      item.nip_penanggung_jawab,
      item.bidang?.nama_bidang,
      item.unit?.nama_unit,
      item.subUnit?.nama_sub_unit,
      item.upb?.nama_upb,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(debouncedSearchLower);

    const filterChecks = [
      !filters.tahun || String(item.tahun) === String(filters.tahun),
      !filters.bidang || String(item.bidang?.id) === String(filters.bidang),
      !filters.unit || String(item.unit?.id) === String(filters.unit),
      !filters.subUnit || String(item.subUnit?.id) === String(filters.subUnit),
      !filters.upb || String(item.upb?.id) === String(filters.upb),
    ];

    return matchesSearch && filterChecks.every(Boolean);
  });

  // Event handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleExport = async () => {
    try {
      const exportConfig = createExportConfig({
        data: filteredData,
        columns: exportColumns,
        filename: "Data_Ruangan",
        sheetName: "Ruangan",
        setExporting: setIsExporting,
      });
      await universalHandleExport(exportConfig);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diexport.",
        ...TOAST_OPTIONS,
      });
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal mengexport data.",
        ...TOAST_OPTIONS,
      });
    }
  };

  const handleRefresh = async () => {
    setSearchTerm("");
    setFilters(INITIAL_FILTERS);
    try {
      await fetchAllInitialData();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil dimuat ulang.",
        ...TOAST_OPTIONS,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal memuat ulang data.",
        ...TOAST_OPTIONS,
      });
    }
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
      setRuanganData((prevData) =>
        prevData.map((item) =>
          item.id === ruanganToSave.id ? ruanganToSave : item
        )
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data ruangan berhasil diperbarui",
        ...TOAST_OPTIONS,
      });
    } else {
      setRuanganData((prevData) => [
        ...prevData,
        { id: Date.now(), ...ruanganToSave },
      ]);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data ruangan baru berhasil ditambahkan",
        ...TOAST_OPTIONS,
      });
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
    Swal.fire(SWAL_DELETE_OPTIONS).then((result) => {
      if (result.isConfirmed) {
        setRuanganData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data ruangan berhasil dihapus.",
          ...TOAST_OPTIONS,
        });
      }
    });
  };

  // Columns for DataTable
  const allTableColumns = [
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
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) +
        1 +
        dataTablePaginationModel.page * dataTablePaginationModel.pageSize,
    },
    { field: "tahun", headerName: "Tahun", width: 100 },
    {
      field: "provinsi",
      headerName: "Provinsi",
      width: 150,
      renderCell: (params) =>
        params.row.bidang?.kabupaten_kota?.provinsi?.nama_provinsi || "-",
    },
    {
      field: "kabupaten_kota",
      headerName: "Kabupaten/Kota",
      width: 200,
      renderCell: (params) =>
        params.row.bidang?.kabupaten_kota?.nama_kabupaten_kota || "-",
    },
    {
      field: "bidang",
      headerName: "Bidang",
      width: 200,
      renderCell: (params) =>
        `${params.row.bidang?.kode_bidang || ""} - ${
          params.row.bidang?.nama_bidang || ""
        }`.trim() || "-",
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 200,
      renderCell: (params) =>
        `${params.row.unit?.kode_unit || ""} - ${
          params.row.unit?.nama_unit || ""
        }`.trim() || "-",
    },
    {
      field: "subUnit",
      headerName: "Sub Unit",
      width: 200,
      renderCell: (params) =>
        `${params.row.subUnit?.kode_sub_unit || ""} - ${
          params.row.subUnit?.nama_sub_unit || ""
        }`.trim() || "-",
    },
    {
      field: "upb",
      headerName: "UPB",
      width: 200,
      renderCell: (params) =>
        `${params.row.upb?.kode_upb || ""} - ${
          params.row.upb?.nama_upb || ""
        }`.trim() || "-",
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
      field: "bidang1",
      headerName: "Bidang 1",
      width: 150,
      valueGetter: (params) => params.row.bidang1?.nama || "-",
    },
    {
      field: "unit1",
      headerName: "Unit 1",
      width: 150,
      valueGetter: (params) => params.row.unit1?.nama || "-",
    },
    {
      field: "subunit1",
      headerName: "Sub Unit 1",
      width: 150,
      valueGetter: (params) => params.row.subunit1?.nama || "-",
    },
    {
      field: "upb1",
      headerName: "UPB 1",
      width: 150,
      valueGetter: (params) => params.row.upb1?.nama || "-",
    },
    {
      field: "akun",
      headerName: "Akun",
      width: 150,
      valueGetter: (params) => params.row.akun?.nama || "-",
    },
    {
      field: "kelompok",
      headerName: "Kelompok",
      width: 150,
      valueGetter: (params) => params.row.kelompok?.nama || "-",
    },
    {
      field: "jenis",
      headerName: "Jenis",
      width: 150,
      valueGetter: (params) => params.row.jenis?.nama || "-",
    },
    {
      field: "objek",
      headerName: "Objek",
      width: 150,
      valueGetter: (params) => params.row.objek?.nama || "-",
    },
    {
      field: "rincian_objek",
      headerName: "Rincian Objek",
      width: 150,
      valueGetter: (params) => params.row.rincian_objek?.nama || "-",
    },
    {
      field: "sub_rincian",
      headerName: "Sub Rincian",
      width: 150,
      valueGetter: (params) => params.row.sub_rincian?.nama || "-",
    },
    {
      field: "sub_sub_rincian",
      headerName: "Sub Sub Rincian",
      width: 150,
      valueGetter: (params) => params.row.sub_sub_rincian?.nama || "-",
    },
    { field: "no_register", headerName: "No Register", width: 150 },
    { field: "pemilik", headerName: "Pemilik", width: 120 },
  ];

  const exportColumns = [
    {
      field: "no",
      headerName: "No",
      formatter: (val, item, index) => index + 1,
    },
    { field: "tahun", headerName: "Tahun" },
    {
      field: "provinsi",
      headerName: "Provinsi",
      formatter: (val, item) =>
        item.bidang?.kabupaten_kota?.provinsi?.nama_provinsi || "N/A",
    },
    {
      field: "kabupaten_kota",
      headerName: "Kabupaten/Kota",
      formatter: (val, item) =>
        item.bidang?.kabupaten_kota?.nama_kabupaten_kota || "N/A",
    },
    {
      field: "bidang",
      headerName: "Bidang",
      formatter: (val, item) =>
        commonFormatters.combined(["bidang.kode_bidang", "bidang.nama_bidang"])(
          val,
          item
        ),
    },
    {
      field: "unit",
      headerName: "Unit",
      formatter: (val, item) =>
        commonFormatters.combined(["unit.kode_unit", "unit.nama_unit"])(
          val,
          item
        ),
    },
    {
      field: "subUnit",
      headerName: "Sub Unit",
      formatter: (val, item) =>
        commonFormatters.combined([
          "subUnit.kode_sub_unit",
          "subUnit.nama_sub_unit",
        ])(val, item),
    },
    {
      field: "upb",
      headerName: "UPB",
      formatter: (val, item) =>
        commonFormatters.combined(["upb.kode_upb", "upb.nama_upb"])(val, item),
    },
    { field: "kode_ruangan", headerName: "Kode Ruangan" },
    { field: "nama_ruangan", headerName: "Nama Ruangan" },
    { field: "nama_penanggung_jawab", headerName: "Nama Penanggung Jawab" },
    { field: "nip_penanggung_jawab", headerName: "NIP Penanggung Jawab" },
    {
      field: "jabatan_penanggung_jawab",
      headerName: "Jabatan Penanggung Jawab",
    },
    {
      field: "bidang1",
      headerName: "Bidang 1",
      formatter: (val, item) => item.bidang1?.nama || "N/A",
    },
    {
      field: "unit1",
      headerName: "Unit 1",
      formatter: (val, item) => item.unit1?.nama || "N/A",
    },
    {
      field: "subunit1",
      headerName: "Sub Unit 1",
      formatter: (val, item) => item.subunit1?.nama || "N/A",
    },
    {
      field: "upb1",
      headerName: "UPB 1",
      formatter: (val, item) => item.upb1?.nama || "N/A",
    },
    {
      field: "akun",
      headerName: "Akun",
      formatter: (val, item) => item.akun?.nama || "N/A",
    },
    {
      field: "kelompok",
      headerName: "Kelompok",
      formatter: (val, item) => item.kelompok?.nama || "N/A",
    },
    {
      field: "jenis",
      headerName: "Jenis",
      formatter: (val, item) => item.jenis?.nama || "N/A",
    },
    {
      field: "objek",
      headerName: "Objek",
      formatter: (val, item) => item.objek?.nama || "N/A",
    },
    {
      field: "rincian_objek",
      headerName: "Rincian Objek",
      formatter: (val, item) => item.rincian_objek?.nama || "N/A",
    },
    {
      field: "sub_rincian",
      headerName: "Sub Rincian",
      formatter: (val, item) => item.sub_rincian?.nama || "N/A",
    },
    {
      field: "sub_sub_rincian",
      headerName: "Sub Sub Rincian",
      formatter: (val, item) => item.sub_sub_rincian?.nama || "N/A",
    },
    { field: "no_register", headerName: "No Register" },
    { field: "pemilik", headerName: "Pemilik" },
  ];

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const defaultVisibleFields = [
      "no",
      "tahun",
      "bidang",
      "unit",
      "subUnit",
      "upb",
      "nama_ruangan",
      "action",
    ];
    return allTableColumns.reduce((acc, col) => {
      acc[col.field] = defaultVisibleFields.includes(col.field);
      return acc;
    }, {});
  });

  const visibleColumns = allTableColumns.filter(
    (col) => columnVisibility[col.field] !== false
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            disabled={isExporting || loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isExporting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} />
                Export
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <FilterSelect
              label="-- Tahun --"
              value={filters.tahun}
              onChange={(value) => handleFilterChange("tahun", value)}
              options={tahunList}
            />
            <FilterSelect
              label="-- Bidang --"
              value={filters.bidang}
              onChange={(value) => handleFilterChange("bidang", value)}
              options={bidangList}
              valueKey="id"
              labelKey="nama_bidang"
              codeKey="kode_bidang"
            />
            <FilterSelect
              label="-- Unit --"
              value={filters.unit}
              onChange={(value) => handleFilterChange("unit", value)}
              options={unitList}
              valueKey="id"
              labelKey="nama_unit"
              codeKey="kode_unit"
              loading={loadingDropdowns.unit}
              disabled={!filters.bidang}
            />
            <FilterSelect
              label="-- Sub Unit --"
              value={filters.subUnit}
              onChange={(value) => handleFilterChange("subUnit", value)}
              options={subUnitList}
              valueKey="id"
              labelKey="nama_sub_unit"
              codeKey="kode_sub_unit"
              loading={loadingDropdowns.subUnit}
              disabled={!filters.unit}
            />
            <FilterSelect
              label="-- UPB --"
              value={filters.upb}
              onChange={(value) => handleFilterChange("upb", value)}
              options={upbList}
              valueKey="id"
              labelKey="nama_upb"
              codeKey="kode_upb"
              loading={loadingDropdowns.upb}
              disabled={!filters.subUnit}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
              <ColumnManager
                columns={allTableColumns.filter(
                  (col) => col.field !== "action" && col.field !== "no"
                )}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1">
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
          </div>

          {debouncedSearchTerm && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
              <p className="text-sm">
                Showing results for: <strong>"{debouncedSearchTerm}"</strong>
                {filteredData.length > 0 && (
                  <span>
                    {" "}
                    ({filteredData.length} result
                    {filteredData.length !== 1 ? "s" : ""} found)
                  </span>
                )}
              </p>
            </div>
          )}

          {error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">⚠️ Error</div>
              <div className="text-gray-600">{error}</div>
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
              />
            </div>
          )}
        </div>
      </div>

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
