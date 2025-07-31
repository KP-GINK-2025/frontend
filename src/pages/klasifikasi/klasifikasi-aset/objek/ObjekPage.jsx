import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddObjekModal from "./AddObjekModal";
import DataTable from "../../../../components/DataTable";
import Swal from "sweetalert2";
import { handleExport } from "../../../../handlers/exportHandler"; // Konsisten: Import handleExport

const ObjekPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [objekData, setObjekData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [exporting, setExporting] = useState(false); // State untuk status exporting

  // State untuk data filter Aset 1 2 3
  const [asetSatuData, setAsetSatuData] = useState([]);
  const [selectedAsetSatu, setSelectedAsetSatu] = useState("");

  const [asetDuaData, setAsetDuaData] = useState([]);
  const [selectedAsetDua, setSelectedAsetDua] = useState("");

  const [asetTigaData, setAsetTigaData] = useState([]);
  const [selectedAsetTiga, setSelectedAsetTiga] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingObjek, setEditingObjek] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = async () => {
    setLoading(true);
    setRefreshing(true); // Spinner aktif juga saat fetch pertama kali
    try {
      const response = await api.get("/klasifikasi-aset/objek-aset");
      const mappedObjek = response.data.data.map((item) => ({
        id: item.id,
        aset1: item.jenis_aset?.kelompok_aset?.akun_aset
          ? `${item.jenis_aset.kelompok_aset.akun_aset.kode_akun_aset} - ${item.jenis_aset.kelompok_aset.akun_aset.nama_akun_aset}`
          : "-",
        aset2: item.jenis_aset?.kelompok_aset
          ? `${item.jenis_aset.kelompok_aset.kode_kelompok_aset} - ${item.jenis_aset.kelompok_aset.nama_kelompok_aset}`
          : "-",
        aset3: item.jenis_aset
          ? `${item.jenis_aset.kode_jenis_aset} - ${item.jenis_aset.nama_jenis_aset}`
          : "-",
        kodeAset4: item.kode_objek_aset,
        namaAset4: item.nama_objek_aset,
        kode: item.kode,
      }));

      setObjekData(mappedObjek);

      // Dropdown filter
      const asetSatuSet = new Set();
      const asetDuaSet = new Set();
      const asetTigaSet = new Set();

      mappedObjek.forEach((item) => {
        asetSatuSet.add(item.aset1);
        asetDuaSet.add(item.aset2);
        asetTigaSet.add(item.aset3);
      });

      setAsetSatuData(
        [...asetSatuSet].map((v, i) => ({ id: i + 1, namaAset: v }))
      );
      setAsetDuaData(
        [...asetDuaSet].map((v, i) => ({ id: i + 1, namaAset2: v }))
      );
      setAsetTigaData(
        [...asetTigaSet].map((v, i) => ({ id: i + 1, namaAset3: v }))
      );
    } catch (error) {
      console.error("Gagal fetch data aset 4:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Matikan spinner setelah data selesai di-load
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const filteredData = objekData.filter((item) => {
    const matchesSearch =
      item.aset1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeAset4?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaAset4?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAsetSatu =
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu;
    const matchesAsetDua =
      selectedAsetDua === "" || item.aset2 === selectedAsetDua;
    const matchesAsetTiga =
      selectedAsetTiga === "" || item.aset3 === selectedAsetTiga;

    return (
      matchesSearch && matchesAsetSatu && matchesAsetDua && matchesAsetTiga
    );
  });

  // Fetch all data for export, applying current filters
  const fetchAllDataForExport = async () => {
    try {
      const response = await api.get("/klasifikasi-aset/objek-aset");
      const mappedObjek = response.data.data.map((item) => ({
        id: item.id,
        aset1: item.jenis_aset?.kelompok_aset?.akun_aset
          ? `${item.jenis_aset.kelompok_aset.akun_aset.kode_akun_aset} - ${item.jenis_aset.kelompok_aset.akun_aset.nama_akun_aset}`
          : "-",
        aset2: item.jenis_aset?.kelompok_aset
          ? `${item.jenis_aset.kelompok_aset.kode_kelompok_aset} - ${item.jenis_aset.kelompok_aset.nama_kelompok_aset}`
          : "-",
        aset3: item.jenis_aset
          ? `${item.jenis_aset.kode_jenis_aset} - ${item.jenis_aset.nama_jenis_aset}`
          : "-",
        kodeAset4: item.kode_objek_aset,
        namaAset4: item.nama_objek_aset,
        kode: item.kode,
      }));

      // Apply same filtering logic as the display
      return mappedObjek.filter((item) => {
        const matchesSearch =
          item.aset1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.aset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.aset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.kodeAset4?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.namaAset4?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.kode?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAsetSatu =
          selectedAsetSatu === "" || item.aset1 === selectedAsetSatu;
        const matchesAsetDua =
          selectedAsetDua === "" || item.aset2 === selectedAsetDua;
        const matchesAsetTiga =
          selectedAsetTiga === "" || item.aset3 === selectedAsetTiga;

        return (
          matchesSearch && matchesAsetSatu && matchesAsetDua && matchesAsetTiga
        );
      });
    } catch (error) {
      console.error("Gagal mengambil data untuk export:", error);
      return [];
    }
  };

  const handleExportData = async () => {
    const exportColumns = [
      {
        field: "no",
        headerName: "No",
      },
      {
        field: "aset1",
        headerName: "Aset 1",
      },
      {
        field: "aset2",
        headerName: "Aset 2",
      },
      {
        field: "aset3",
        headerName: "Aset 3",
      },
      {
        field: "kodeAset4",
        headerName: "Kode Aset 4",
      },
      {
        field: "namaAset4",
        headerName: "Nama Aset 4",
      },
      {
        field: "kode",
        headerName: "Kode",
      },
    ];

    const exportConfig = {
      fetchDataFunction: fetchAllDataForExport,
      columns: exportColumns,
      filename: "klasifikasi-aset-objek",
      sheetName: "Aset 4",
      setExporting,
    };

    await handleExport(exportConfig);
  };

  // Ubah handleRefresh agar ada animasi, SweetAlert2, dan loading table
  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    try {
      setSearchTerm("");
      setSelectedAsetSatu("");
      setSelectedAsetDua("");
      setSelectedAsetTiga("");
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
    setEditingObjek(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingObjek(null);
  };

  const handleSaveNewObjek = (objekToSave) => {
    if (objekToSave.id) {
      setObjekData((prevData) =>
        prevData.map((item) =>
          item.id === objekToSave.id ? objekToSave : item
        )
      );
      console.log("Update Objek:", objekToSave);
    } else {
      setObjekData((prevData) => [
        ...prevData,
        { id: Date.now(), ...objekToSave },
      ]);
      console.log("Menyimpan Objek baru:", objekToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const objekToEdit = objekData.find((item) => item.id === id);
    if (objekToEdit) {
      setEditingObjek(objekToEdit);
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

    if (result.isConfirmed) {
      setObjekData((prevData) => prevData.filter((item) => item.id !== id));
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
      console.log("Menghapus Objek dengan ID:", id);
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
        const index = objekData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    { field: "aset1", headerName: "Aset 1", width: 200 },
    { field: "aset2", headerName: "Aset 2", width: 200 },
    { field: "aset3", headerName: "Aset 3", width: 200 },
    {
      field: "kodeAset4",
      headerName: "Kode Aset 4",
      width: 150,
    },
    { field: "namaAset4", headerName: "Nama Aset 4", flex: 1 },
    { field: "kode", headerName: "Kode", width: 150 },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExportData} // Menggunakan handleExportData
            disabled={exporting} // Menonaktifkan tombol saat exporting
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} className={exporting ? "animate-spin" : ""} />{" "}
            {/* Spinner saat exporting */}
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header dan Tombol Aksi (Refresh, Add) */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Klasifikasi Aset 4
            </h1>
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
                <Plus size={16} /> Add Objek
              </button>
            </div>
          </div>

          {/* Show entries + Search Box */}
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

      <AddObjekModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewObjek}
        initialData={editingObjek}
      />
    </div>
  );
};

export default ObjekPage;
