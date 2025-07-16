import React, { useState, useEffect, useCallback } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddSubUnitModal from "./AddSubUnitModal";
import DataTable from "../../../../components/DataTable";

// Custom hook untuk mengelola data bidang
const useBidangData = () => {
  const [bidangList, setBidangList] = useState([]);

  const fetchBidangList = useCallback(async () => {
    try {
      const res = await api.get("/klasifikasi-instansi/bidang", {
        params: { per_page: 1000 },
      });

      const sorted = res.data.data
        .map((b) => ({
          id: b.id,
          kode_bidang: b.kode_bidang,
          nama_bidang: b.nama_bidang,
          full_name: `${b.kode_bidang} - ${b.nama_bidang}`,
        }))
        .sort((a, b) => {
          const numA = parseInt(a.kode_bidang);
          const numB = parseInt(b.kode_bidang);

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          return a.kode_bidang.localeCompare(b.kode_bidang);
        });

      setBidangList(sorted);
    } catch (err) {
      console.error("Gagal fetch bidang list:", err);
    }
  }, []);

  return { bidangList, fetchBidangList };
};

// Custom hook untuk mengelola data unit
const useUnitData = () => {
  const [unitList, setUnitList] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const fetchUnitList = useCallback(async (bidangId = "") => {
    if (!bidangId) {
      setUnitList([]);
      return;
    }

    try {
      setLoadingUnits(true);
      const params = {
        per_page: 1000,
        bidang_id: bidangId,
      };

      const res = await api.get("/klasifikasi-instansi/unit", { params });
      const sorted = res.data.data
        .map((u) => ({
          id: u.id,
          kode_unit: u.kode_unit,
          nama_unit: u.nama_unit,
          full_name: `${u.kode_unit} - ${u.nama_unit}`,
        }))
        .sort((a, b) => {
          const numA = parseInt(a.kode_unit);
          const numB = parseInt(b.kode_unit);

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          return a.kode_unit.localeCompare(b.kode_unit);
        });

      setUnitList(sorted);
    } catch (err) {
      console.error("Gagal fetch unit list:", err);
      setUnitList([]);
    } finally {
      setLoadingUnits(false);
    }
  }, []);

  return { unitList, loadingUnits, fetchUnitList, setUnitList };
};

// Custom hook untuk mengelola data sub unit
const useSubUnitData = () => {
  const [subUnitData, setSubUnitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  const mapSubUnitData = (data) => {
    return data.map((item) => ({
      id: item.id,
      provinsi: item.unit?.bidang?.kabupaten_kota?.provinsi
        ? `${item.unit.bidang.kabupaten_kota.provinsi.kode_provinsi} - ${item.unit.bidang.kabupaten_kota.provinsi.nama_provinsi}`
        : "-",
      kabupaten_kota: item.unit?.bidang?.kabupaten_kota
        ? `${item.unit.bidang.kabupaten_kota.kode_kabupaten_kota} - ${item.unit.bidang.kabupaten_kota.nama_kabupaten_kota}`
        : "-",
      bidang: item.unit?.bidang
        ? `${item.unit.bidang.kode_bidang} - ${item.unit.bidang.nama_bidang}`
        : "-",
      unit: item.unit ? `${item.unit.kode_unit} - ${item.unit.nama_unit}` : "-",
      kode_sub_unit: item.kode_sub_unit || "-",
      nama_sub_unit: item.nama_sub_unit || "-",
      kode: item.kode || "-",
    }));
  };

  const fetchSubUnitData = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/klasifikasi-instansi/subunit", {
        params: {
          page: params.page || 1,
          per_page: params.pageSize || 10,
          search: params.search || "",
          unit_id: params.unitId || undefined,
        },
      });

      const mappedData = mapSubUnitData(response.data.data);
      setSubUnitData(mappedData);
      setTotalRows(response.data.meta.total);
    } catch (error) {
      console.error("Gagal fetch data sub unit:", error);
      setSubUnitData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, []);

  return { subUnitData, loading, totalRows, fetchSubUnitData };
};

