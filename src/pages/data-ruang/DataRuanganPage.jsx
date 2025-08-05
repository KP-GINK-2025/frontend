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

// Utility Components
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

  // State for dropdown data and loading
  const [tahunList, setTahunList] = useState([]);
  const [bidangList, setBidangList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [subUnitList, setSubUnitList] = useState([]);
  const [upbList, setUpbList] = useState([]);

  // State untuk menyimpan semua data klasifikasi dari API
  const [allBidangs, setAllBidangs] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [allSubUnits, setAllSubUnits] = useState([]);
  const [allUpbs, setAllUpbs] = useState([]);

  const [loadingBidang, setLoadingBidang] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingSubUnits, setLoadingSubUnits] = useState(false);
  const [loadingUpbs, setLoadingUpbs] = useState(false);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [ruanganData, setRuanganData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRuangan, setEditingRuangan] = useState(null);
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_ENTRIES_PER_PAGE,
  });
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fungsi untuk mengambil units berdasarkan bidang
  const fetchUnits = useCallback(
    (bidangId) => {
      setLoadingUnits(true);
      try {
        const filteredUnits = allUnits.filter(
          (unit) => unit.bidang?.id === parseInt(bidangId)
        );
        const sortedUnits = filteredUnits.sort(
          (a, b) => parseInt(a.kode_unit) - parseInt(b.kode_unit)
        );
        setUnitList(sortedUnits);
      } catch (error) {
        console.error("Error filtering units:", error);
        setUnitList([]);
      } finally {
        setLoadingUnits(false);
      }
    },
    [allUnits]
  );

  // Fungsi untuk mengambil subunits berdasarkan unit
  const fetchSubUnits = useCallback(
    (unitId) => {
      setLoadingSubUnits(true);
      try {
        const filteredSubUnits = allSubUnits.filter(
          (subUnit) => subUnit.unit?.id === parseInt(unitId)
        );
        const sortedSubUnits = filteredSubUnits.sort(
          (a, b) => parseInt(a.kode_sub_unit) - parseInt(b.kode_sub_unit)
        );
        setSubUnitList(sortedSubUnits);
      } catch (error) {
        console.error("Error filtering sub units:", error);
        setSubUnitList([]);
      } finally {
        setLoadingSubUnits(false);
      }
    },
    [allSubUnits]
  );

  // Fungsi untuk mengambil UPBs berdasarkan subunit
  const fetchUpbs = useCallback(
    (subUnitId) => {
      setLoadingUpbs(true);
      try {
        const filteredUpbs = allUpbs.filter(
          (upb) => upb.sub_unit?.id === parseInt(subUnitId)
        );
        const sortedUpbs = filteredUpbs.sort(
          (a, b) => parseInt(a.kode_upb) - parseInt(b.kode_upb)
        );
        setUpbList(sortedUpbs);
      } catch (error) {
        console.error("Error filtering UPBs:", error);
        setUpbList([]);
      } finally {
        setLoadingUpbs(false);
      }
    },
    [allUpbs]
  );

  // Fungsi inti untuk mengambil data
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
      const bidangData = bidangRes.data.data || [];
      const unitData = unitRes.data.data || [];
      const subUnitData = subUnitRes.data.data || [];
      const upbData = upbRes.data.data || [];

      // Set all data untuk referensi
      setAllBidangs(bidangData);
      setAllUnits(unitData);
      setAllSubUnits(subUnitData);
      setAllUpbs(upbData);

      // Create maps untuk enrichment
      const createMap = (data) =>
        data.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

      const bidangMap = createMap(bidangData);
      const unitMap = createMap(unitData);
      const subUnitMap = createMap(subUnitData);
      const upbMap = createMap(upbData);

      // Enrich ruangan data
      const enrichedRuanganData = ruanganDataRaw.map((ruangan) => {
        const upbId = ruangan.upb?.id || ruangan.upb_1?.id;
        const enrichedUpb = upbMap[upbId];

        const enrichedSubUnit =
          enrichedUpb?.sub_unit || subUnitMap[enrichedUpb?.sub_unit_id];
        const enrichedUnit =
          enrichedSubUnit?.unit || unitMap[enrichedSubUnit?.unit_id];
        const enrichedBidang =
          enrichedUnit?.bidang || bidangMap[enrichedUnit?.bidang_id];

        return {
          ...ruangan,
          bidang: enrichedBidang || null,
          unit: enrichedUnit || null,
          subUnit: enrichedSubUnit || null,
          upb: enrichedUpb || null,
        };
      });

      setRuanganData(enrichedRuanganData);

      // Set tahun list
      const uniqueYears = [
        ...new Set(ruanganDataRaw.map((item) => item.tahun).filter(Boolean)),
      ].sort((a, b) => a - b);
      setTahunList(uniqueYears);

      // Set bidang list (sorted)
      const sortedBidang = bidangData.sort(
        (a, b) => parseInt(a.kode_bidang) - parseInt(b.kode_bidang)
      );
      setBidangList(sortedBidang);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setError("Gagal mengambil data dari server.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Handle cascading dropdowns dengan cleanup
  useEffect(() => {
    if (filters.bidang) {
      fetchUnits(filters.bidang);
      // Reset dependent filters
      setFilters((prev) => ({ ...prev, unit: "", subUnit: "", upb: "" }));
      setSubUnitList([]);
      setUpbList([]);
    } else {
      setUnitList([]);
      setSubUnitList([]);
      setUpbList([]);
    }
  }, [filters.bidang, fetchUnits]);

  useEffect(() => {
    if (filters.unit) {
      fetchSubUnits(filters.unit);
      // Reset dependent filters
      setFilters((prev) => ({ ...prev, subUnit: "", upb: "" }));
      setUpbList([]);
    } else {
      setSubUnitList([]);
      setUpbList([]);
    }
  }, [filters.unit, fetchSubUnits]);

  useEffect(() => {
    if (filters.subUnit) {
      fetchUpbs(filters.subUnit);
      // Reset dependent filter
      setFilters((prev) => ({ ...prev, upb: "" }));
    } else {
      setUpbList([]);
    }
  }, [filters.subUnit, fetchUpbs]);

  // Debounce effect untuk search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Kolom untuk DataTable
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
      renderCell: (params) => {
        return (
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1 +
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize
        );
      },
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
        `${params.row.unit?.kode_unit} - ${params.row.unit?.nama_unit}` || "-",
    },
    {
      field: "subUnit",
      headerName: "Sub Unit",
      width: 200,
      renderCell: (params) =>
        `${params.row.subUnit?.kode_sub_unit} - ${params.row.subUnit?.nama_sub_unit}` ||
        "-",
    },
    {
      field: "upb",
      headerName: "UPB",
      width: 200,
      renderCell: (params) =>
        `${params.row.upb?.kode_upb} - ${params.row.upb?.nama_upb}` || "-",
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
      renderCell: (params) => params.row.bidang1?.nama || "-",
    },
    {
      field: "unit1",
      headerName: "Unit 1",
      width: 150,
      renderCell: (params) => params.row.unit1?.nama || "-",
    },
    {
      field: "subunit1",
      headerName: "Sub Unit 1",
      width: 150,
      renderCell: (params) => params.row.subunit1?.nama || "-",
    },
    {
      field: "upb1",
      headerName: "UPB 1",
      width: 150,
      renderCell: (params) => params.row.upb1?.nama || "-",
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
  ];

  // Kolom untuk Export
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

  // State untuk mengelola visibilitas kolom
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

    const initialVisibility = {};
    allTableColumns.forEach((col) => {
      initialVisibility[col.field] = defaultVisibleFields.includes(col.field);
    });
    return initialVisibility;
  });

  // Filter kolom yang akan ditampilkan di DataTable
  const visibleColumns = allTableColumns.filter(
    (col) => columnVisibility[col.field] !== false
  );

  // Data filtering
  const filteredData = ruanganData.filter((item) => {
    const debouncedSearchLower = debouncedSearchTerm.toLowerCase();

    // Logika pencarian yang lebih komprehensif
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

    // Jika tidak ada filter dan tidak ada search term, tampilkan semua data
    if (!debouncedSearchTerm && Object.values(filters).every((val) => !val)) {
      return true;
    }

    return matchesSearch && filterChecks.every(Boolean);
  });

  // Event handlers
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleExport = async () => {
    try {
      const exportConfig = createExportConfig({
        data: ruanganData,
        searchTerm: debouncedSearchTerm,
        filters: filters,
        columns: exportColumns,
        filename: "Data_Ruangan",
        sheetName: "Ruangan",
        setExporting: setIsExporting,
        customFilters: {
          bidang: (item, value) => String(item.bidang?.id) === String(value),
          unit: (item, value) => String(item.unit?.id) === String(value),
          subUnit: (item, value) => String(item.subUnit?.id) === String(value),
          upb: (item, value) => String(item.upb?.id) === String(value),
        },
      });
      await universalHandleExport(exportConfig);
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal mengexport data.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
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
        text: "Gagal memuat ulang data.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
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
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      const newRuangan = { id: Date.now(), ...ruanganToSave };
      setRuanganData((prevData) => [...prevData, newRuangan]);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data ruangan baru berhasil ditambahkan",
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
        setRuanganData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data ruangan berhasil dihapus.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
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
              loading={loadingBidang}
            />
            <FilterSelect
              label="-- Unit --"
              value={filters.unit}
              onChange={(value) => handleFilterChange("unit", value)}
              options={unitList}
              valueKey="id"
              labelKey="nama_unit"
              codeKey="kode_unit"
              loading={loadingUnits}
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
              loading={loadingSubUnits}
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
              loading={loadingUpbs}
              disabled={!filters.subUnit}
            />
          </div>

          {/* Controls */}
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

          {/* Search Info */}
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
