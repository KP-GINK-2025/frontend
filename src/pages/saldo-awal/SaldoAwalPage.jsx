import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../api/axios";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddNeracaAsetModal from "./AddNeracaAsetModal";
import Swal from "sweetalert2";
import { handleExport, commonFormatters } from "../../handlers/exportHandler";
import ColumnManager from "../../components/table/ColumnManager";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25, 50, 75, 100];
const DEFAULT_ENTRIES_PER_PAGE = 10;

// Initial state for filters
const INITIAL_FILTERS = {
  tahun: "",
  semester: "",
  subRincianAset: "",
  unit: "",
  subUnit: "",
  upb: "",
  kualifikasiAset: "",
  akunAset: "",
  kelompokAset: "",
  jenisAset: "",
  objekAset: "",
};

// Utility Component for Filter Select dropdowns
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
    disabled={disabled}
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
  >
    <option value="">{label}</option>
    {options.map((option, index) => {
      const isPrimitive =
        typeof option === "string" || typeof option === "number";
      const keyValue = isPrimitive ? `${option}-${index}` : option[valueKey];
      const displayValue = isPrimitive ? option : option[labelKey];

      return (
        <option key={keyValue} value={displayValue}>
          {displayValue}
        </option>
      );
    })}
  </select>
);

const SaldoAwalPage = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Data states
  const [saldoAwalData, setSaldoAwalData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSaldoAwal, setEditingSaldoAwal] = useState(null);

  // Error state
  const [error, setError] = useState(null);

  // Dropdown data states
  const [tahunData, setTahunData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [bidangList, setBidangList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [subUnitList, setSubUnitList] = useState([]);
  const [upbList, setUpbList] = useState([]);
  const [kualifikasiAsetData, setKualifikasiAsetData] = useState([]);
  const [akunAsetData, setAkunAsetData] = useState([]);
  const [kelompokAsetData, setKelompokAsetData] = useState([]);
  const [jenisAsetData, setJenisAsetData] = useState([]);
  const [objekAsetData, setObjekAsetData] = useState([]);

  // Loading states for dropdowns
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingSubUnits, setLoadingSubUnits] = useState(false);
  const [loadingUpbs, setLoadingUpbs] = useState(false);
  const [loadingKelompokAset, setLoadingKelompokAset] = useState(false);
  const [loadingJenisAset, setLoadingJenisAset] = useState(false);
  const [loadingObjekAset, setLoadingObjekAset] = useState(false);

  // Table states
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_ENTRIES_PER_PAGE,
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Helper function to safely extract nested values from API response
  const safeGet = (obj, path, defaultValue = "-") => {
    return (
      path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
      }, obj) || defaultValue
    );
  };

  // Function to map raw API data to a format suitable for the table
  const mapSaldoAwalData = (data) => {
    return data.map((item) => ({
      id: item.id,
      tahun: item.tahun || new Date(item.created_at).getFullYear(),
      semester: item.semester || "-",
      jumlahBarang: item.Jumlah_Barang || item.jumlah_barang || 0,
      nilaiBarang: item.Nilai_Barang || item.nilai_barang || 0,
      kualifikasiAset: safeGet(item, "kualifikasi_aset.nama_kualifikasi_aset"),
      upb: safeGet(item, "upb.nama_upb"),
      subUnit: safeGet(item, "upb.sub_unit.nama_sub_unit"),
      unit: safeGet(item, "upb.sub_unit.unit.nama_unit"),
      jenisAset: safeGet(
        item,
        "sub_sub_rincian_aset.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.nama_jenis_aset"
      ),
      objekAset: safeGet(
        item,
        "sub_sub_rincian_aset.sub_rincian_aset.rincian_objek_aset.objek_aset.nama_objek_aset"
      ),
      subRincianAset: safeGet(
        item,
        "sub_sub_rincian_aset.sub_rincian_aset.nama_sub_rincian_aset"
      ),
      kelompokAset: safeGet(
        item,
        "sub_sub_rincian_aset.sub_rincian_aset.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset.nama_kelompok_aset"
      ),
    }));
  };

  // Fetch tahun data dari API
  const fetchTahunData = async () => {
    try {
      const response = await api.get("/saldo-awal", {
        params: { per_page: 10000 },
      });

      const uniqueTahun = [];
      const seenTahun = new Set();
      const rawData = response.data?.data || response.data || [];

      rawData.forEach((item) => {
        const tahun = item.tahun || new Date(item.created_at).getFullYear();
        if (!seenTahun.has(tahun)) {
          seenTahun.add(tahun);
          uniqueTahun.push(tahun);
        }
      });

      if (uniqueTahun.length === 0) {
        uniqueTahun.push(
          new Date().getFullYear() - 1,
          new Date().getFullYear(),
          new Date().getFullYear() + 1
        );
      }

      const sortedTahun = uniqueTahun.sort((a, b) => b - a);
      setTahunData(sortedTahun);
    } catch (error) {
      console.error("Gagal mendapatkan data tahun:", error);
      setTahunData([2025, 2024, 2023]);
    }
  };

  // Fetch semester data dari API
  const fetchSemesterData = async () => {
    try {
      const response = await api.get("/saldo-awal", {
        params: { per_page: 10000 },
      });

      const uniqueSemester = [];
      const seenSemester = new Set();
      const rawData = response.data?.data || response.data || [];

      rawData.forEach((item) => {
        const semester = item.semester;
        if (semester && !seenSemester.has(semester)) {
          seenSemester.add(semester);
          uniqueSemester.push(semester);
        }
      });

      if (uniqueSemester.length === 0) {
        uniqueSemester.push("I", "II");
      }

      const sortedSemester = uniqueSemester.sort((a, b) => {
        const order = { I: 1, II: 2, 1: 1, 2: 2 };
        return (order[a] || 999) - (order[b] || 999);
      });

      setSemesterData(sortedSemester);
    } catch (error) {
      console.error("Gagal mendapatkan data semester:", error);
      setSemesterData(["I", "II"]);
    }
  };

  // Fetch kualifikasi aset data
  const fetchKualifikasiAsetData = async () => {
    try {
      const response = await api.get("/saldo-awal", {
        params: { per_page: 10000 },
      });

      const uniqueKualifikasi = [];
      const seenIds = new Set();
      const rawData = response.data?.data || response.data || [];

      rawData.forEach((item) => {
        const kualifikasiAset = item.kualifikasi_aset;
        if (kualifikasiAset && !seenIds.has(kualifikasiAset.id)) {
          seenIds.add(kualifikasiAset.id);
          uniqueKualifikasi.push({
            id: kualifikasiAset.id,
            nama: kualifikasiAset.nama_kualifikasi_aset,
            kode: kualifikasiAset.kode_kualifikasi_aset || kualifikasiAset.id,
          });
        }
      });

      if (uniqueKualifikasi.length < 7) {
        try {
          const fallbackResponse = await api.get(
            "/klasifikasi-aset/kualifikasi-aset",
            {
              params: { per_page: 1000 },
            }
          );

          const fallbackData = fallbackResponse.data.data || [];
          fallbackData.forEach((item) => {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              uniqueKualifikasi.push({
                id: item.id,
                nama: item.nama_kualifikasi_aset,
                kode: item.kode_kualifikasi_aset || item.id,
              });
            }
          });
        } catch (fallbackError) {
          console.warn("Fallback endpoint failed:", fallbackError);
        }
      }

      const sortedKualifikasi = uniqueKualifikasi.sort((a, b) =>
        a.kode.toString().localeCompare(b.kode.toString(), undefined, {
          numeric: true,
        })
      );

      setKualifikasiAsetData(sortedKualifikasi);
    } catch (error) {
      console.error("Gagal mendapatkan kualifikasi aset:", error);
      setKualifikasiAsetData([]);
    }
  };

  // Fetch akun aset data
  const fetchAkunAsetData = async () => {
    try {
      const response = await api.get("/klasifikasi-aset/akun-aset", {
        params: { per_page: 1000 },
      });

      const sortedAkun = response.data.data
        .map((item) => ({
          id: item.id,
          nama: item.nama_akun_aset,
          kode: item.kode_akun_aset,
        }))
        .sort((a, b) =>
          a.kode.localeCompare(b.kode, undefined, { numeric: true })
        );

      setAkunAsetData(sortedAkun);
    } catch (error) {
      console.error("Gagal mendapatkan akun aset:", error);
      setAkunAsetData([]);
    }
  };

  // Fetch kelompok aset data
  const fetchKelompokAsetData = async (akunAsetId = null) => {
    if (!akunAsetId) {
      setKelompokAsetData([]);
      return;
    }

    setLoadingKelompokAset(true);
    try {
      const response = await api.get("/klasifikasi-aset/kelompok-aset", {
        params: { per_page: 1000, akun_aset_id: akunAsetId },
      });

      const sortedKelompok = response.data.data
        .map((item) => ({
          id: item.id,
          nama: item.nama_kelompok_aset,
          kode: item.kode_kelompok_aset,
        }))
        .sort((a, b) =>
          a.kode.localeCompare(b.kode, undefined, { numeric: true })
        );

      setKelompokAsetData(sortedKelompok);
    } catch (error) {
      console.error("Gagal mendapatkan kelompok aset:", error);
      setKelompokAsetData([]);
    } finally {
      setLoadingKelompokAset(false);
    }
  };

  // Fetch jenis aset data
  const fetchJenisAsetData = async (kelompokAsetId = null) => {
    if (!kelompokAsetId) {
      setJenisAsetData([]);
      return;
    }

    setLoadingJenisAset(true);
    try {
      const response = await api.get("/klasifikasi-aset/jenis-aset", {
        params: { per_page: 1000, kelompok_aset_id: kelompokAsetId },
      });

      const sortedJenis = response.data.data
        .map((item) => ({
          id: item.id,
          nama: item.nama_jenis_aset,
          kode: item.kode_jenis_aset,
        }))
        .sort((a, b) =>
          a.kode.localeCompare(b.kode, undefined, { numeric: true })
        );

      setJenisAsetData(sortedJenis);
    } catch (error) {
      console.error("Gagal mendapatkan jenis aset:", error);
      setJenisAsetData([]);
    } finally {
      setLoadingJenisAset(false);
    }
  };

  // Fetch objek aset data
  const fetchObjekAsetData = async (jenisAsetId = null) => {
    if (!jenisAsetId) {
      setObjekAsetData([]);
      return;
    }

    setLoadingObjekAset(true);
    try {
      const response = await api.get("/klasifikasi-aset/objek-aset", {
        params: { per_page: 1000, jenis_aset_id: jenisAsetId },
      });

      const sortedObjek = response.data.data
        .map((item) => ({
          id: item.id,
          nama: item.nama_objek_aset,
          kode: item.kode_objek_aset,
        }))
        .sort((a, b) =>
          a.kode.localeCompare(b.kode, undefined, { numeric: true })
        );

      setObjekAsetData(sortedObjek);
    } catch (error) {
      console.error("Gagal mendapatkan objek aset:", error);
      setObjekAsetData([]);
    } finally {
      setLoadingObjekAset(false);
    }
  };

  // Fetch bidang list
  const fetchBidangList = async () => {
    try {
      const response = await api.get("/klasifikasi-instansi/bidang", {
        params: { per_page: 1000 },
      });

      const sortedBidang = response.data.data
        .map((bidang) => ({
          id: bidang.id,
          kode_bidang: bidang.kode_bidang,
          nama_bidang: bidang.nama_bidang,
        }))
        .sort((a, b) =>
          a.kode_bidang.localeCompare(b.kode_bidang, undefined, {
            numeric: true,
          })
        );

      setBidangList(sortedBidang);
    } catch (error) {
      console.error("Gagal mendapatkan bidang list:", error);
      setBidangList([]);
    }
  };

  // Fetch unit list based on selected bidang
  const fetchUnitList = async (bidangId) => {
    if (!bidangId) {
      setUnitList([]);
      return;
    }

    setLoadingUnits(true);
    try {
      const response = await api.get("/klasifikasi-instansi/unit", {
        params: { per_page: 1000, bidang_id: bidangId },
      });

      const sortedUnit = response.data.data
        .map((unit) => ({
          id: unit.id,
          kode_unit: unit.kode_unit,
          nama_unit: unit.nama_unit,
        }))
        .sort((a, b) =>
          a.kode_unit.localeCompare(b.kode_unit, undefined, { numeric: true })
        );

      setUnitList(sortedUnit);
    } catch (error) {
      console.error("Gagal mendapatkan unit list:", error);
      setUnitList([]);
    } finally {
      setLoadingUnits(false);
    }
  };

  // Fetch subunit list based on selected unit
  const fetchSubUnitList = async (unitId) => {
    if (!unitId) {
      setSubUnitList([]);
      return;
    }

    setLoadingSubUnits(true);
    try {
      const response = await api.get("/klasifikasi-instansi/subunit", {
        params: { per_page: 1000, unit_id: unitId },
      });

      const sortedSubUnit = response.data.data
        .map((subUnit) => ({
          id: subUnit.id,
          kode_sub_unit: subUnit.kode_sub_unit,
          nama_sub_unit: subUnit.nama_sub_unit,
        }))
        .sort((a, b) =>
          a.kode_sub_unit.localeCompare(b.kode_sub_unit, undefined, {
            numeric: true,
          })
        );

      setSubUnitList(sortedSubUnit);
    } catch (error) {
      console.error("Gagal mendapatkan subunit list:", error);
      setSubUnitList([]);
    } finally {
      setLoadingSubUnits(false);
    }
  };

  // Fetch UPB list based on selected sub unit
  const fetchUpbList = async (subUnitId) => {
    if (!subUnitId) {
      setUpbList([]);
      return;
    }

    setLoadingUpbs(true);
    try {
      const response = await api.get("/klasifikasi-instansi/upb", {
        params: { per_page: 1000, sub_unit_id: subUnitId },
      });

      const sortedUpb = response.data.data
        .map((upb) => ({
          id: upb.id,
          kode_upb: upb.kode_upb,
          nama_upb: upb.nama_upb,
        }))
        .sort((a, b) =>
          a.kode_upb.localeCompare(b.kode_upb, undefined, { numeric: true })
        );

      setUpbList(sortedUpb);
    } catch (error) {
      console.error("Gagal mendapatkan upb list:", error);
      setUpbList([]);
    } finally {
      setLoadingUpbs(false);
    }
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: paginationModel.page + 1,
        per_page: paginationModel.pageSize,
      });

      // Add search parameter with proper trimming and validation
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim());
      }

      // Add filter parameters
      if (filters.tahun) params.append("tahun", filters.tahun);
      if (filters.semester) params.append("semester", filters.semester);
      if (filters.upb) params.append("upb_id", filters.upb);
      else if (filters.subUnit) params.append("sub_unit_id", filters.subUnit);
      else if (filters.unit) params.append("unit_id", filters.unit);
      else if (filters.subRincianAset)
        params.append("bidang_id", filters.subRincianAset);
      if (filters.kualifikasiAset)
        params.append("kualifikasi_aset_id", filters.kualifikasiAset);
      if (filters.akunAset) params.append("akun_aset_id", filters.akunAset);
      if (filters.kelompokAset)
        params.append("kelompok_aset_id", filters.kelompokAset);
      if (filters.jenisAset) params.append("jenis_aset_id", filters.jenisAset);
      if (filters.objekAset) params.append("objek_aset_id", filters.objekAset);

      console.log("Fetch params:", params.toString()); // Debug log

      const response = await api.get(`/saldo-awal?${params}`);
      const rawData = response.data?.data || response.data || [];
      const mappedData = mapSaldoAwalData(rawData);

      setSaldoAwalData(mappedData);
      setRowCount(response.data?.meta?.total || mappedData.length);
    } catch (err) {
      console.error("Failed to fetch saldo awal data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching data"
      );
      setSaldoAwalData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [paginationModel, debouncedSearchTerm, filters, refreshTrigger]);

  // Table columns configuration
  const baseColumns = [
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
        const index = saldoAwalData.findIndex(
          (row) => row.id === params.row.id
        );
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    { field: "unit", headerName: "Unit", width: 180, sortable: false },
    { field: "upb", headerName: "UPB", width: 180, sortable: false },
    {
      field: "kualifikasiAset",
      headerName: "Kualifikasi Aset",
      width: 200,
      sortable: false,
    },
    {
      field: "jenisObjek",
      headerName: "Jenis/Objek",
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <div>
          {params.row.jenisAset} / {params.row.objekAset}
        </div>
      ),
    },
    {
      field: "jumlahBarang",
      headerName: "Jumlah Barang",
      width: 150,
      sortable: false,
    },
    {
      field: "nilaiBarang",
      headerName: "Nilai Barang",
      width: 200,
      sortable: false,
      valueFormatter: (value) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(value || 0);
      },
    },
  ];

  // Export configuration
  const exportColumns = [
    { field: "no", headerName: "No" },
    { field: "unit", headerName: "Unit" },
    { field: "upb", headerName: "UPB" },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset" },
    {
      field: "jenisObjek",
      headerName: "Jenis/Objek Aset",
      formatter: commonFormatters.combined(["jenisAset", "objekAset"], " / "),
    },
    { field: "jumlahBarang", headerName: "Jumlah Barang" },
    {
      field: "nilaiBarang",
      headerName: "Nilai Barang",
      formatter: commonFormatters.currency,
    },
  ];

  // Event handlers
  const handleExportClick = async () => {
    const fetchAllDataForExport = async () => {
      const params = new URLSearchParams({ page: 1, per_page: 10000 });

      // Include search term in export if present
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim());
      }

      if (filters.tahun) params.append("tahun", filters.tahun);
      if (filters.semester) params.append("semester", filters.semester);
      if (filters.upb) params.append("upb_id", filters.upb);
      else if (filters.subUnit) params.append("sub_unit_id", filters.subUnit);
      else if (filters.unit) params.append("unit_id", filters.unit);
      else if (filters.subRincianAset)
        params.append("bidang_id", filters.subRincianAset);
      if (filters.kualifikasiAset)
        params.append("kualifikasi_aset_id", filters.kualifikasiAset);
      if (filters.akunAset) params.append("akun_aset_id", filters.akunAset);
      if (filters.kelompokAset)
        params.append("kelompok_aset_id", filters.kelompokAset);
      if (filters.jenisAset) params.append("jenis_aset_id", filters.jenisAset);
      if (filters.objekAset) params.append("objek_aset_id", filters.objekAset);

      const response = await api.get(`/saldo-awal?${params}`);
      const rawData = response.data?.data || response.data || [];
      return mapSaldoAwalData(rawData);
    };

    const exportConfig = {
      fetchDataFunction: fetchAllDataForExport,
      columns: exportColumns,
      filename: `data-saldo-awal${
        debouncedSearchTerm
          ? `-search-${debouncedSearchTerm.replace(/\s+/g, "-")}`
          : ""
      }`,
      sheetName: "Data Saldo Awal",
      setExporting,
    };

    await handleExport(exportConfig);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Clear search and filters
      setSearchTerm("");
      setDebouncedSearchTerm(""); // Also reset debounced search
      setFilters(INITIAL_FILTERS);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
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

  const handleOpenAddModal = () => {
    setEditingSaldoAwal(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSaldoAwal(null);
  };

  const handleSaveNewSaldoAwal = async (formData) => {
    try {
      if (formData.id) {
        const { id, ...payload } = formData;
        await api.patch(`/saldo-awal/${id}`, payload);
        Swal.fire({
          title: "Berhasil Edit",
          text: "Data berhasil diubah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/saldo-awal", formData);
        Swal.fire({
          title: "Berhasil Add",
          text: "Data berhasil ditambah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      handleCloseAddModal();
      handleRefresh();
    } catch (err) {
      console.error("Failed to save:", err);
      const errorData = err.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join("\n");
        Swal.fire({
          title: "Gagal",
          text: errorMessages,
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Terjadi kesalahan saat menyimpan data.",
          icon: "error",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
          },
        });
      }
    }
  };

  const handleEditClick = (id) => {
    const saldoAwalToEdit = saldoAwalData.find((item) => item.id === id);
    if (saldoAwalToEdit) {
      setEditingSaldoAwal(saldoAwalToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
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
      await api.delete(`/saldo-awal/${id}`);
      Swal.fire({
        title: "Berhasil Delete",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleRefresh();
    } catch (error) {
      console.error("Failed to delete saldo awal:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    // Reset pagination when filter changes
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleColumnVisibilityChange = (newVisibility) => {
    setColumnVisibility(newVisibility);
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  // Initialize column visibility
  useEffect(() => {
    const initialVisibility = {};
    baseColumns.forEach((col) => {
      initialVisibility[col.field] = true;
    });
    setColumnVisibility(initialVisibility);
  }, []);

  // Debounce search input with improved logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== debouncedSearchTerm) {
        setDebouncedSearchTerm(searchTerm);
        // Reset pagination when search changes
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
      }
    }, 500); // Increased debounce time to 500ms for better UX

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect hook to fetch dropdown data once on component mount
  useEffect(() => {
    fetchTahunData();
    fetchSemesterData();
    fetchBidangList();
    fetchKualifikasiAsetData();
    fetchAkunAsetData();
  }, []);

  // Effect to fetch units when bidang changes
  useEffect(() => {
    if (filters.subRincianAset) {
      fetchUnitList(filters.subRincianAset);
    } else {
      setUnitList([]);
      setSubUnitList([]);
      setUpbList([]);
    }
    // Reset dependent filters when bidang changes
    if (filters.unit || filters.subUnit || filters.upb) {
      setFilters((prev) => ({
        ...prev,
        unit: "",
        subUnit: "",
        upb: "",
      }));
    }
  }, [filters.subRincianAset]);

  // Effect to fetch sub units when unit changes
  useEffect(() => {
    if (filters.unit) {
      fetchSubUnitList(filters.unit);
    } else {
      setSubUnitList([]);
      setUpbList([]);
    }
    // Reset dependent filters when unit changes
    if (filters.subUnit || filters.upb) {
      setFilters((prev) => ({
        ...prev,
        subUnit: "",
        upb: "",
      }));
    }
  }, [filters.unit]);

  // Effect to fetch UPBs when sub unit changes
  useEffect(() => {
    if (filters.subUnit) {
      fetchUpbList(filters.subUnit);
    } else {
      setUpbList([]);
    }
    // Reset dependent filters when sub unit changes
    if (filters.upb) {
      setFilters((prev) => ({
        ...prev,
        upb: "",
      }));
    }
  }, [filters.subUnit]);

  // Effect to fetch kelompok aset when akun aset changes
  useEffect(() => {
    if (filters.akunAset) {
      fetchKelompokAsetData(filters.akunAset);
    } else {
      setKelompokAsetData([]);
      setJenisAsetData([]);
      setObjekAsetData([]);
    }
    // Reset dependent filters when akun aset changes
    if (filters.kelompokAset || filters.jenisAset || filters.objekAset) {
      setFilters((prev) => ({
        ...prev,
        kelompokAset: "",
        jenisAset: "",
        objekAset: "",
      }));
    }
  }, [filters.akunAset]);

  // Effect to fetch jenis aset when kelompok aset changes
  useEffect(() => {
    if (filters.kelompokAset) {
      fetchJenisAsetData(filters.kelompokAset);
    } else {
      setJenisAsetData([]);
      setObjekAsetData([]);
    }
    // Reset dependent filters when kelompok aset changes
    if (filters.jenisAset || filters.objekAset) {
      setFilters((prev) => ({
        ...prev,
        jenisAset: "",
        objekAset: "",
      }));
    }
  }, [filters.kelompokAset]);

  // Effect to fetch objek aset when jenis aset changes
  useEffect(() => {
    if (filters.jenisAset) {
      fetchObjekAsetData(filters.jenisAset);
    } else {
      setObjekAsetData([]);
    }
    // Reset dependent filters when jenis aset changes
    if (filters.objekAset) {
      setFilters((prev) => ({
        ...prev,
        objekAset: "",
      }));
    }
  }, [filters.jenisAset]);

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    return baseColumns.filter((col) => {
      return columnVisibility[col.field] !== false;
    });
  }, [baseColumns, columnVisibility]);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
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

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Saldo Awal</h1>
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
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Add Saldo Awal
              </button>
            </div>
          </div>

          {/* Filters - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
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
            {/* Sub Rincian Aset adalah Bidang */}
            <select
              value={filters.subRincianAset}
              onChange={(e) =>
                handleFilterChange("subRincianAset", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Sub Rincian Aset --</option>
              {bidangList.map((bidang) => (
                <option key={bidang.id} value={bidang.id}>
                  {bidang.kode_bidang} - {bidang.nama_bidang}
                </option>
              ))}
            </select>
            {/* Unit */}
            <select
              value={filters.unit}
              onChange={(e) => handleFilterChange("unit", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!filters.subRincianAset || loadingUnits}
            >
              <option value="">
                {loadingUnits ? "Memuat..." : "-- Unit --"}
              </option>
              {unitList.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.kode_unit} - {unit.nama_unit}
                </option>
              ))}
            </select>
            {/* Sub Unit */}
            <select
              value={filters.subUnit}
              onChange={(e) => handleFilterChange("subUnit", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!filters.unit || loadingSubUnits}
            >
              <option value="">
                {loadingSubUnits ? "Memuat..." : "-- Sub Unit --"}
              </option>
              {subUnitList.map((subUnit) => (
                <option key={subUnit.id} value={subUnit.id}>
                  {subUnit.kode_sub_unit} - {subUnit.nama_sub_unit}
                </option>
              ))}
            </select>
            {/* UPB */}
            <select
              value={filters.upb}
              onChange={(e) => handleFilterChange("upb", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!filters.subUnit || loadingUpbs}
            >
              <option value="">
                {loadingUpbs ? "Memuat..." : "-- UPB --"}
              </option>
              {upbList.map((upb) => (
                <option key={upb.id} value={upb.id}>
                  {upb.kode_upb} - {upb.nama_upb}
                </option>
              ))}
            </select>
          </div>

          {/* Filters - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Kualifikasi Aset */}
            <select
              value={filters.kualifikasiAset}
              onChange={(e) =>
                handleFilterChange("kualifikasiAset", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Kualifikasi Aset --</option>
              {kualifikasiAsetData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>
            {/* Akun Aset */}
            <select
              value={filters.akunAset}
              onChange={(e) => handleFilterChange("akunAset", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Akun Aset --</option>
              {akunAsetData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>
            {/* Kelompok Aset */}
            <select
              value={filters.kelompokAset}
              onChange={(e) =>
                handleFilterChange("kelompokAset", e.target.value)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!filters.akunAset || loadingKelompokAset}
            >
              <option value="">
                {loadingKelompokAset ? "Memuat..." : "-- Kelompok Aset --"}
              </option>
              {kelompokAsetData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>
            {/* Jenis Aset */}
            <select
              value={filters.jenisAset}
              onChange={(e) => handleFilterChange("jenisAset", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!filters.kelompokAset || loadingJenisAset}
            >
              <option value="">
                {loadingJenisAset ? "Memuat..." : "-- Jenis Aset --"}
              </option>
              {jenisAsetData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>
            {/* Objek Aset */}
            <select
              value={filters.objekAset}
              onChange={(e) => handleFilterChange("objekAset", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!filters.jenisAset || loadingObjekAset}
            >
              <option value="">
                {loadingObjekAset ? "Memuat..." : "-- Objek Aset --"}
              </option>
              {objekAsetData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kode} - {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Show</span>
                <select
                  value={paginationModel.pageSize}
                  onChange={(e) => {
                    setPaginationModel((prev) => ({
                      ...prev,
                      pageSize: Number(e.target.value),
                      page: 0,
                    }));
                  }}
                  className="border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer"
                >
                  {ENTRIES_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-gray-600 text-sm">entries</span>
              </div>

              {/* Column Manager */}
              <ColumnManager
                columns={baseColumns}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={handleColumnVisibilityChange}
              />
            </div>

            {/* Search with Clear Button */}
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
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Clear search button */}
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Search Info */}
          {debouncedSearchTerm && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
              <p className="text-sm">
                Showing results for: <strong>"{debouncedSearchTerm}"</strong>
                {rowCount > 0 && (
                  <span>
                    {" "}
                    ({rowCount} result{rowCount !== 1 ? "s" : ""} found)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Data Table */}
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2 text-2xl">⚠️</div>
              <div className="text-red-600 font-semibold mb-2">Error</div>
              <div className="text-gray-600">{error}</div>
              <button
                onClick={fetchData}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <DataTable
              rows={saldoAwalData}
              columns={visibleColumns}
              rowCount={rowCount}
              loading={loading}
              paginationMode="server"
              filterMode="server"
              pageSizeOptions={ENTRIES_PER_PAGE_OPTIONS}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              height={500}
              emptyRowsMessage={
                debouncedSearchTerm
                  ? `Tidak ada data yang cocok dengan pencarian "${debouncedSearchTerm}"`
                  : "Tidak ada data tersedia"
              }
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
            />
          )}
        </div>
      </div>

      {/* Modal for adding/editing saldo awal */}
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
