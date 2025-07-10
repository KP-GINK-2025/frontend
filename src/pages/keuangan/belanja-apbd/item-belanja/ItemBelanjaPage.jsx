import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Download, Search } from "lucide-react";
import DataTable from "../../../../components/DataTable";

const ItemBelanjaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [itemBelanjaData, setItemBelanjaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data dropdown filter
  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [kualifikasiBelanjaData, setKualifikasiBelanjaData] = useState([]);
  const [kualifikasiAsetData, setKualifikasiAsetData] = useState([]);
  const [statusVerifikasiData, setStatusVerifikasiData] = useState([]);

  // Selected filter states
  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedKualifikasiBelanja, setSelectedKualifikasiBelanja] =
    useState("");
  const [selectedKualifikasiAset, setSelectedKualifikasiAset] = useState("");
  const [selectedStatusVerifikasi, setSelectedStatusVerifikasi] = useState("");

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
      setTahunData(["2023", "2024", "2025"]);
      setKualifikasiBelanjaData([
        { id: 1, nama: "Barang" },
        { id: 2, nama: "Jasa" },
        { id: 3, nama: "Modal" },
      ]);
      setKualifikasiAsetData([
        { id: 1, nama: "Aset Tetap" },
        { id: 2, nama: "Bukan Aset" },
      ]);
      setStatusVerifikasiData([
        { id: 1, nama: "Diverifikasi" },
        { id: 2, nama: "Menunggu" },
        { id: 3, nama: "Ditolak" },
      ]);

      // Dummy data untuk tabel Item Belanja
      const dummyItemBelanjaData = [
        {
          id: 1,
          belanjaApbdId: "BLJ001", // ID dari Belanja APBD terkait
          idBelanja: 1, // ID dari Belanja APBD terkait (sesuai DaftarBelanjaPage id)
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          upb: "UPB 001",
          semester: "1",
          tahun: "2024",
          tanggalBaPenerimaan: "2024-01-15",
          namaKegiatan: "Kegiatan Pengadaan",
          namaPekerjaan: "Pengadaan Komputer Kantor",
          nomorKontrak: "KTR/001/2024",
          kualifikasiBelanja: "Barang",
          jenisItem: "Elektronik",
          kodeBarang: "KB001",
          jenis: "Komputer",
          objek: "Laptop",
          namaBarang: "Laptop ASUS VivoBook",
          merkType: "ASUS/X441",
          ukuran: "14 inci",
          bahan: "Plastik/Logam",
          hargaSatuan: 5000000,
          penambahanBiayaLain: 50000,
          hargaSatuanSetelahBiayaLainnya: 5050000,
          nilaiTotal: 50500000, // (hargaSatuanSetelahBiayaLainnya * jumlahBarang)
          jumlahBarang: 10,
          lokasiRuangan: "Ruang IT",
          kualifikasiAset: "Aset Tetap",
          peningkatanKualitas: "Tidak Ada",
          noNhpd: "NHPD-001",
          keterangan: "Pengadaan rutin",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Lengkap",
          lampiran: "lampiran_001.pdf",
        },
        {
          id: 2,
          belanjaApbdId: "BLJ002",
          idBelanja: 2,
          bidang: "Bidang Kesehatan",
          unit: "Dinas Kesehatan",
          subUnit: "Sub Unit Puskesmas",
          upb: "UPB 002",
          semester: "1",
          tahun: "2024",
          tanggalBaPenerimaan: "2024-02-20",
          namaKegiatan: "Kegiatan Renovasi",
          namaPekerjaan: "Renovasi Ruang Rapat",
          nomorKontrak: "KTR/002/2024",
          tanggalKontrak: "2024-02-15",
          kualifikasiBelanja: "Jasa",
          jenisItem: "Jasa Konstruksi",
          kodeBarang: "JK001",
          jenis: "Renovasi",
          objek: "Ruangan",
          namaBarang: "Pengecatan Dinding",
          merkType: "Dulux/Catylac",
          ukuran: "50m2",
          bahan: "Cat Tembok",
          hargaSatuan: 1000000,
          penambahanBiayaLain: 0,
          hargaSatuanSetelahBiayaLainnya: 1000000,
          nilaiTotal: 1000000, // (hargaSatuanSetelahBiayaLainnya * jumlahBarang)
          jumlahBarang: 1,
          lokasiRuangan: "Ruang Rapat Utama",
          kualifikasiAset: "Bukan Aset",
          peningkatanKualitas: "Tidak Ada",
          noNhpd: "NHPD-002",
          keterangan: "Perbaikan",
          statusVerifikasi: "Menunggu",
          catatanVerifikasi: "",
          lampiran: "lampiran_002.pdf",
        },
        {
          id: 3,
          belanjaApbdId: "BLJ003",
          idBelanja: 3,
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          upb: "UPB 003",
          semester: "2",
          tahun: "2023",
          tanggalBaPenerimaan: "2024-03-01",
          namaKegiatan: "Kegiatan Rutin",
          namaPekerjaan: "Pembelian ATK",
          nomorKontrak: "KTR/003/2024",
          kualifikasiBelanja: "Barang",
          jenisItem: "ATK",
          kodeBarang: "ATK001",
          jenis: "Alat Tulis",
          objek: "Pulpen",
          namaBarang: "Pulpen Faster C600",
          merkType: "Faster/C600",
          ukuran: "0.5mm",
          bahan: "Plastik",
          hargaSatuan: 2000,
          penambahanBiayaLain: 0,
          hargaSatuanSetelahBiayaLainnya: 2000,
          nilaiTotal: 200000, // (hargaSatuanSetelahBiayaLainnya * jumlahBarang)
          jumlahBarang: 100,
          lokasiRuangan: "Gudang ATK",
          kualifikasiAset: "Bukan Aset",
          peningkatanKualitas: "Tidak Ada",
          noNhpd: "NHPD-003",
          keterangan: "Pengadaan bulanan",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Sesuai spesifikasi",
          lampiran: "lampiran_003.pdf",
        },
      ];

      setItemBelanjaData(dummyItemBelanjaData);
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

  // Filtering data (sesuaikan dengan semua filter yang ada)
  const filteredData = itemBelanjaData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesAllFilters =
      (selectedTahun === "" || item.tahun === selectedTahun) &&
      (selectedBidang === "" || item.bidang === selectedBidang) &&
      (selectedUnit === "" || item.unit === selectedUnit) &&
      (selectedSubUnit === "" || item.subUnit === selectedSubUnit) &&
      (selectedUpb === "" || item.upb === selectedUpb) &&
      (selectedSemester === "" || item.semester === selectedSemester) &&
      (selectedKualifikasiBelanja === "" ||
        item.kualifikasiBelanja === selectedKualifikasiBelanja) &&
      (selectedKualifikasiAset === "" ||
        item.kualifikasiAset === selectedKualifikasiAset) &&
      (selectedStatusVerifikasi === "" ||
        item.statusVerifikasi === selectedStatusVerifikasi);

    return matchesSearch && matchesAllFilters;
  });

  const handleExport = () => console.log("Exporting Item Belanja...");

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
    setSelectedKualifikasiAset("");
    setSelectedStatusVerifikasi("");
    fetchData();
  };

  // Tidak ada handleOpenAddModal, handleCloseAddModal, handleSaveNewItem, handleEditClick, handleDeleteClick

  // Definisi kolom untuk DataTable
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "belanjaApbdId", headerName: "No Belanja APBD", width: 150 },
    { field: "bidang", headerName: "Bidang", width: 150 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "subUnit", headerName: "Sub Unit", width: 150 },
    { field: "upb", headerName: "UPB", width: 120 },
    { field: "semester", headerName: "Semester", width: 100 },
    {
      field: "tanggalBaPenerimaan",
      headerName: "Tanggal BA Penerimaan Barang",
      width: 200,
    },
    { field: "namaKegiatan", headerName: "Nama Kegiatan", width: 200 },
    { field: "namaPekerjaan", headerName: "Nama Pekerjaan", width: 200 },
    { field: "nomorKontrak", headerName: "Nomor Kontrak", width: 150 },
    {
      field: "kualifikasiBelanja",
      headerName: "Kualifikasi Belanja",
      width: 150,
    },
    { field: "jenisItem", headerName: "Jenis Item", width: 120 },
    { field: "kodeBarang", headerName: "Kode Barang", width: 120 },
    { field: "jenis", headerName: "Jenis", width: 120 },
    { field: "objek", headerName: "Objek", width: 120 },
    { field: "namaBarang", headerName: "Nama Barang", width: 200 },
    { field: "merkType", headerName: "Merk/Type", width: 150 },
    { field: "ukuran", headerName: "Ukuran", width: 100 },
    { field: "bahan", headerName: "Bahan", width: 100 },
    {
      field: "hargaSatuan",
      headerName: "Harga Satuan",
      type: "number",
      width: 150,
    },
    {
      field: "penambahanBiayaLain",
      headerName: "Penambahan Biaya Lain",
      type: "number",
      width: 180,
    },
    {
      field: "hargaSatuanSetelahBiayaLainnya",
      headerName: "Harga Satuan Setelah Ditambah Biaya Lainnya",
      type: "number",
      width: 250,
    },
    {
      field: "jumlahBarang",
      headerName: "Jumlah Barang",
      type: "number",
      width: 120,
    },
    {
      field: "nilaiTotal",
      headerName: "Nilai Total",
      type: "number",
      width: 150,
    },
    { field: "lokasiRuangan", headerName: "Lokasi/Ruangan", width: 150 },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 150 },
    {
      field: "peningkatanKualitas",
      headerName: "Peningkatan Kualitas",
      width: 150,
    },
    { field: "noNhpd", headerName: "No NHPD", width: 120 },
    { field: "keterangan", headerName: "Keterangan", flex: 1 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 200,
    },
    { field: "lampiran", headerName: "Lampiran", width: 100 },
    {
      // Karena tidak ada Add/Edit, maka tombol aksi bisa lebih sederhana
      field: "action",
      headerName: "Detail", // Ubah nama header ke "Detail" atau "Aksi"
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <button
            // bisa implementasi modal "view detail" di sini
            onClick={() => console.log("Lihat Detail Item:", params.row.id)}
            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
          >
            Lihat
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

        {/* Tombol Export di luar kotak putih */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Item Belanja APBD</h1>

          {/* BARIS Filter & Tombol Aksi */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Filters (kiri) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-1">
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
                <option value="">-- Kualifikasi Belanja --</option>
                {kualifikasiBelanjaData.map((k) => (
                  <option key={k.id} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
              </select>

              {/* Filter Kualifikasi Aset */}
              <select
                value={selectedKualifikasiAset}
                onChange={(e) => {
                  setSelectedKualifikasiAset(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">-- Kualifikasi Aset --</option>
                {kualifikasiAsetData.map((k) => (
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
                <option value="">-- Status Verifikasi --</option>
                {statusVerifikasiData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Refresh (di kanan) */}
            <div className="flex gap-2 items-center lg:self-end">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
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
    </div>
  );
};

export default ItemBelanjaPage;
