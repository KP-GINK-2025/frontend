import React, { useState, useEffect, useCallback } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddSubUnitModal from "./AddSubUnitModal"; // Pastikan nama modal sudah diganti
import DataTable from "../../../../components/DataTable";
import Swal from "sweetalert2";

// Custom hook untuk mengelola data bidang
const useBidangData = () => {
  const [bidangList, setBidangList] = useState([]);

  const fetchBidangList = useCallback(async () => {
    try {
      const res = await api.get("/klasifikasi-instansi/bidang", {
        params: { per_page: 1000 }, // Ambil semua data bidang
      });

      const sorted = res.data.data
        .map((b) => ({
          id: b.id,
          kode_bidang: b.kode_bidang,
          nama_bidang: b.nama_bidang,
          full_name: `${b.kode_bidang} - ${b.nama_bidang}`,
        }))
        .sort((a, b) =>
          a.kode_bidang.localeCompare(b.kode_bidang, undefined, {
            numeric: true,
          })
        );
      setBidangList(sorted);
    } catch (err) {
      console.error("Gagal fetch bidang list:", err);
    }
  }, []);

  return { bidangList, fetchBidangList };
};

// Custom hook untuk mengelola data unit (untuk filter)
const useUnitData = () => {
  const [unitList, setUnitList] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const fetchUnitList = useCallback(async (bidangId = "") => {
    if (!bidangId) {
      setUnitList([]);
      return;
    }
    setLoadingUnits(true);
    try {
      const params = {
        per_page: 1000, // Ambil semua data unit di bawah bidang terpilih
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
        .sort((a, b) =>
          a.kode_unit.localeCompare(b.kode_unit, undefined, { numeric: true })
        );
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

// Komponen utama SubUnitPage
const SubUnitPage = () => {
  // State utama
  const [subUnitData, setSubUnitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubUnit, setEditingSubUnit] = useState(null);

  // State untuk pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Menggunakan custom hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { bidangList, fetchBidangList } = useBidangData();
  const { unitList, loadingUnits, fetchUnitList } = useUnitData();

  // Effect untuk mengambil daftar bidang saat komponen dimuat
  useEffect(() => {
    fetchBidangList();
  }, [fetchBidangList]);

  // Effect untuk mengambil daftar unit ketika bidang berubah
  useEffect(() => {
    fetchUnitList(selectedBidang);
    setSelectedUnit(""); // Reset pilihan unit ketika bidang berubah
  }, [selectedBidang, fetchUnitList]);

  // Effect untuk mereset paginasi ketika filter berubah
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearchTerm, selectedBidang, selectedUnit]);

  // Effect untuk mengambil data sub unit utama
  useEffect(() => {
    const fetchSubUnitData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
        });

        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }
        if (selectedUnit) {
          params.append("unit_id", selectedUnit);
        } else if (selectedBidang) {
          // Jika hanya bidang dipilih, kirim bidang_id untuk filter di backend
          params.append("bidang_id", selectedBidang);
        }

        const response = await api.get(
          `/klasifikasi-instansi/subunit?${params.toString()}`
        );

        setSubUnitData(response.data.data);
        setTotalRows(response.data.meta.total);
      } catch (error) {
        console.error("Gagal fetch data sub unit:", error);
        setSubUnitData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSubUnitData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedUnit,
    selectedBidang,
    refreshTrigger,
  ]);

  // Event Handlers
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleExport = () => {
    console.log("Exporting sub unit data...");
    // Implementasi ekspor data
  };

  const handleOpenAddModal = () => {
    setEditingSubUnit(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSubUnit(null);
  };

  const handleSaveSubUnit = async (subUnitToSave) => {
    const payload = {
      unit_id: subUnitToSave.unit_id,
      kode_sub_unit: subUnitToSave.kode_sub_unit,
      nama_sub_unit: subUnitToSave.nama_sub_unit,
      kode: subUnitToSave.kode,
    };

    try {
      if (subUnitToSave.id) {
        await api.patch(
          `/klasifikasi-instansi/subunit/${subUnitToSave.id}`,
          payload
        );
        alert("Data Sub Unit berhasil diperbarui!");
      } else {
        await api.post("/klasifikasi-instansi/subunit", payload);
        alert("Data Sub Unit berhasil ditambahkan!");
      }
      handleRefresh();
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
      // Ambil data terbaru dari server untuk memastikan data akurat
      const response = await api.get(`/klasifikasi-instansi/subunit/${id}`);
      const dataToEdit = response.data.data;

      // Siapkan data untuk modal, termasuk ID induknya
      const mappedForEdit = {
        id: dataToEdit.id,
        unit_id: dataToEdit.unit_id,
        bidang_id: dataToEdit.unit?.bidang_id || "",
        kode_sub_unit: dataToEdit.kode_sub_unit,
        nama_sub_unit: dataToEdit.nama_sub_unit,
        kode: dataToEdit.kode,
      };

      setEditingSubUnit(mappedForEdit);
      setIsAddModalOpen(true);
    } catch (error) {
      console.error("Gagal mengambil data sub unit untuk diedit:", error);
      alert("Gagal memuat data untuk diedit.");
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/klasifikasi-instansi/subunit/${id}`);
      console.log("Berhasil menghapus sub unit dengan ID:", id);

      Swal.fire({
        title: "Berhasil!",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      handleRefresh(); // Refresh data
    } catch (error) {
      console.error("Gagal menghapus sub unit:", error);

      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
  };

  // Konfigurasi Kolom DataTable
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
    {
      field: "provinsi",
      headerName: "Provinsi",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const provinsi = params.row.unit?.bidang?.kabupaten_kota?.provinsi;
        return provinsi
          ? `${provinsi.kode_provinsi} - ${provinsi.nama_provinsi}`
          : "N/A";
      },
    },
    {
      field: "kabupaten_kota",
      headerName: "Kabupaten/Kota",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const kabKot = params.row.unit?.bidang?.kabupaten_kota;
        return kabKot
          ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
          : "N/A";
      },
    },
    {
      field: "bidang",
      headerName: "Bidang",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const bidang = params.row.unit?.bidang;
        return bidang ? `${bidang.kode_bidang} - ${bidang.nama_bidang}` : "N/A";
      },
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const unit = params.row.unit;
        return unit ? `${unit.kode_unit} - ${unit.nama_unit}` : "N/A";
      },
    },
    {
      field: "kode_sub_unit",
      headerName: "Kode Sub Unit",
      width: 150,
    },
    {
      field: "nama_sub_unit",
      headerName: "Nama Sub Unit",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "kode",
      headerName: "Kode",
      width: 100,
    },
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
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Sub Unit
            </h1>
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
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
                >
                  <option value="">-- Semua Bidang --</option>
                  {bidangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Unit */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
                  disabled={!selectedBidang || loadingUnits}
                >
                  <option value="">
                    {loadingUnits ? "Memuat..." : "-- Semua Unit --"}
                  </option>
                  {unitList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2 mt-2 md:mt-0">
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
            </div>

            {/* Search Input */}
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <DataTable
            rows={subUnitData}
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
            emptyRowsMessage="Tidak ada data sub unit yang tersedia"
          />
        </div>
      </div>

      {/* Pastikan nama modal dan props sesuai */}
      <AddSubUnitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveSubUnit}
        initialData={editingSubUnit}
      />
    </div>
  );
};

export default SubUnitPage;
