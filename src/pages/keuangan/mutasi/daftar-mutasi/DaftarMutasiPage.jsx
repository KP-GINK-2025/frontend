import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import AddMutasiModal from "./AddMutasiModal";

const DaftarMutasiPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [mutasiData, setMutasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data dropdown filter
  const [kualifikasiPerolehanData, setKualifikasiPerolehanData] = useState([]);
  const [asalData, setAsalData] = useState([]);
  const [tujuanData, setTujuanData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [statusVerifikasiData, setStatusVerifikasiData] = useState([]);

  // Selected filter states
  const [selectedKualifikasiPerolehan, setSelectedKualifikasiPerolehan] =
    useState("");
  const [selectedAsal, setSelectedAsal] = useState("");
  const [selectedTujuan, setSelectedTujuan] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedStatusVerifikasi, setSelectedStatusVerifikasi] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dummy data untuk dropdown filter
      setKualifikasiPerolehanData([
        { id: 1, nama: "Dropping Pusat" },
        { id: 2, nama: "Dropping Pemda" },
        { id: 3, nama: "Hibah" },
        { id: 4, nama: "Pembelian" },
      ]);
      setAsalData([
        { id: 1, nama: "Jakarta" },
        { id: 2, nama: "Lampung" },
      ]);
      setTujuanData([
        { id: 1, nama: "Bandar Lampung" },
        { id: 2, nama: "Metro" },
      ]);
      setSemesterData([
        { id: 1, nama: "Ganjil" },
        { id: 2, nama: "Genap" },
      ]);
      setStatusVerifikasiData([
        { id: 1, nama: "Diverifikasi" },
        { id: 2, nama: "Menunggu" },
        { id: 3, nama: "Ditolak" },
      ]);

      // Dummy data untuk tabel Mutasi
      const dummyMutasiData = [
        {
          id: 1,
          kualifikasiPerolehan: "Dropping Pusat",
          asal: "Jakarta",
          tujuan: "Bandar Lampung",
          tanggalBeritaAcara: "2024-01-10",
          nomorBeritaAcara: "BA/DP/001",
          totalBarang: 50,
          totalHarga: 250000000,
          lampiran: "lampiran_dp001.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Dokumen lengkap",
          // Conditional fields for Dropping Pusat
          tahunPerolehan: "2024",
          nomorSp2d: "SP2D/001",
          tanggalSp2d: "2024-01-05",
          nomorSuratPengantar: "SP/PST/001",
          tanggalSuratPengantar: "2024-01-01",
          // Fields from other types should be undefined/null
          opdAsal: undefined,
          opdTujuan: undefined,
          nomorSkpd: undefined,
          tanggalSkpd: undefined,
          semester: "Ganjil", // Untuk filter semester
        },
        {
          id: 2,
          kualifikasiPerolehan: "Dropping Pemda",
          asal: "Metro",
          tujuan: "Bandar Lampung",
          tanggalBeritaAcara: "2024-02-15",
          nomorBeritaAcara: "BA/DPM/002",
          totalBarang: 20,
          totalHarga: 75000000,
          lampiran: "lampiran_dpm002.pdf",
          statusVerifikasi: "Menunggu",
          catatanVerifikasi: "",
          // Conditional fields for Dropping Pemda
          opdAsal: "Dinas Pendidikan",
          opdTujuan: "Dinas Kesehatan",
          nomorSkpd: "SKPD/001",
          tanggalSkpd: "2024-02-10",
          // Fields from other types should be undefined/null
          tahunPerolehan: undefined,
          nomorSp2d: undefined,
          tanggalSp2d: undefined,
          nomorSuratPengantar: undefined,
          tanggalSuratPengantar: undefined,
          semester: "Ganjil", // Untuk filter semester
        },
        {
          id: 3,
          kualifikasiPerolehan: "Pembelian",
          asal: "Bandar Lampung",
          tujuan: "Bandar Lampung",
          tanggalBeritaAcara: "2024-03-01",
          nomorBeritaAcara: "BA/PBL/003",
          totalBarang: 5,
          totalHarga: 10000000,
          lampiran: "lampiran_pbl003.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Pembelian rutin",
          // Semua field kondisional akan undefined/null
          tahunPerolehan: undefined,
          nomorSp2d: undefined,
          tanggalSp2d: undefined,
          nomorSuratPengantar: undefined,
          tanggalSuratPengantar: undefined,
          opdAsal: undefined,
          opdTujuan: undefined,
          nomorSkpd: undefined,
          tanggalSkpd: undefined,
          semester: "Genap", // Untuk filter semester
        },
      ];

      setMutasiData(dummyMutasiData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering data
  const filteredData = mutasiData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesAllFilters =
      (selectedKualifikasiPerolehan === "" ||
        item.kualifikasiPerolehan === selectedKualifikasiPerolehan) &&
      (selectedAsal === "" || item.asal === selectedAsal) &&
      (selectedTujuan === "" || item.tujuan === selectedTujuan) &&
      (selectedSemester === "" || item.semester === selectedSemester) &&
      (selectedStatusVerifikasi === "" ||
        item.statusVerifikasi === selectedStatusVerifikasi);

    return matchesSearch && matchesAllFilters;
  });

  const handleExport = () => console.log("Exporting Daftar Mutasi...");

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedKualifikasiPerolehan("");
    setSelectedAsal("");
    setSelectedTujuan("");
    setSelectedSemester("");
    setSelectedStatusVerifikasi("");
    setDataTablePaginationModel({ page: 0, pageSize: entriesPerPage });
    fetchData();
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveNewMutasi = (mutasiToSave) => {
    if (mutasiToSave.id) {
      // Mode Edit
      setMutasiData((prevData) =>
        prevData.map((item) =>
          item.id === mutasiToSave.id ? mutasiToSave : item
        )
      );
      console.log("Update Mutasi:", mutasiToSave);
    } else {
      // Mode Tambah Baru
      setMutasiData((prevData) => [
        ...prevData,
        { ...mutasiToSave, id: Date.now() },
      ]);
      console.log("Menyimpan Mutasi baru:", mutasiToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const itemToEdit = mutasiData.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setMutasiData((prevData) => prevData.filter((item) => item.id !== id));
      console.log("Menghapus Mutasi dengan ID:", id);
    }
  };

  // Definisi kolom untuk DataTable
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "kualifikasiPerolehan",
      headerName: "Kualifikasi Perolehan",
      width: 200,
    },
    { field: "asal", headerName: "Asal", width: 120 },
    { field: "tujuan", headerName: "Tujuan", width: 120 },
    {
      field: "tanggalBeritaAcara",
      headerName: "Tgl. Berita Acara",
      width: 150,
    },
    { field: "nomorBeritaAcara", headerName: "No. Berita Acara", width: 150 },
    {
      field: "totalBarang",
      headerName: "Total Barang",
      type: "number",
      width: 120,
    },
    {
      field: "totalHarga",
      headerName: "Total Harga",
      type: "number",
      width: 150,
    },
    { field: "lampiran", headerName: "Lampiran", width: 100 }, // Jika berupa link/button, perlu renderCell
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    { field: "catatanVerifikasi", headerName: "Catatan Verifikasi", flex: 1 }, // Menggunakan flex
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
    // Kolom-kolom kondisional yang mungkin ada di data tapi tidak selalu tampil di tabel utama
    // Tambahkan mereka sebagai kolom tersembunyi atau muncul berdasarkan kebutuhan user/admin
    {
      field: "tahunPerolehan",
      headerName: "Tahun Perolehan (DP)",
      width: 150,
      hide: true,
    },
    {
      field: "nomorSp2d",
      headerName: "Nomor SP2D (DP)",
      width: 150,
      hide: true,
    },
    {
      field: "tanggalSp2d",
      headerName: "Tgl SP2D (DP)",
      width: 150,
      hide: true,
    },
    {
      field: "nomorSuratPengantar",
      headerName: "No Surat Pengantar (DP)",
      width: 200,
      hide: true,
    },
    {
      field: "tanggalSuratPengantar",
      headerName: "Tgl Surat Pengantar (DP)",
      width: 200,
      hide: true,
    },
    { field: "opdAsal", headerName: "OPD Asal (DPM)", width: 150, hide: true },
    {
      field: "opdTujuan",
      headerName: "OPD Tujuan (DPM)",
      width: 150,
      hide: true,
    },
    {
      field: "nomorSkpd",
      headerName: "Nomor SKPD (DPM)",
      width: 150,
      hide: true,
    },
    {
      field: "tanggalSkpd",
      headerName: "Tgl SKPD (DPM)",
      width: 150,
      hide: true,
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
          <h1 className="text-2xl font-bold mb-6">Daftar Mutasi</h1>

          {/* Filter Baris 1: Dropdown Filters & Tombol Aksi (Refresh, Add) */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Filters (kiri) - Menggunakan grid untuk responsifitas */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-1">
              {/* Filter Kualifikasi Perolehan */}
              <select
                value={selectedKualifikasiPerolehan}
                onChange={(e) => {
                  setSelectedKualifikasiPerolehan(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Kualifikasi Perolehan -- </option>
                {kualifikasiPerolehanData.map((k) => (
                  <option key={k.id} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
              </select>

              {/* Filter Asal */}
              <select
                value={selectedAsal}
                onChange={(e) => {
                  setSelectedAsal(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Asal -- </option>
                {asalData.map((a) => (
                  <option key={a.id} value={a.nama}>
                    {a.nama}
                  </option>
                ))}
              </select>

              {/* Filter Tujuan */}
              <select
                value={selectedTujuan}
                onChange={(e) => {
                  setSelectedTujuan(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Tujuan -- </option>
                {tujuanData.map((t) => (
                  <option key={t.id} value={t.nama}>
                    {t.nama}
                  </option>
                ))}
              </select>

              {/* Filter Semester */}
              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Semester -- </option>
                {semesterData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>

              {/* Filter Status Verifikasi */}
              <select
                value={selectedStatusVerifikasi}
                onChange={(e) => {
                  setSelectedStatusVerifikasi(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Status Verifikasi -- </option>
                {statusVerifikasiData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Refresh dan Add Mutasi (di kanan) */}
            <div className="flex gap-2 items-center lg:self-end">
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
                <Plus size={16} /> Add Mutasi
              </button>
            </div>
          </div>

          {/* BARIS Kontrol Tabel: Show entries dan Search */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              Show
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
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
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
            <div className="text-center py-8 text-gray-500">Memuat data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">Error: {error}</div>
          ) : (
            <DataTable
              rows={filteredData}
              columns={columns}
              initialPageSize={entriesPerPage}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              height={500}
              emptyRowsMessage="No data available in table"
              paginationModel={dataTablePaginationModel}
              onPaginationModelChange={setDataTablePaginationModel}
            />
          )}
        </div>
      </div>

      <AddMutasiModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewMutasi}
        initialData={editingItem}
      />
    </div>
  );
};

export default DaftarMutasiPage;
