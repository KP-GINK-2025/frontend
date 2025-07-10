import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Plus, Download, Search } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import AddBarangModal from "./AddBarangModal";

const DaftarBelanjaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [daftarBelanjaData, setDaftarBelanjaData] = useState([]);

  // State untuk data dropdown filter
  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [kualifikasiBelanjaData, setKualifikasiBelanjaData] = useState([]);
  const [statusVerifikasiData, setStatusVerifikasiData] = useState([]);
  const [statusTotalBelanjaData, setStatusTotalBelanjaData] = useState([]);

  // Selected filter states
  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedKualifikasiBelanja, setSelectedKualifikasiBelanja] =
    useState("");
  const [selectedStatusVerifikasi, setSelectedStatusVerifikasi] = useState("");
  const [selectedStatusTotalHarga, setSelectedStatusTotalHarga] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = async () => {
    setLoading(true);
    setError(null); // Reset error saat fetch dimulai
    try {
      // Dummy data untuk dropdown filter
      setBidangData([
        { id: 1, nama: "Bidang Pendidikan" },
        { id: 2, nama: "Bidang Kesehatan" },
      ]);
      setUnitData([
        { id: 1, nama: "Dinas Pendidikan" },
        { id: 2, nama: "Dinas Kesehatan" },
      ]);
      setSubUnitData([
        { id: 1, nama: "Sub Unit Sekolah" },
        { id: 2, nama: "Sub Unit Puskesmas" },
      ]);
      setUpbData([
        { id: 1, nama: "UPB 001" },
        { id: 2, nama: "UPB 002" },
      ]);
      setSemesterData([
        { id: 1, nama: "1" },
        { id: 2, nama: "2" },
      ]);
      setKualifikasiBelanjaData([
        { id: 1, nama: "Barang" },
        { id: 2, nama: "Jasa" },
        { id: 3, nama: "Modal" },
      ]);
      setStatusVerifikasiData([
        { id: 1, nama: "Diverifikasi" },
        { id: 2, nama: "Menunggu" },
        { id: 3, nama: "Ditolak" },
      ]);
      setStatusTotalBelanjaData([
        { id: 1, nama: "Lunas" },
        { id: 2, nama: "Belum Lunas" },
      ]);
      setTahunData(["2023", "2024", "2025"]);

      // Dummy data untuk tabel, PASTIKAN NILAI BERUPA NUMBER
      const dummyData = [
        {
          id: 1,
          upb: "UPB 001",
          tanggalBaPenerimaan: "2024-01-15",
          kodeKegiatan: "KG001",
          namaPekerjaan: "Pengadaan Komputer Kantor",
          nomorKontrak: "KTR/001/2024",
          tanggalKontrak: "2024-01-10",
          kualifikasiBelanja: "Barang",
          totalBarang: 10,
          totalHarga: 50000000,
          nilaiRetensi: 5000000,
          nilaiRealisasi: 45000000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Diverifikasi",
          tahun: "2024",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          semester: "1",
        },
        {
          id: 2,
          upb: "UPB 002",
          tanggalBaPenerimaan: "2024-02-20",
          kodeKegiatan: "KG002",
          namaPekerjaan: "Renovasi Ruang Rapat",
          nomorKontrak: "KTR/002/2024",
          tanggalKontrak: "2024-02-15",
          kualifikasiBelanja: "Jasa",
          totalBarang: 1,
          totalHarga: 75000000,
          nilaiRetensi: 7500000,
          nilaiRealisasi: 67500000,
          statusTotalHarga: "Belum Lunas",
          statusVerifikasi: "Menunggu",
          tahun: "2024",
          bidang: "Bidang Kesehatan",
          unit: "Dinas Kesehatan",
          subUnit: "Sub Unit Puskesmas",
          semester: "1",
        },
        {
          id: 3,
          upb: "UPB 003",
          tanggalBaPenerimaan: "2024-03-01",
          kodeKegiatan: "KG003",
          namaPekerjaan: "Pembelian ATK",
          nomorKontrak: "KTR/003/2024",
          tanggalKontrak: "2024-02-25",
          kualifikasiBelanja: "Barang",
          totalBarang: 100,
          totalHarga: 2000000,
          nilaiRetensi: 0,
          nilaiRealisasi: 2000000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Diverifikasi",
          tahun: "2023",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          semester: "2",
        },
        {
          id: 4,
          upb: "UPB 001",
          tanggalBaPenerimaan: "2024-04-10",
          kodeKegiatan: "KG004",
          namaPekerjaan: "Pemasangan CCTV",
          nomorKontrak: "KTR/004/2024",
          tanggalKontrak: "2024-04-05",
          kualifikasiBelanja: "Jasa",
          totalBarang: 5,
          totalHarga: 15000000,
          nilaiRetensi: 1500000,
          nilaiRealisasi: 13500000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Diverifikasi",
          tahun: "2024",
          bidang: "Bidang Kesehatan",
          unit: "Dinas Kesehatan",
          subUnit: "Sub Unit Puskesmas",
          semester: "1",
        },
        {
          id: 5,
          upb: "UPB 002",
          tanggalBaPenerimaan: "2024-05-25",
          kodeKegiatan: "KG005",
          namaPekerjaan: "Perbaikan Jaringan",
          nomorKontrak: "KTR/005/2024",
          tanggalKontrak: "2024-05-20",
          kualifikasiBelanja: "Jasa",
          totalBarang: 1,
          totalHarga: 5000000,
          nilaiRetensi: 0,
          nilaiRealisasi: 5000000,
          statusTotalHarga: "Lunas",
          statusVerifikasi: "Menunggu",
          tahun: "2024",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          semester: "2",
        },
      ];

      setDaftarBelanjaData(dummyData); // Set data utama
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Panggil fetchData saat komponen di-mount
  }, []); // Dependencies kosong, karena filtering sekarang di luar fetchData

  // Filter data (dilakukan di luar fetchData)
  const filteredData = daftarBelanjaData.filter((item) => {
    const matchesSearch =
      item.upb?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaPekerjaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorKontrak?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeKegiatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.totalHarga
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.nilaiRealisasi
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesAllFilters =
      (selectedTahun === "" || item.tahun === selectedTahun) &&
      (selectedBidang === "" || item.bidang === selectedBidang) &&
      (selectedUnit === "" || item.unit === selectedUnit) &&
      (selectedSubUnit === "" || item.subUnit === selectedSubUnit) &&
      (selectedUpb === "" || item.upb === selectedUpb) &&
      (selectedSemester === "" || item.semester === selectedSemester) &&
      (selectedKualifikasiBelanja === "" ||
        item.kualifikasiBelanja === selectedKualifikasiBelanja) &&
      (selectedStatusVerifikasi === "" ||
        item.statusVerifikasi === selectedStatusVerifikasi) &&
      (selectedStatusTotalHarga === "" ||
        item.statusTotalHarga === selectedStatusTotalHarga);

    return matchesSearch && matchesAllFilters;
  });

  const handleExport = () => console.log("Exporting Daftar Belanja...");

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedTahun("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSelectedUpb("");
    setSelectedSemester("");
    setSelectedKualifikasiBelanja("");
    setSelectedStatusVerifikasi("");
    setSelectedStatusTotalHarga("");
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

  const handleSaveNewDaftarBelanja = (daftarBelanjaToSave) => {
    if (daftarBelanjaToSave.id) {
      setDaftarBelanjaData((prevData) =>
        prevData.map((item) =>
          item.id === daftarBelanjaToSave.id ? daftarBelanjaToSave : item
        )
      );
      console.log("Update Daftar Belanja:", daftarBelanjaToSave);
    } else {
      setDaftarBelanjaData((prevData) => [
        ...prevData,
        { id: Date.now(), ...daftarBelanjaToSave },
      ]);
      console.log("Menyimpan Daftar Belanja baru:", daftarBelanjaToSave);
    }
    handleCloseAddModal();
  };

  const handleEditClick = (id) => {
    const itemToEdit = daftarBelanjaData.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setDaftarBelanjaData((prevData) =>
        prevData.filter((item) => item.id !== id)
      );
      console.log("Menghapus Belanja dengan ID:", id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "upb", headerName: "UPB", width: 120 },
    {
      field: "tanggalBaPenerimaan",
      headerName: "Tanggal BA Penerimaan Barang",
      width: 200,
    },
    { field: "kodeKegiatan", headerName: "Kode Kegiatan", width: 150 },
    { field: "namaPekerjaan", headerName: "Nama Pekerjaan", width: 200 },
    { field: "nomorKontrak", headerName: "Nomor Kontrak", width: 150 },
    { field: "tanggalKontrak", headerName: "Tanggal Kontrak", width: 150 },
    {
      field: "kualifikasiBelanja",
      headerName: "Kualifikasi Belanja",
      width: 150,
    },
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
    {
      field: "nilaiRetensi",
      headerName: "Nilai Retensi",
      type: "number",
      width: 150,
    },
    {
      field: "nilaiRealisasi",
      headerName: "Nilai Realisasi",
      type: "number",
      width: 150,
    },
    { field: "statusTotalHarga", headerName: "Status Total Harga", width: 150 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
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
          <h1 className="text-2xl font-bold mb-6">Daftar Belanja APBD</h1>

          {/* BARIS Filter & Tombol Aksi */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Filters (kiri) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-1">
              {" "}
              {/* Disamakan dengan DataRuangPage */}
              {/* Filter Tahun */}
              <select
                value={selectedTahun}
                onChange={(e) => {
                  setSelectedTahun(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Tahun -- </option>
                {tahunData.map((tahun, i) => (
                  <option key={i} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
              {/* Filter Bidang */}
              <select
                value={selectedBidang}
                onChange={(e) => {
                  setSelectedBidang(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Bidang -- </option>
                {bidangData.map((b) => (
                  <option key={b.id} value={b.nama}>
                    {b.nama}
                  </option>
                ))}
              </select>
              {/* Filter Unit */}
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Unit -- </option>
                {unitData.map((u) => (
                  <option key={u.id} value={u.nama}>
                    {u.nama}
                  </option>
                ))}
              </select>
              {/* Filter Sub Unit */}
              <select
                value={selectedSubUnit}
                onChange={(e) => {
                  setSelectedSubUnit(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- Sub Unit -- </option>
                {subUnitData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
              {/* Filter UPB */}
              <select
                value={selectedUpb}
                onChange={(e) => {
                  setSelectedUpb(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value=""> -- UPB -- </option>
                {upbData.map((u) => (
                  <option key={u.id} value={u.nama}>
                    {u.nama}
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
              {/* Filter Kualifikasi Belanja */}
              <select
                value={selectedKualifikasiBelanja}
                onChange={(e) => {
                  setSelectedKualifikasiBelanja(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">-- Pilih Kualifikasi --</option>
                {kualifikasiBelanjaData.map((k) => (
                  <option key={k.id} value={k.nama}>
                    {k.nama}
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
                <option value="">-- Pilih Status --</option>
                {statusVerifikasiData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
              {/* Filter Status Total Belanja */}
              <select
                value={selectedStatusTotalHarga}
                onChange={(e) => {
                  setSelectedStatusTotalHarga(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">-- Pilih Status --</option>
                {statusTotalBelanjaData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Refresh dan Add Barang (di kanan) */}
            <div className="flex gap-2 items-center lg:self-end">
              {" "}
              {/* self-end untuk menyelaraskan ke bawah di desktop */}
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
                <Plus size={16} /> Add Barang
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

      <AddBarangModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewDaftarBelanja}
        initialData={editingItem}
      />
    </div>
  );
};

export default DaftarBelanjaPage;
