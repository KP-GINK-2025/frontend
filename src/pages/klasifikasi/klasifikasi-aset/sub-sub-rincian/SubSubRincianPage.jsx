import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddSubSubRincianModal from "./AddSubSubRincianModal";
import DataTable from "../../../../components/DataTable";

const SubSubRincianPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [subSubRincianData, setSubSubRincianData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk data filter Aset 1, 2, 3, 4, 5, 6
  const [asetSatuData, setAsetSatuData] = useState([]);
  const [selectedAsetSatu, setSelectedAsetSatu] = useState("");

  const [asetDuaData, setAsetDuaData] = useState([]);
  const [selectedAsetDua, setSelectedAsetDua] = useState("");

  const [asetTigaData, setAsetTigaData] = useState([]);
  const [selectedAsetTiga, setSelectedAsetTiga] = useState("");

  const [asetEmpatData, setAsetEmpatData] = useState([]);
  const [selectedAsetEmpat, setSelectedAsetEmpat] = useState("");

  const [asetLimaData, setAsetLimaData] = useState([]);
  const [selectedAsetLima, setSelectedAsetLima] = useState("");

  const [asetEnamData, setAsetEnamData] = useState([]);
  const [selectedAsetEnam, setSelectedAsetEnam] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubSubRincian, setEditingSubSubRincian] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/klasifikasi-aset/sub-sub-rincian-aset");

      const mappedSubSubRincian = response.data.data.map((item) => {
        return {
          id: item.id,
          aset1: `${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
              ?.kelompok_aset?.akun_aset?.kode_akun_aset || ""
          } - ${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
              ?.kelompok_aset?.akun_aset?.nama_akun_aset || "-"
          }`,

          aset2: `${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
              ?.kelompok_aset?.kode_kelompok_aset || ""
          } - ${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
              ?.kelompok_aset?.nama_kelompok_aset || "-"
          }`,

          aset3: `${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
              ?.kode_jenis_aset || ""
          } - ${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset?.jenis_aset
              ?.nama_jenis_aset || "-"
          }`,

          aset4: `${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset
              ?.kode_objek_aset || ""
          } - ${
            item.sub_rincian_aset?.rincian_objek_aset?.objek_aset
              ?.nama_objek_aset || "-"
          }`,

          aset5: `${
            item.sub_rincian_aset?.rincian_objek_aset
              ?.kode_rincian_objek_aset || ""
          } - ${
            item.sub_rincian_aset?.rincian_objek_aset
              ?.nama_rincian_objek_aset || "-"
          }`,

          aset6: `${item.sub_rincian_aset?.kode_sub_rincian_aset || ""} - ${
            item.sub_rincian_aset?.nama_sub_rincian_aset || "-"
          }`,
          kodeAset7: item.kode_sub_sub_rincian_aset,
          namaAset7: item.nama_sub_sub_rincian_aset,
          kode: item.kode,
        };
      });
      setSubSubRincianData(mappedSubSubRincian);

      // Kumpulkan opsi filter aset 1–6
      const aset1Set = new Set();
      const aset2Set = new Set();
      const aset3Set = new Set();
      const aset4Set = new Set();
      const aset5Set = new Set();
      const aset6Set = new Set();

      mappedSubSubRincian.forEach((item) => {
        aset1Set.add(item.aset1);
        aset2Set.add(item.aset2);
        aset3Set.add(item.aset3);
        aset4Set.add(item.aset4);
        aset5Set.add(item.aset5);
        aset6Set.add(item.aset6);
      });

      // Simpan ke state
      setAsetSatuData(
        [...aset1Set].map((v, i) => ({ id: i + 1, namaAset: v }))
      );
      setAsetDuaData(
        [...aset2Set].map((v, i) => ({ id: i + 1, namaAset2: v }))
      );
      setAsetTigaData(
        [...aset3Set].map((v, i) => ({ id: i + 1, namaAset3: v }))
      );
      setAsetEmpatData(
        [...aset4Set].map((v, i) => ({ id: i + 1, namaAset4: v }))
      );
      setAsetLimaData(
        [...aset5Set].map((v, i) => ({ id: i + 1, namaAset5: v }))
      );
      setAsetEnamData(
        [...aset6Set].map((v, i) => ({ id: i + 1, namaAset6: v }))
      );

      // Data utama untuk tabel
      setSubSubRincianData(mappedSubSubRincian);
    } catch (error) {
      console.error("Gagal fetch data sub sub rincian aset:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = subSubRincianData.filter((item) => {
    const matchesSearch =
      item.aset1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset3?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset4?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset5?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.aset6?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeAset7?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaAset7?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAsetSatu =
      selectedAsetSatu === "" || item.aset1 === selectedAsetSatu;
    const matchesAsetDua =
      selectedAsetDua === "" || item.aset2 === selectedAsetDua;
    const matchesAsetTiga =
      selectedAsetTiga === "" || item.aset3 === selectedAsetTiga;
    const matchesAsetEmpat =
      selectedAsetEmpat === "" || item.aset4 === selectedAsetEmpat;
    const matchesAsetLima =
      selectedAsetLima === "" || item.aset5 === selectedAsetLima;
    const matchesAsetEnam =
      selectedAsetEnam === "" || item.aset6 === selectedAsetEnam;

    return (
      matchesSearch &&
      matchesAsetSatu &&
      matchesAsetDua &&
      matchesAsetTiga &&
      matchesAsetEmpat &&
      matchesAsetLima &&
      matchesAsetEnam
    );
  });

  const handleExport = () => {
    console.log("Exporting sub sub rincian data...");
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedAsetSatu("");
    setSelectedAsetDua("");
    setSelectedAsetTiga("");
    setSelectedAsetEmpat("");
    setSelectedAsetLima("");
    setSelectedAsetEnam("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingSubSubRincian(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSubSubRincian(null);
  };

  const handleSaveNewSubSubRincian = (subSubRincianToSave) => {
    if (subSubRincianToSave.id) {
      setSubSubRincianData((prevData) =>
        prevData.map((item) =>
          item.id === subSubRincianToSave.id ? subSubRincianToSave : item
        )
      );
      console.log("Update Sub Sub Rincian:", subSubRincianToSave);
    } else {
      setSubSubRincianData((prevData) => [
        ...prevData,
        { id: Date.now(), ...subSubRincianToSave },
      ]);
      console.log("Menyimpan Sub Sub Rincian baru:", subSubRincianToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const subSubRincianToEdit = subSubRincianData.find(
      (item) => item.id === id
    );
    if (subSubRincianToEdit) {
      setEditingSubSubRincian(subSubRincianToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setSubSubRincianData((prevData) =>
        prevData.filter((item) => item.id !== id)
      );
      console.log("Menghapus Sub Sub Rincian dengan ID:", id);
    }
  };

  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 50,
      sortable: false,
      renderCell: (params) => {
        const index = subSubRincianData.findIndex(
          (row) => row.id === params.row.id
        );
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    { field: "aset1", headerName: "Aset 1", width: 100 },
    { field: "aset2", headerName: "Aset 2", width: 150 },
    { field: "aset3", headerName: "Aset 3", width: 150 },
    { field: "aset4", headerName: "Aset 4", width: 150 },
    { field: "aset5", headerName: "Aset 5", width: 150 },
    { field: "aset6", headerName: "Aset 6", width: 150 },
    {
      field: "kodeAset7",
      headerName: "Kode Aset 7",
      width: 150,
    },
    { field: "namaAset7", headerName: "Nama Aset 7", flex: 1 },
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
          {/* Judul H1 dan Tombol Aksi (Refresh, Add) */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Daftar Klasifikasi Aset 7
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
                <Plus size={16} /> Add Sub Sub Rincian
                {/* Mengganti 'Add Sub Sub Rincian' agar konsisten dengan Aset X */}
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

          {/* DataTable Component */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No Sub Sub Rincian data available"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>
      <AddSubSubRincianModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewSubSubRincian}
        initialData={editingSubSubRincian}
      />
    </div>
  );
};

export default SubSubRincianPage;