// Custom hook untuk debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Komponen utama
const SubUnitPage = () => {
  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubUnit, setEditingSubUnit] = useState(null);

  // Custom hooks
  const { bidangList, fetchBidangList } = useBidangData();
  const { unitList, loadingUnits, fetchUnitList, setUnitList } = useUnitData();
  const { subUnitData, loading, totalRows, fetchSubUnitData } =
    useSubUnitData();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Effects
  useEffect(() => {
    fetchBidangList();
  }, [fetchBidangList]);

  useEffect(() => {
    setSelectedUnit("");
    if (selectedBidang) {
      fetchUnitList(selectedBidang);
    } else {
      setUnitList([]);
    }
  }, [selectedBidang, fetchUnitList, setUnitList]);

  useEffect(() => {
    fetchSubUnitData({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      search: debouncedSearchTerm,
      unitId: selectedUnit,
    });
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    debouncedSearchTerm,
    selectedUnit,
    fetchSubUnitData,
  ]);

  // Event handlers
  const handleBidangChange = (e) => {
    const newBidangId = e.target.value;
    setSelectedBidang(newBidangId);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    setUnitList([]);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleExport = () => {
    console.log("Exporting sub unit data...");
    // TODO: Implementasi ekspor data
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPaginationModel({ page: 0, pageSize: newPageSize });
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingSubUnit(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSubUnit(null);
    fetchSubUnitData({
      page: paginationModel.page + 1,
      pageSize: paginationModel.pageSize,
      search: debouncedSearchTerm,
      unitId: selectedUnit,
    });
  };

  const handleSaveNewSubUnit = async (subUnitToSave) => {
    try {
      const payload = {
        unit_id: subUnitToSave.unit_id,
        kode_sub_unit: subUnitToSave.kode_sub_unit,
        nama_sub_unit: subUnitToSave.nama_sub_unit,
        kode: subUnitToSave.kode,
      };

      const endpoint = subUnitToSave.id
        ? `/klasifikasi-instansi/subunit/${subUnitToSave.id}`
        : "/klasifikasi-instansi/subunit";

      const method = subUnitToSave.id ? "put" : "post";
      await api[method](endpoint, payload);

      handleCloseAddModal();
    } catch (error) {
      console.error(
        "Gagal menyimpan sub unit:",
        error.response?.data || error.message
      );
      alert("Gagal menyimpan data. Cek konsol untuk detail.");
    }
  };

  const handleEditClick = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/klasifikasi-instansi/subunit/${id}`);
      const dataToEdit = response.data.data;

      const mappedForEdit = {
        id: dataToEdit.id,
        unit_id: dataToEdit.unit_id,
        bidang_id: dataToEdit.unit?.bidang?.id || "",
        kode_sub_unit: dataToEdit.kode_sub_unit,
        nama_sub_unit: dataToEdit.nama_sub_unit,
        kode: dataToEdit.kode,
      };

      setEditingSubUnit(mappedForEdit);
      setIsAddModalOpen(true);
    } catch (error) {
      console.error("Gagal mengambil data sub unit untuk diedit:", error);
      alert("Gagal memuat data untuk diedit.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await api.delete(`/klasifikasi-instansi/subunit/${id}`);
      fetchSubUnitData({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: debouncedSearchTerm,
        unitId: selectedUnit,
      });
    } catch (error) {
      console.error(
        "Gagal menghapus sub unit:",
        error.response?.data || error.message
      );
      alert("Gagal menghapus data. Cek konsol untuk detail.");
    }
  };

  // Kolom DataTable
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = subUnitData.findIndex((row) => row.id === params.row.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    { field: "provinsi", headerName: "Provinsi", width: 180 },
    { field: "kabupaten_kota", headerName: "Kabupaten/Kota", width: 250 },
    { field: "bidang", headerName: "Bidang", width: 180 },
    { field: "unit", headerName: "Unit", width: 180 },
    { field: "kode_sub_unit", headerName: "Kode Sub Unit", width: 150 },
    { field: "nama_sub_unit", headerName: "Nama Sub Unit", flex: 1 },
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
            <h1 className="text-2xl font-bold">Daftar Sub Unit</h1>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Sub Unit
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Filter Bidang */}
              <div className="flex items-center gap-2">
                <label className="text-gray-800 font-semibold">Bidang</label>
                <select
                  value={selectedBidang}
                  onChange={handleBidangChange}
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
                <label className="text-gray-800 font-semibold">Unit</label>
                <select
                  value={selectedUnit}
                  onChange={handleUnitChange}
                  className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                  disabled={!selectedBidang || loadingUnits}
                >
                  <option value="">
                    {loadingUnits ? "Loading..." : "-- Pilih Unit --"}
                  </option>
                  {unitList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64 flex items-center gap-2">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Page Size Selector */}
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

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              key={`datatable-${paginationModel.page}-${paginationModel.pageSize}-${debouncedSearchTerm}-${selectedBidang}-${selectedUnit}`}
              rows={subUnitData}
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No Sub Unit data available"
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

      {/* Modal */}
      <AddSubUnitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewSubUnit}
        initialData={editingSubUnit}
        bidangList={bidangList}
        unitList={unitList}
      />
    </div>
  );
};

export default SubUnitPage;
