import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddJenisModal from "./AddJenisModal";
import DataTable from "../../../../components/DataTable";
import Swal from "sweetalert2"; // <-- Tambahkan import ini

const JenisPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [jenisData, setJenisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  // State untuk data filter Aset 1 dan Aset 2
  const [asetSatuData, setAsetSatuData] = useState([]);
  const [selectedAsetSatu, setSelectedAsetSatu] = useState("");
  const [asetDuaData, setAsetDuaData] = useState([]);
  const [selectedAsetDua, setSelectedAsetDua] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJenis, setEditingJenis] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = async () => {
    setLoading(true);
    setRefreshing(true); // Spinner aktif juga saat fetch pertama kali
    try {
      const response = await api.get("/klasifikasi-aset/jenis-aset");

      const mappedJenis = response.data.data.map((item) => ({
        id: item.id,
        aset1: item.kelompok_aset?.akun_aset
          ? `${item.kelompok_aset.akun_aset.kode_akun_aset} - ${item.kelompok_aset.akun_aset.nama_akun_aset}`
          : "-",
        aset2: item.kelompok_aset
          ? `${item.kelompok_aset.kode_kelompok_aset} - ${item.kelompok_aset.nama_kelompok_aset}`
          : "-",
        kodeAset3: item.kode_jenis_aset,
        namaAset3: item.nama_jenis_aset,
        kode: item.kode,
      }));

      setJenisData(mappedJenis);

      // Isi filter aset 1 & 2
      const asetSatuSet = new Set();
      const asetDuaSet = new Set();

      mappedJenis.forEach((item) => {
        asetSatuSet.add(item.aset1);
        asetDuaSet.add(item.aset2);
      });

      setAsetSatuData(
        [...asetSatuSet].map((v, i) => ({ id: i + 1, namaAset: v }))
      );
      setAsetDuaData(
        [...asetDuaSet].map((v, i) => ({ id: i + 1, namaAset2: v }))
      );
    } catch (error) {
      console.error("Gagal fetch data jenis:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Matikan spinner setelah data selesai di-load
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const filteredData = jenisData.filter((item) => {
    const matchesSearch =
      item.aset1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeAset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaAset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAsetSatu =
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu;
    const matchesAsetDua =
      selectedAsetDua === "" || item.aset2 === selectedAsetDua;

    return matchesSearch && matchesAsetSatu && matchesAsetDua;
  });

  const handleExport = () => {
    console.log("Exporting jenis data...");
  };

  // Ubah handleRefresh agar ada animasi, SweetAlert2, dan loading table
  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    try {
      setSearchTerm("");
      setSelectedAsetSatu("");
      setSelectedAsetDua("");
      setDataTablePaginationModel((prev) => ({
        ...prev,
        page: 0,
      }));
      // Simulasi delay agar animasi terlihat
      await new Promise((resolve) => setTimeout(resolve, 800));
      await fetchData();
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
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingJenis(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingJenis(null);
  };

  const handleSaveNewJenis = (jenisToSave) => {
    if (jenisToSave.id) {
      setJenisData((prevData) =>
        prevData.map((item) =>
          item.id === jenisToSave.id ? jenisToSave : item
        )
      );
      console.log("Update Jenis:", jenisToSave);
    } else {
      setJenisData((prevData) => [
        ...prevData,
        { id: Date.now(), ...jenisToSave },
      ]);
      console.log("Menyimpan Jenis baru:", jenisToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const jenisToEdit = jenisData.find((item) => item.id === id);
    if (jenisToEdit) {
      setEditingJenis(jenisToEdit);
      setIsAddModalOpen(true);
    }
  };

  // Tambahkan SweetAlert2 pada tombol delete
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

    if (result.isConfirmed) {
      setJenisData((prevData) => prevData.filter((item) => item.id !== id));
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil dihapus.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      console.log("Menghapus Jenis dengan ID:", id);
    }
  };

  // Data kolom untuk MUI DataGrid
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
        const index = jenisData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    { field: "aset1", headerName: "Aset 1", width: 200 },
    { field: "aset2", headerName: "Aset 2", width: 200 },
    {
      field: "kodeAset3",
      headerName: "Kode Aset 3",
      width: 150,
    },
    { field: "namaAset3", headerName: "Nama Aset 3", flex: 1 },
    { field: "kode", headerName: "Kode", width: 150 },
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
          <div className="flex flex-wrap items-center gap-6 mb-6 justify-between">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Daftar Klasifikasi Aset 3
              </h1>
            </div>
            {/* Tombol di kanan */}
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} /> Add Jenis
              </button>
            </div>
          </div>

          {/* Baris Show entries + Search Box */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {/* Show entries */}
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

            {/* Search Box */}
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* DataTable Component dengan loading */}
          <DataTable
            rows={filteredData}
            columns={columns}
            initialPageSize={entriesPerPage}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
            paginationModel={dataTablePaginationModel}
            onPaginationModelChange={setDataTablePaginationModel}
            loading={loading || refreshing} // <-- Loading table saat loading/refreshing
          />
        </div>
      </div>

      <AddJenisModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewJenis}
        initialData={editingJenis}
      />
    </div>
  );
};

export default JenisPage;
