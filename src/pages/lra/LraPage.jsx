import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddLraModal from "./AddLraModal";
import DataTable from "../../components/DataTable";
import Swal from "sweetalert2";

const LraPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [lraData, setLraData] = useState([]); // Data utama untuk tabel

  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Tambahkan state error
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLra, setEditingLra] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = () => {
    setLoading(true);
    setError(null); // Reset error state

    setTimeout(() => {
      try {
        // Dummy data untuk filter
        setBidangData([
          { id: 1, nama: "Bidang Keuangan" },
          { id: 2, nama: "Bidang Umum" },
        ]);
        setUnitData([
          { id: 1, nama: "Unit Anggaran" },
          { id: 2, nama: "Unit Gaji" },
        ]);
        setSubUnitData([
          { id: 1, nama: "Sub Unit A" },
          { id: 2, nama: "Sub Unit B" },
        ]);
        setUpbData([
          { id: 1, nama: "UPB A" },
          { id: 2, nama: "UPB B" },
        ]);
        setSemesterData([
          { id: 1, nama: "Ganjil" },
          { id: 2, nama: "Genap" },
        ]);
        setTahunData(["2023", "2024", "2025"]);

        // PASTIKAN OBJEK DI SINI MEMILIKI PROPERTI 'nilaiTotal' DENGAN NILAI ANGKA
        const dummyLraData = [
          {
            id: 1,
            tahun: "2024",
            semester: "Ganjil",
            bidang: "Bidang Keuangan",
            unit: "Unit Anggaran",
            subUnit: "Sub Unit A",
            upb: "UPB A",
            nilaiTotal: 100000000,
            keterangan: "LRA Bulan Januari",
          },
          {
            id: 2,
            tahun: "2023",
            semester: "Genap",
            bidang: "Bidang Umum",
            unit: "Unit Gaji",
            subUnit: "Sub Unit B",
            upb: "UPB B",
            nilaiTotal: 75000000,
            keterangan: "LRA Bulan Juli",
          },
          {
            id: 3,
            tahun: "2024",
            semester: "Ganjil",
            bidang: "Bidang Keuangan",
            unit: "Unit Anggaran",
            subUnit: "Sub Unit A",
            upb: "UPB A",
            nilaiTotal: 120000000,
            keterangan: "LRA Bulan Februari",
          },
        ];
        setLraData(dummyLraData);
        console.log("Data LRA yang diset di fetchData:", dummyLraData);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data. Silakan coba lagi.");
        setLoading(false);
      }
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = lraData.filter((item) => {
    const matchesSearch =
      item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Konversi ke string untuk pencarian jika nilaiTotal bisa berupa angka
      item.nilaiTotal
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesBidang =
      selectedBidang === "" || item.bidang === selectedBidang;
    const matchesUnit = selectedUnit === "" || item.unit === selectedUnit;
    const matchesSubUnit =
      selectedSubUnit === "" || item.subUnit === selectedSubUnit;
    const matchesUpb = selectedUpb === "" || item.upb === selectedUpb;
    const matchesSemester =
      selectedSemester === "" || item.semester === selectedSemester;
    const matchesTahun = selectedTahun === "" || item.tahun === selectedTahun;

    return (
      matchesSearch &&
      matchesBidang &&
      matchesUnit &&
      matchesSubUnit &&
      matchesUpb &&
      matchesSemester &&
      matchesTahun
    );
  });

  const handleExport = () => console.log("Exporting LRA...");

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSelectedUpb("");
    setSelectedSemester("");
    setSelectedTahun("");
    fetchData(); // fetchData sudah mengatur loading state
  };

  const handleOpenAddModal = () => {
    setEditingLra(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingLra(null);
  };

  const handleSaveNewLra = (lraToSave) => {
    // PASTIKAN lraToSave MEMILIKI nilaiTotal YANG BENAR (BERASAL DARI ADDMODAL)
    if (lraToSave.id) {
      setLraData((prevData) =>
        prevData.map((item) => (item.id === lraToSave.id ? lraToSave : item))
      );
      console.log("Update LRA:", lraToSave);
    } else {
      setLraData((prevData) => [...prevData, { id: Date.now(), ...lraToSave }]);
      console.log("Menyimpan LRA baru:", lraToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const lraToEdit = lraData.find((item) => item.id === id);
    if (lraToEdit) {
      setEditingLra(lraToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data LRA yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setLraData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data LRA berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "tahun", headerName: "Tahun", width: 100 },
    { field: "semester", headerName: "Semester", width: 120 },
    { field: "bidang", headerName: "Bidang", width: 180 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "subUnit", headerName: "Sub Unit", width: 150 },
    { field: "upb", headerName: "UPB", width: 120 },
    {
      field: "nilaiTotal",
      headerName: "Nilai Total",
      type: "number",
      width: 180,
    },
    { field: "keterangan", headerName: "Keterangan", flex: 1 },
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
          <h1 className="text-2xl font-bold mb-6">
            Daftar Laporan Realisasi Anggaran
          </h1>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1">
              <select
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
              >
                <option value=""> -- Bidang -- </option>
                {bidangData.map((b) => (
                  <option key={b.id} value={b.nama}>
                    {b.nama}
                  </option>
                ))}
              </select>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
              >
                <option value=""> -- Unit -- </option>
                {unitData.map((u) => (
                  <option key={u.id} value={u.nama}>
                    {u.nama}
                  </option>
                ))}
              </select>
              <select
                value={selectedSubUnit}
                onChange={(e) => setSelectedSubUnit(e.target.value)}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
              >
                <option value=""> -- Sub Unit -- </option>
                {subUnitData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
              <select
                value={selectedUpb}
                onChange={(e) => setSelectedUpb(e.target.value)}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
              >
                <option value=""> -- UPB -- </option>
                {upbData.map((u) => (
                  <option key={u.id} value={u.nama}>
                    {u.nama}
                  </option>
                ))}
              </select>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
              >
                <option value=""> -- Semester -- </option>
                {semesterData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
              <select
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
              >
                <option value=""> -- Tahun -- </option>
                {tahunData.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 items-center lg:self-end">
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
                <Plus size={16} /> Add LRA
              </button>
            </div>
          </div>

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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          {/* PERBAIKAN LOGIKA LOADING DI SINI */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-2">⚠️ Error</div>
                <div className="text-gray-600">{error}</div>
                <button
                  onClick={fetchData}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <DataTable
                rows={filteredData}
                columns={columns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={loading} // Pass loading state ke DataTable
              />
            )}
          </div>
        </div>
      </div>

      <AddLraModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewLra}
        initialData={editingLra}
      />
    </div>
  );
};

export default LraPage;
