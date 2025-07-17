import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddKelompokModal from "./AddKelompokModal";
import DataTable from "../../../../components/DataTable";

const KelompokPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [kelompokData, setKelompokData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingKelompok, setEditingKelompok] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: entriesPerPage,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/klasifikasi-aset/kelompok-aset", {
        params: {
          search: searchTerm,
          per_page: entriesPerPage,
        },
      });

      // For now, let's use mock data structure to test the columns
      const data = response.data.data.map((item) => ({
        id: item.id,
        aset1: item.akun_aset
          ? `${item.akun_aset.kode_akun_aset} - ${item.akun_aset.nama_akun_aset}`
          : "-",
        kodeAset2: item.kode_kelompok_aset,
        namaAset2: item.nama_kelompok_aset,
        kode: item.kode,
        kodeKelompok: item.kode_kelompok_aset,
        namaKelompok: item.nama_kelompok_aset,
      }));

      setKelompokData(data);
    } catch (error) {
      console.error("Gagal mengambil data kelompok aset:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, entriesPerPage]);

  const filteredData = kelompokData.filter((item) => {
    const namaAset2 = String(item.namaAset2 || "").toLowerCase();
    const kodeAset2 = String(item.kodeAset2 || "").toLowerCase();
    const kode = String(item.kode || "").toLowerCase();
    const aset1 = String(item.aset1 || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      namaAset2.includes(search) ||
      kodeAset2.includes(search) ||
      kode.includes(search) ||
      aset1.includes(search)
    );
  });

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingKelompok(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingKelompok(null);
  };

  const handleSaveKelompok = async (kelompokToSave) => {
    try {
      if (kelompokToSave.id) {
        // UPDATE
        const response = await api.put(
          `/klasifikasi-aset/kelompok-aset/${kelompokToSave.id}`,
          {
            kode_kelompok_aset:
              kelompokToSave.kodeKelompok || kelompokToSave.kodeAset2,
            nama_kelompok_aset:
              kelompokToSave.namaKelompok || kelompokToSave.namaAset2,
            kode: kelompokToSave.kode,
          }
        );
        console.log("Update sukses:", response.data);
      } else {
        // CREATE
        const response = await api.post("/klasifikasi-aset/kelompok-aset", {
          kode_kelompok_aset:
            kelompokToSave.kodeKelompok || kelompokToSave.kodeAset2,
          nama_kelompok_aset:
            kelompokToSave.namaKelompok || kelompokToSave.namaAset2,
          kode: kelompokToSave.kode,
        });
        console.log("Tambah sukses:", response.data);
      }

      fetchData(); // refresh table setelah simpan
      handleCloseAddModal();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.error("Validasi gagal:", error.response.data.errors);
      } else {
        console.error("Terjadi kesalahan:", error);
      }
    }
  };

  const handleEditClick = (id) => {
    const kelompokToEdit = kelompokData.find((item) => item.id === id);
    if (kelompokToEdit) {
      setEditingKelompok(kelompokToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/klasifikasi-aset/kelompok-aset/${id}`);
        console.log("Kelompok aset berhasil dihapus:", id);
        fetchData(); // refresh data
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  // Data kolom untuk MUI DataGrid
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        const index = kelompokData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    {
      field: "aset1",
      headerName: "Aset 1",
      width: 200,
      renderCell: (params) => <div>{params.row.aset1}</div>,
    },
    {
      field: "kodeAset2",
      headerName: "Kode Aset 2",
      width: 150,
      renderCell: (params) => <div>{params.row.kodeAset2}</div>,
    },
    {
      field: "namaAset2",
      headerName: "Nama Aset 2",
      flex: 1,
      renderCell: (params) => <div>{params.row.namaAset2}</div>,
    },
    {
      field: "kode",
      headerName: "Kode",
      width: 150,
      renderCell: (params) => <div>{params.row.kode}</div>,
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
              Daftar Klasifikasi Aset 2
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
                <Plus size={16} /> Add Kelompok
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setDataTablePaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0,
                  }));
                }}
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

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No Kelompok Aset data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddKelompokModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveKelompok}
        initialData={editingKelompok}
      />
    </div>
  );
};

export default KelompokPage;
