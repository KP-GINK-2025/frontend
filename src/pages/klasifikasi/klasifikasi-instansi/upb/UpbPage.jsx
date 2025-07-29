import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import AddUpbModal from "./AddUpbModal";
import Swal from "sweetalert2";

const UpbPage = () => {
  const [upbData, setUpbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [bidangList, setBidangList] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitList, setUnitList] = useState([]);
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [subUnitList, setSubUnitList] = useState([]);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUpb, setEditingUpb] = useState(null);

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    if (
      debouncedSearchTerm ||
      selectedBidang ||
      selectedUnit ||
      selectedSubUnit
    ) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, selectedBidang, selectedUnit, selectedSubUnit]);

  // Fetch bidang list (static data)
  useEffect(() => {
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
      }
    };

    fetchBidangList();
  }, []);

  useEffect(() => {
    const fetchUnitList = async () => {
      try {
        const response = await api.get("/klasifikasi-instansi/unit", {
          params: { per_page: 1000 },
        });

        const sortedUnit = response.data.data
          .map((unit) => ({
            id: unit.id,
            kode_unit: unit.kode_unit,
            nama_unit: unit.nama_unit,
          }))
          .sort((a, b) =>
            a.kode_unit.localeCompare(b.kode_unit, undefined, {
              numeric: true,
            })
          );

        setUnitList(sortedUnit);
      } catch (error) {
        console.error("Gagal mendapatkan unit list:", error);
      }
    };

    fetchUnitList();
  }, []);

  useEffect(() => {
    const fetchSubUnitList = async () => {
      try {
        const response = await api.get("/klasifikasi-instansi/subunit", {
          params: { per_page: 1000 },
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
      }
    };

    fetchSubUnitList();
  }, []);

  // Fetch upb data
  useEffect(() => {
    const fetchUpbData = async () => {
      setLoading(true);
      setRefreshing(true); // Spinner aktif juga saat fetch pertama kali
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

        if (selectedUnit) {
          params.append("unit_id", selectedUnit);
        }

        if (selectedSubUnit) {
          params.append("sub_unit_id", selectedSubUnit);
        }

        const response = await api.get(
          `/klasifikasi-instansi/upb?${params.toString()}`
        );

        setUpbData(response.data.data);
        setTotalRows(response.data.meta.total);
      } catch (error) {
        console.error("Gagal mendapatkan upb data:", error);
        setUpbData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
        setRefreshing(false); // Matikan spinner setelah data selesai di-load
      }
    };

    fetchUpbData();
  }, [
    paginationModel,
    debouncedSearchTerm,
    selectedBidang,
    selectedUnit,
    selectedSubUnit,
    refreshTrigger,
  ]);

  // Event handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      setSearchTerm(""); // Reset pencarian
      setSelectedBidang(""); // Reset filter bidang
      setSelectedUnit(""); // Reset filter unit
      setSelectedSubUnit(""); // Reset filter sub unit
      setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset halaman
      setRefreshTrigger((prev) => prev + 1);

      // Simulasi delay agar animasi terlihat
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

  const handleExport = () => {
    console.log("Exporting subunit data...");
  };

  const handleOpenAddModal = () => {
    setEditingUpb(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingUpb(null);
  };

  const handleSaveUpb = async (upbToSave) => {
    const payload = {
      sub_unit_id: upbToSave.sub_unit_id,
      kode_upb: upbToSave.kode_upb,
      nama_upb: upbToSave.nama_upb,
      kode: upbToSave.kode,
    };

    try {
      if (upbToSave.id) {
        await api.patch(`/klasifikasi-instansi/upb/${upbToSave.id}`, payload);
        Swal.fire({
          title: "Berhasil Edit",
          text: "Data berhasil diubah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/klasifikasi-instansi/upb", payload);
        Swal.fire({
          title: "Berhasil Add",
          text: "Data berhasil ditambah.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      handleRefresh();
      handleCloseAddModal();
    } catch (error) {
      console.error("Gagal simpan upb:", error.response?.data || error.message);
      Swal.fire({
        title: "Gagal",
        text: "Data tidak dapat disimpan.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleEditClick = (id) => {
    const upbToEdit = upbData.find((item) => item.id === id);
    if (upbToEdit) {
      setEditingUpb(upbToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/klasifikasi-instansi/upb/${id}`);
      console.log("Berhasil menghapus upb dengan ID:", id);
      Swal.fire({
        title: "Berhasil Delete",
        text: "Data berhasil dihapus.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleRefresh();
    } catch (error) {
      console.error("Gagal menghapus upb:", error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
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
        const index = upbData.findIndex((row) => row.id === params.row.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const provinsi =
          params.row.sub_unit?.unit?.bidang?.kabupaten_kota?.provinsi;
        return provinsi
          ? `${provinsi.kode_provinsi} - ${provinsi.nama_provinsi}`
          : "N/A";
      },
    },
    {
      field: "kabupaten_kota",
      headerName: "Kabupaten/Kota",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const kabKot = params.row.sub_unit?.unit?.bidang?.kabupaten_kota;
        return kabKot
          ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
          : "N/A";
      },
    },
    {
      field: "bidang",
      headerName: "Bidang",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const bidang = params.row.sub_unit?.unit?.bidang;
        return bidang ? `${bidang.kode_bidang} - ${bidang.nama_bidang}` : "N/A";
      },
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const unit = params.row.sub_unit?.unit;
        return unit ? `${unit.kode_unit} - ${unit.nama_unit}` : "N/A";
      },
    },
    {
      field: "sub_unit",
      headerName: "Sub Unit",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const subUnit = params.row.sub_unit;
        return subUnit
          ? `${subUnit.kode_sub_unit} - ${subUnit.nama_sub_unit}`
          : "N/A";
      },
    },
    {
      field: "kode_upb",
      headerName: "Kode UPB",
      width: 150,
    },
    {
      field: "nama_upb",
      headerName: "Nama UPB",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "kode",
      headerName: "Kode",
      width: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar UPB</h1>
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
                <Plus size={16} /> Add UPB
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            {/* Left: Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
              {/* Bidang Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
                >
                  <option value="">-- Semua Bidang --</option>
                  {bidangList.map((bidang) => (
                    <option key={bidang.id} value={bidang.id}>
                      {bidang.kode_bidang} - {bidang.nama_bidang}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
              >
                <option value="">-- Semua Unit --</option>
                {unitList.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.kode_unit} - {unit.nama_unit}
                  </option>
                ))}
              </select>
              <select
                value={selectedSubUnit}
                onChange={(e) => setSelectedSubUnit(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer"
              >
                <option value="">-- Semua Sub Unit --</option>
                {subUnitList.map((subUnit) => (
                  <option key={subUnit.id} value={subUnit.id}>
                    {subUnit.kode_sub_unit} - {subUnit.nama_sub_unit}
                  </option>
                ))}
              </select>

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

            {/* Right: Search */}
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            rows={upbData}
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
            emptyRowsMessage="Tidak ada data tersedia"
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddUpbModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveUpb}
        initialData={editingUpb}
      />
    </div>
  );
};

export default UpbPage;
