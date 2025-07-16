import React, { useState, useEffect, useCallback } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddUpbModal from "./AddUpbModal";
import DataTable from "../../../../components/DataTable";

const UpbPage = () => {
  // --- State untuk Data dan Filter ---
  const [searchTerm, setSearchTerm] = useState("");
  const [upbData, setUpbData] = useState([]);
  const [bidangList, setBidangList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [subUnitList, setSubUnitList] = useState([]);

  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");

  // --- State untuk UI dan Paginasi ---
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUpb, setEditingUpb] = useState(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // --- Fungsi Fetching Data Dropdown (memoized dengan useCallback) ---

  const fetchBidangList = useCallback(async () => {
    try {
      const params = { per_page: 1000 };
      const res = await api.get("/klasifikasi-instansi/bidang", { params });
      const sorted = (res.data.data || [])
        .map((b) => ({
          id: b.id,
          kode_bidang: b.kode_bidang,
          nama_bidang: b.nama_bidang,
          full_name: `${b.kode_bidang} - ${b.nama_bidang}`,
        }))
        .sort((a, b) => parseFloat(a.kode_bidang) - parseFloat(b.kode_bidang));
      setBidangList(sorted);
    } catch (err) {
      console.error("Error fetching bidang list:", err);
      setBidangList([]);
    }
  }, []);

  const fetchUnitList = useCallback(async (bidangId = "") => {
    try {
      const params = { per_page: 1000 };
      if (bidangId) {
        params.bidang_id = bidangId;
      }
      const res = await api.get("/klasifikasi-instansi/unit", { params });
      const sorted = (res.data.data || [])
        .map((u) => ({
          id: u.id,
          kode_unit: u.kode_unit,
          nama_unit: u.nama_unit,
          full_name: `${u.kode_unit} - ${u.nama_unit}`,
        }))
        .sort((a, b) => parseFloat(a.kode_unit) - parseFloat(b.kode_unit));
      setUnitList(sorted);
    } catch (err) {
      console.error("Error fetching unit list:", err);
      setUnitList([]);
    }
  }, []);

  const fetchSubUnitList = useCallback(async (unitId = "") => {
    try {
      const params = { per_page: 1000 };
      if (unitId) {
        params.unit_id = unitId;
      }
      const res = await api.get("/klasifikasi-instansi/subunit", { params });
      const sorted = (res.data.data || [])
        .map((s) => ({
          id: s.id,
          kode_sub_unit: s.kode_sub_unit,
          nama_sub_unit: s.nama_sub_unit,
          full_name: `${s.kode_sub_unit} - ${s.nama_sub_unit}`,
        }))
        .sort(
          (a, b) => parseFloat(a.kode_sub_unit) - parseFloat(b.kode_sub_unit)
        );
      setSubUnitList(sorted);
    } catch (err) {
      console.error("Error fetching sub unit list:", err);
      setSubUnitList([]);
    }
  }, []);

  // --- Fungsi Fetching Data UPB Utama (memoized dengan useCallback) ---
  const fetchUpbData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page + 1,
        per_page: paginationModel.pageSize,
        search: searchTerm,
        bidang_id: selectedBidang || undefined,
        unit_id: selectedUnit || undefined,
        sub_unit_id: selectedSubUnit || undefined,
      };

      const response = await api.get("/klasifikasi-instansi/upb", { params });

      // Mapping data untuk tampilan tabel
      const mappedData = (response.data.data || []).map((item) => ({
        id: item.id,
        // Pastikan path akses ke properti nested sesuai dengan struktur API Anda
        bidang: item.sub_unit?.unit?.bidang
          ? `${item.sub_unit.unit.bidang.kode_bidang} - ${item.sub_unit.unit.bidang.nama_bidang}`
          : "-",
        unit: item.sub_unit?.unit
          ? `${item.sub_unit.unit.kode_unit} - ${item.sub_unit.unit.nama_unit}`
          : "-",
        subUnit: item.sub_unit
          ? `${item.sub_unit.kode_sub_unit} - ${item.sub_unit.nama_sub_unit}`
          : "-",
        kodeUpb: item.kode_upb || "-",
        namaUpb: item.nama_upb || "-",
        kode: item.kode || "-",
      }));

      setUpbData(mappedData);
      setTotalRows(response.data.meta.total);
    } catch (error) {
      console.error("Error fetching UPB data:", error);
      setUpbData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    searchTerm,
    selectedBidang,
    selectedUnit,
    selectedSubUnit,
  ]);

  // --- useEffect Hooks untuk Kontrol Lifecycle dan Data Fetching ---

  // Initial data load for Bidang dropdown
  useEffect(() => {
    fetchBidangList();
  }, [fetchBidangList]);

  // Handle Bidang selection change: fetch Unit list and reset dependent selections
  useEffect(() => {
    if (selectedBidang) {
      fetchUnitList(selectedBidang);
    } else {
      setUnitList([]);
    }
    // Always reset dependent dropdowns when parent changes
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSubUnitList([]); // Clear SubUnit list when Bidang changes
  }, [selectedBidang, fetchUnitList]);

  // Handle Unit selection change: fetch Sub Unit list and reset dependent selection
  useEffect(() => {
    if (selectedUnit) {
      fetchSubUnitList(selectedUnit);
    } else {
      setSubUnitList([]);
    }
    // Always reset dependent dropdown when parent changes
    setSelectedSubUnit("");
  }, [selectedUnit, fetchSubUnitList]);

  // Fetch UPB data whenever filters or pagination model changes
  useEffect(() => {
    fetchUpbData();
  }, [fetchUpbData]);

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset page on search
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or re-render
  }, [searchTerm]);

  // --- Handler Fungsi ---

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset page on refresh

    // Re-fetch all initial data
    fetchBidangList();
    setUnitList([]); // Clear dependent lists
    setSubUnitList([]);
  };

  const handleExport = () => {
    console.log("Exporting UPB data...");
    // Implement your export logic here (e.g., call an export API or generate CSV)
  };

  const handleOpenAddModal = () => {
    setEditingUpb(null); // Clear any previous editing data
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUpb(null); // Clear editing state after modal closes
    fetchUpbData(); // Refresh table data after add/edit
  };

  const handleSaveNewUpb = async (upbToSave) => {
    try {
      const payload = {
        sub_unit_id: upbToSave.sub_unit_id,
        kode_upb: upbToSave.kode_upb,
        nama_upb: upbToSave.nama_upb,
        kode: upbToSave.kode,
      };

      if (upbToSave.id) {
        await api.put(`/klasifikasi-instansi/upb/${upbToSave.id}`, payload);
      } else {
        await api.post("/klasifikasi-instansi/upb", payload);
      }
      handleCloseAddModal(); // Close modal and refresh data
    } catch (error) {
      console.error(
        "Failed to save UPB data:",
        error.response?.data || error.message
      );
      alert("Failed to save data. Check console for details.");
    }
  };

  const handleEditClick = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/klasifikasi-instansi/upb/${id}`);
      const dataToEdit = response.data.data;

      // Map API response to modal's expected initialData format
      const mappedForEdit = {
        id: dataToEdit.id,
        sub_unit_id: dataToEdit.sub_unit_id,
        unit_id: dataToEdit.sub_unit?.unit_id || "",
        bidang_id: dataToEdit.sub_unit?.unit?.bidang_id || "",
        kode_upb: dataToEdit.kode_upb,
        nama_upb: dataToEdit.nama_upb,
        kode: dataToEdit.kode,
      };
      setEditingUpb(mappedForEdit);
      setIsAddModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch UPB data for editing:", error);
      alert("Failed to load data for editing.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this data?")) return;
    try {
      await api.delete(`/klasifikasi-instansi/upb/${id}`);
      fetchUpbData(); // Refresh table data after deletion
    } catch (error) {
      console.error(
        "Failed to delete UPB:",
        error.response?.data || error.message
      );
      alert("Failed to delete data. Check console for details.");
    }
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPaginationModel((prev) => ({
      pageSize: newPageSize,
      page: 0, // Reset to first page when page size changes
    }));
  };

  // --- Konfigurasi Kolom DataTable ---
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = upbData.findIndex((row) => row.id === params.row.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    { field: "bidang", headerName: "Bidang", width: 180 },
    { field: "unit", headerName: "Unit", width: 180 },
    { field: "subUnit", headerName: "Sub Unit", width: 180 },
    { field: "kodeUpb", headerName: "Kode UPB", width: 150 },
    { field: "namaUpb", headerName: "Nama UPB", flex: 1 },
    { field: "kode", headerName: "Kode", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
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
  ];

  // --- Render UI ---
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Daftar UPB</h1>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cbg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add UPB
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end flex-wrap">
              {" "}
              {/* Added flex-wrap for better responsiveness */}
              {/* Filter Bidang */}
              <div className="flex items-center gap-2">
                <label className="text-gray-800 font-semibold whitespace-nowrap">
                  Bidang
                </label>
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Bidang --</option>
                  {bidangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.full_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Filter Unit */}
              <div className="flex items-center gap-2">
                <label className="text-gray-800 font-semibold whitespace-nowrap">
                  Unit
                </label>
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                  // Disabling dropdown if parent is not selected or no options available
                  disabled={!selectedBidang || unitList.length === 0}
                >
                  <option value="">-- Pilih Unit --</option>
                  {unitList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Filter Sub Unit */}
              <div className="flex items-center gap-2">
                <label className="text-gray-800 font-semibold whitespace-nowrap">
                  Sub Unit
                </label>
                <select
                  value={selectedSubUnit}
                  onChange={(e) => setSelectedSubUnit(e.target.value)}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                  // Disabling dropdown if parent is not selected or no options available
                  disabled={!selectedUnit || subUnitList.length === 0}
                >
                  <option value="">-- Pilih Sub Unit --</option>
                  {subUnitList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64 flex items-center">
              <Search className="absolute left-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pagination and Entries Per Page */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              Show
              <select
                value={paginationModel.pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              entries
            </div>
          </div>

          {/* DataTable or Loading Indicator */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              // Key to force re-render DataTable when filters change
              key={`datatable-${paginationModel.page}-${paginationModel.pageSize}-${searchTerm}-${selectedBidang}-${selectedUnit}-${selectedSubUnit}`}
              rows={upbData}
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No UPB data available"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={totalRows}
              paginationMode="server"
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
            />
          )}
        </div>
      </div>
      {/* Add/Edit UPB Modal */}
      <AddUpbModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewUpb}
        initialData={editingUpb}
        bidangList={bidangList}
        unitList={unitList}
        subUnitList={subUnitList}
        fetchUnitList={fetchUnitList} // Pass fetch functions for dynamic dropdowns in modal
        fetchSubUnitList={fetchSubUnitList}
      />
    </div>
  );
};

export default UpbPage;
