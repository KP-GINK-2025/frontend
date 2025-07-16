import React, { useState, useEffect, useCallback } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import AddUnitModal from "./AddUnitModal";

const UnitPage = () => {
  // State declarations
  const [searchTerm, setSearchTerm] = useState("");
  const [unitData, setUnitData] = useState([]);
  const [bidangList, setBidangList] = useState([]);
  const [selectedBidang, setSelectedBidang] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Fetch bidang list
  const fetchBidangList = async () => {
    try {
      const res = await api.get("/klasifikasi-instansi/bidang", {
        params: { per_page: 100 },
      });

      const sorted = res.data.data
        .map((b) => ({
          id: b.id,
          kode_bidang: b.kode_bidang,
          nama_bidang: b.nama_bidang,
        }))
        .sort((a, b) => a.kode_bidang - b.kode_bidang);

      setBidangList(sorted);
    } catch (err) {
      console.error("Gagal fetch bidang list:", err);
    }
  };

  // Fetch unit data with memoization
  const fetchData = useCallback(
    async (
      currentPaginationModel = paginationModel,
      currentSearchTerm = searchTerm,
      bidangFilter = selectedBidang
    ) => {
      setLoading(true);

      try {
        const response = await api.get("/klasifikasi-instansi/unit", {
          params: {
            page: currentPaginationModel.page + 1,
            per_page: currentPaginationModel.pageSize,
            search: currentSearchTerm,
            bidang_id: bidangFilter || undefined,
          },
        });

        const mappedData = response.data.data.map((item) => ({
          ...item,
          nama_unit: item.nama_unit || item.namaUnit,
          kode_unit: item.kode_unit || item.kodeUnit,
          bidang:
            item.bidang?.kode_bidang && item.bidang?.nama_bidang
              ? `${item.bidang.kode_bidang} - ${item.bidang.nama_bidang}`
              : "-",
        }));

        setUnitData(mappedData);
        setTotalRows(response.data.meta.total);
      } catch (error) {
        console.error("Gagal fetch data unit:", error);
      } finally {
        setLoading(false);
      }
    },
    [paginationModel, searchTerm, selectedBidang]
  );

  // Initial data fetch
  useEffect(() => {
    fetchBidangList();
    fetchData();
  }, [fetchData]);

  // Reset pagination when search term changes
  useEffect(() => {
    setPaginationModel((prev) =>
      prev.page === 0 ? prev : { ...prev, page: 0 }
    );
  }, [searchTerm]);

  // Reset pagination when bidang filter changes
  useEffect(() => {
    setPaginationModel((prev) =>
      prev.page === 0 ? prev : { ...prev, page: 0 }
    );
  }, [selectedBidang]);

  // Event handlers
  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedBidang("");
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
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
    try {
      if (unitToSave.id) {
        await api.put(
          `/klasifikasi-instansi/unit/${unitToSave.id}`,
          unitToSave
        );
      } else {
        await api.post("/klasifikasi-instansi/unit", unitToSave);
      }
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan unit:", error);
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
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus unit:", error);
    }
  };

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPaginationModel({ page: 0, pageSize: newPageSize });
  };

  // Column definitions
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = unitData.findIndex((row) => row.id === params.row.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    {
      field: "bidang",
      headerName: "Bidang",
      flex: 1,
    },
    {
      field: "kode_unit",
      headerName: "Kode Unit",
      width: 120,
    },
    {
      field: "nama_unit",
      headerName: "Nama Unit",
      flex: 1,
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
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(params.row.id)}
            className="text-red-600 hover:text-red-800 text-sm"
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

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Bidang Filter */}
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-semibold">Bidang</span>
                <select
                  value={selectedBidang}
                  onChange={(e) => setSelectedBidang(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-auto"
                >
                  <option value="">-- Pilih Bidang --</option>
                  {bidangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.kode_bidang} - {b.nama_bidang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Entries */}
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <span className="text-gray-600 text-sm">Show</span>
                <select
                  value={paginationModel.pageSize}
                  onChange={handlePageSizeChange}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {[5, 10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span className="text-gray-600 text-sm">entries</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64 flex items-center gap-2">
              <Search className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data Table */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              key={`datatable-${paginationModel.page}-${paginationModel.pageSize}-${searchTerm}-${selectedBidang}`}
              rows={unitData}
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No Unit data available"
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              rowCount={totalRows}
              paginationMode="server"
              initialState={{
                pagination: {
                  paginationModel: paginationModel,
                },
              }}
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
            />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
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
