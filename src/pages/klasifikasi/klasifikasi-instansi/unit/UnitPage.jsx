import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import AddUnitModal from "./AddUnitModal";

const UnitPage = () => {
  // State untuk data dan UI
  const [unitData, setUnitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [bidangList, setBidangList] = useState([]);

  // State untuk modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // State untuk paginasi dan refresh
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // EFEK 1: Debounce input pencarian
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // EFEK 2: Reset halaman ke 0 jika ada filter atau pencarian baru
  useEffect(() => {
    // Cek jika ada search term atau filter bidang yang aktif, reset paginasi
    if (debouncedSearchTerm || selectedBidang) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, selectedBidang]);

  // EFEK 3: Fetch data statis (seperti daftar bidang) HANYA SEKALI
  useEffect(() => {
    const fetchBidangList = async () => {
      try {
        const res = await api.get("/klasifikasi-instansi/bidang", {
          params: { per_page: 1000 },
        });

        const sorted = res.data.data
          .map((b) => ({
            id: b.id,
            kode_bidang: b.kode_bidang,
            nama_bidang: b.nama_bidang,
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
    };
    fetchBidangList();
  }, []); // <-- Dependency kosong, hanya berjalan sekali saat mount

  // EFEK 4: Fetch data utama (unit) setiap kali ada perubahan
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: paginationModel.page + 1,
          per_page: paginationModel.pageSize,
        });
        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }
        if (selectedBidang) {
          params.append("bidang_id", selectedBidang);
        }

        const response = await api.get(
          `/klasifikasi-instansi/unit?${params.toString()}`
        );

        // Mapping data tetap di sini jika diperlukan
        setUnitData(response.data.data);
        setTotalRows(response.data.meta.total);
      } catch (error) {
        console.error("Gagal fetch data unit:", error);
        setUnitData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paginationModel, debouncedSearchTerm, selectedBidang, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger((c) => c + 1);
  };

  const handleExport = () => {
    console.log("Exporting unit data...");
  };

  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUnit(null);
  };

  const handleSaveNewUnit = async (unitToSave) => {
    const payload = {
      bidang_id: unitToSave.bidang_id,
      kode_unit: unitToSave.kode_unit,
      nama_unit: unitToSave.nama_unit,
      kode: unitToSave.kode,
    };
    try {
      if (unitToSave.id) {
        await api.patch(`/klasifikasi-instansi/unit/${unitToSave.id}`, payload);
        alert("Data unit berhasil diperbarui!");
      } else {
        await api.post("/klasifikasi-instansi/unit", payload);
        alert("Data unit berhasil ditambahkan!");
      }
      handleRefresh();
    } catch (error) {
      console.error(
        "Gagal menyimpan unit:",
        error.response?.data || error.message
      );
      alert("Gagal menyimpan unit. Cek console untuk detail.");
    } finally {
      handleCloseAddModal();
    }
  };

  const handleEditClick = (id) => {
    const unitToEdit = unitData.find((item) => item.id === id);
    if (unitToEdit) {
      setEditingUnit(unitToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await api.delete(`/klasifikasi-instansi/unit/${id}`);
      handleRefresh(); // <-- Panggil handleRefresh agar konsisten
    } catch (error) {
      console.error("Gagal menghapus unit:", error);
    }
  };

  const columns = [
    {
      field: "bidang",
      headerName: "Bidang",
      flex: 1,
      minWidth: 250,
      // Ganti valueGetter dengan renderCell untuk pengecekan yang lebih aman
      renderCell: (params) => {
        // Cek dulu apakah objek 'bidang' ada di dalam baris data
        if (params.row && params.row.bidang) {
          return `${params.row.bidang.kode_bidang} - ${params.row.bidang.nama_bidang}`;
        }
        // Jika tidak ada, tampilkan fallback text
        return "N/A";
      },
    },
    { field: "kode_unit", headerName: "Kode Unit", width: 120 },
    { field: "nama_unit", headerName: "Nama Unit", flex: 1, minWidth: 250 },
    { field: "kode", headerName: "Kode", width: 100 },
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
            <h1 className="text-2xl font-bold text-gray-800">Daftar Unit</h1>
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
                <Plus size={16} /> Add Unit
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            {/* Kiri: Filter */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Filter Bidang */}
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-semibold">Bidang</span>
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto"
                >
                  <option value="">-- Semua Bidang --</option>
                  {bidangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.kode_bidang} - {b.nama_bidang}
                    </option>
                  ))}
                </select>
              </div>
              {/* Show entries */}
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
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {[5, 10, 25, 50, 75, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-gray-600 text-sm">entries</span>
              </div>
            </div>
            {/* Kanan: Search */}
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
            rows={unitData}
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
            emptyRowsMessage="Tidak ada data unit yang tersedia"
          />
        </div>
      </div>
      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewUnit}
        initialData={editingUnit}
      />
    </div>
  );
};

export default UnitPage;
