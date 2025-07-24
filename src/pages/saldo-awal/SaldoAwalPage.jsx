import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddNeracaAsetModal from "./AddNeracaAsetModal";
import DataTable from "../../components/DataTable";
import Swal from "sweetalert2";

const SaldoAwalPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1); // Dihapus, karena DataTable yang mengatur pagination

  const [tahunData, setTahunData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [subRincianAsetData, setSubRincianAsetData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [kualifikasiAsetData, setKualifikasiAsetData] = useState([]);
  const [kelompokAsetData, setKelompokAsetData] = useState([]);
  const [jenisAsetData, setJenisAsetData] = useState([]);
  const [objekAsetData, setObjekAsetData] = useState([]);
  const [saldoAwalData, setSaldoAwalData] = useState([]); // Data utama untuk tabel

  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubRincianAset, setSelectedSubRincianAset] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");
  const [selectedKualifikasiAset, setSelectedKualifikasiAset] = useState("");
  const [selectedKelompokAset, setSelectedKelompokAset] = useState("");
  const [selectedJenisAset, setSelectedJenisAset] = useState("");
  const [selectedObjekAset, setSelectedObjekAset] = useState("");

  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSaldoAwal, setEditingSaldoAwal] = useState(null); // State untuk data yang sedang diedit

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      // Dummy data untuk filter
      setTahunData(["2023", "2024", "2025"]);
      setSemesterData([
        { id: 1, nama: "Ganjil" },
        { id: 2, nama: "Genap" },
      ]);
      setSubRincianAsetData([
        { id: 1, nama: "Sub Rincian A" },
        { id: 2, nama: "Sub Rincian B" },
      ]);
      setUnitData([
        { id: 1, nama: "Unit A" },
        { id: 2, nama: "Unit B" },
      ]);
      setSubUnitData([
        { id: 1, nama: "Sub Unit X" },
        { id: 2, nama: "Sub Unit Y" },
      ]);
      setUpbData([
        { id: 1, nama: "UPB 1" },
        { id: 2, nama: "UPB 2" },
      ]);
      setKualifikasiAsetData([
        { id: 1, nama: "Tanah" },
        { id: 2, nama: "Bangunan" },
      ]);
      setKelompokAsetData([
        { id: 1, nama: "Gedung" },
        { id: 2, nama: "Peralatan" },
      ]);
      setJenisAsetData([
        { id: 1, nama: "Meja" },
        { id: 2, nama: "Kursi" },
      ]);
      setObjekAsetData([
        { id: 1, nama: "Komputer" },
        { id: 2, nama: "Laptop" },
      ]);

      // Dummy data untuk Saldo Awal (pastikan ada 'id' dan properti sesuai kolom)
      setSaldoAwalData([
        {
          id: 1,
          tahun: "2024",
          semester: "Ganjil",
          subRincianAset: "Sub Rincian A",
          unit: "Unit A",
          subUnit: "Sub Unit X",
          upb: "UPB 1",
          kualifikasiAset: "Tanah",
          kelompokAset: "Gedung",
          jenisAset: "Meja",
          objekAset: "Komputer",
          jumlahBarang: 10,
          nilaiBarang: 15000000,
        },
        {
          id: 2,
          tahun: "2023",
          semester: "Genap",
          subRincianAset: "Sub Rincian B",
          unit: "Unit B",
          subUnit: "Sub Unit Y",
          upb: "UPB 2",
          kualifikasiAset: "Bangunan",
          kelompokAset: "Peralatan",
          jenisAset: "Kursi",
          objekAset: "Laptop",
          jumlahBarang: 5,
          nilaiBarang: 7500000,
        },
        {
          id: 3,
          tahun: "2024",
          semester: "Ganjil",
          subRincianAset: "Sub Rincian A",
          unit: "Unit A",
          subUnit: "Sub Unit X",
          upb: "UPB 1",
          kualifikasiAset: "Tanah",
          kelompokAset: "Gedung",
          jenisAset: "Meja",
          objekAset: "Komputer",
          jumlahBarang: 3,
          nilaiBarang: 4500000,
        },
      ]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = saldoAwalData.filter((item) => {
    const matchesSearch =
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kualifikasiAset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisAset?.toLowerCase().includes(searchTerm.toLowerCase()) || // Menggunakan jenisAset
      item.objekAset?.toLowerCase().includes(searchTerm.toLowerCase()) || // Menggunakan objekAset
      // Jika ingin mencari di jumlahBarang atau nilaiBarang (sebagai string)
      item.jumlahBarang?.toString().includes(searchTerm.toLowerCase()) ||
      item.nilaiBarang?.toString().includes(searchTerm.toLowerCase());

    const matchesTahun = selectedTahun === "" || item.tahun === selectedTahun;
    const matchesSemester =
      selectedSemester === "" || item.semester === selectedSemester;
    const matchesSubRincianAset =
      selectedSubRincianAset === "" ||
      item.subRincianAset === selectedSubRincianAset;
    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;
    const matchesSubUnit =
      selectedSubUnit === "" || item.subUnit === selectedSubUnit;
    const matchesUpb = selectedUpb === "" || item.upb === selectedUpb;
    const matchesKualifikasiAset =
      selectedKualifikasiAset === "" ||
      item.kualifikasiAset === selectedKualifikasiAset;
    const matchesKelompokAset =
      selectedKelompokAset === "" || item.kelompokAset === selectedKelompokAset;
    const matchesJenisAset =
      selectedJenisAset === "" || item.jenisAset === selectedJenisAset;
    const matchesObjekAset =
      selectedObjekAset === "" || item.objekAset === selectedObjekAset;

    return (
      matchesSearch &&
      matchesTahun &&
      matchesSemester &&
      matchesSubRincianAset &&
      matchesUnit &&
      matchesSubUnit &&
      matchesUpb &&
      matchesKualifikasiAset &&
      matchesKelompokAset &&
      matchesJenisAset &&
      matchesObjekAset
    );
  });

  const handleExport = () => console.log("Exporting Saldo Awal...");

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedTahun("");
    setSelectedSemester("");
    setSelectedSubRincianAset("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSelectedUpb("");
    setSelectedKualifikasiAset("");
    setSelectedKelompokAset("");
    setSelectedJenisAset("");
    setSelectedObjekAset("");
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingSaldoAwal(null); // Reset editing state
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingSaldoAwal(null); // Reset editing state
  };

  const handleSaveNewSaldoAwal = (saldoAwalToSave) => {
    if (saldoAwalToSave.id) {
      // Mode Edit
      setSaldoAwalData((prevData) =>
        prevData.map((item) =>
          item.id === saldoAwalToSave.id ? saldoAwalToSave : item
        )
      );
      console.log("Update Saldo Awal:", saldoAwalToSave);
    } else {
      // Mode Tambah Baru
      setSaldoAwalData((prevData) => [
        ...prevData,
        { id: Date.now(), ...saldoAwalToSave },
      ]);
      console.log("Menyimpan Saldo Awal baru:", saldoAwalToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const saldoAwalToEdit = saldoAwalData.find((item) => item.id === id);
    if (saldoAwalToEdit) {
      setEditingSaldoAwal(saldoAwalToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data saldo awal yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setSaldoAwalData((prevData) =>
          prevData.filter((item) => item.id !== id)
        );
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data saldo awal berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Data kolom untuk MUI DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 }, // ID diperlukan oleh DataTable
    { field: "tahun", headerName: "Tahun", width: 100 },
    { field: "semester", headerName: "Semester", width: 120 },
    { field: "subRincianAset", headerName: "Sub Rincian Aset", width: 180 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "subUnit", headerName: "Sub Unit", width: 150 },
    { field: "upb", headerName: "UPB", width: 120 },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 180 },
    { field: "kelompokAset", headerName: "Kelompok Aset", width: 180 },
    { field: "jenisAset", headerName: "Jenis Aset", width: 150 },
    { field: "objekAset", headerName: "Objek Aset", width: 150 },
    {
      field: "jumlahBarang",
      headerName: "Jumlah Barang",
      type: "number",
      width: 150,
    },
    {
      field: "nilaiBarang",
      headerName: "Nilai Barang",
      type: "number",
      width: 150,
      valueFormatter: (params) => {
        // Format nilaiBarang sebagai mata uang (contoh: Rp 15.000.000)
        if (params.value == null) {
          return "";
        }
        return `Rp ${new Intl.NumberFormat("id-ID").format(params.value)}`;
      },
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

        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Saldo Awal</h1>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={handleOpenAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Add Saldo Awal
              </button>
            </div>
          </div>

          {/* Filter Section - Menggunakan grid untuk dropdown yang banyak */}
          {/* Baris Pertama Filter: Tahun, Semester, Sub Rincian Aset, Unit, Sub Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Tahun -- </option>
              {tahunData.map((tahun, i) => (
                <option key={i} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Semester -- </option>
              {semesterData.map((semester) => (
                <option key={semester.id} value={semester.nama}>
                  {semester.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedSubRincianAset}
              onChange={(e) => setSelectedSubRincianAset(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Sub Rincian Aset -- </option>
              {subRincianAsetData.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Unit -- </option>
              {unitData.map((unit) => (
                <option key={unit.id} value={unit.nama}>
                  {unit.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedSubUnit}
              onChange={(e) => setSelectedSubUnit(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Sub Unit -- </option>
              {subUnitData.map((subUnit) => (
                <option key={subUnit.id} value={subUnit.nama}>
                  {subUnit.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Baris Kedua Filter: UPB, Kualifikasi Aset, Kelompok Aset, Jenis Aset, Objek Aset */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <select
              value={selectedUpb}
              onChange={(e) => setSelectedUpb(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- UPB -- </option>
              {upbData.map((upb) => (
                <option key={upb.id} value={upb.nama}>
                  {upb.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedKualifikasiAset}
              onChange={(e) => setSelectedKualifikasiAset(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Kualifikasi Aset -- </option>
              {kualifikasiAsetData.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedKelompokAset}
              onChange={(e) => setSelectedKelompokAset(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Kelompok Aset -- </option>
              {kelompokAsetData.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedJenisAset}
              onChange={(e) => setSelectedJenisAset(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Jenis Aset -- </option>
              {jenisAsetData.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedObjekAset}
              onChange={(e) => setSelectedObjekAset(e.target.value)}
              className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value=""> -- Objek Aset -- </option>
              {objekAsetData.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Baris Show entries dan Search Box */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
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
                className="border border-gray-300 rounded px-2 py-1"
              >
                {[5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>entries</span>
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

          {/* DataTable Component */}
          {loading ? (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="Tidak ada data tersedia"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
              loading={true} // <-- ini yang penting
            />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">⚠️ Error</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <DataTable
                rows={filteredData}
                columns={columns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={false} // <-- ini yang penting
              />
            </div>
          )}
        </div>
      </div>

      <AddNeracaAsetModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewSaldoAwal}
        initialData={editingSaldoAwal}
      />
    </div>
  );
};

export default SaldoAwalPage;
