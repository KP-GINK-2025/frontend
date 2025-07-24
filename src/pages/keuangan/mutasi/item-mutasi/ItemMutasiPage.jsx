import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Download, Search } from "lucide-react";
import DataTable from "../../../../components/DataTable";
import Swal from "sweetalert2";

const ItemMutasiPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [itemMutasiData, setItemMutasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data dropdown filter
  const [kualifikasiPerolehanData, setKualifikasiPerolehanData] = useState([]);
  const [asalData, setAsalData] = useState([]); // Asal lokasi/umum
  const [tujuanData, setTujuanData] = useState([]); // Tujuan lokasi/umum
  const [semesterData, setSemesterData] = useState([]);
  const [statusVerifikasiData, setStatusVerifikasiData] = useState([]);
  const [kualifikasiAsetData, setKualifikasiAsetData] = useState([]);
  const [kondisiData, setKondisiData] = useState([]);

  // Selected filter states
  const [selectedKualifikasiPerolehan, setSelectedKualifikasiPerolehan] =
    useState("");
  const [selectedAsal, setSelectedAsal] = useState("");
  const [selectedTujuan, setSelectedTujuan] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedStatusVerifikasi, setSelectedStatusVerifikasi] = useState("");
  const [selectedKualifikasiAset, setSelectedKualifikasiAset] = useState("");
  const [selectedKondisi, setSelectedKondisi] = useState("");

  const [dataTablePaginationModel, setDataTablePaginationModel] =
    React.useState({
      page: 0,
      pageSize: entriesPerPage,
    });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

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
      setKualifikasiAsetData([
        { id: 1, nama: "Aset Tetap" },
        { id: 2, nama: "Bukan Aset" },
      ]);
      setKondisiData([
        { id: 1, nama: "Baik" },
        { id: 2, nama: "Rusak Ringan" },
        { id: 3, nama: "Rusak Berat" },
      ]);

      // Dummy data untuk tabel Item Mutasi
      const dummyItemMutasiData = [
        {
          id: 1,
          mutasiId: "MUT001",
          belanjaApbdId: "BLJ001",
          itemBelanjaApbdId: "ITBLJ001",
          kualifikasiPerolehan: "Dropping Pusat",
          asalLokasi: "Jakarta",
          asalBidang: "Pusat",
          asalUnit: "Direktorat A",
          tujuanLokasi: "Bandar Lampung",
          tujuanBidang: "Dinas Pendidikan",
          tujuanUnit: "SDN 1",
          tujuanSubUnit: "Sub Unit 1",
          tujuanUpb: "UPB SD1",
          semester: "Ganjil",
          noBeritaAcara: "BA/MUT/001",
          tglBeritaAcara: "2024-01-20",
          tanggalPerolehan: "2024-01-15",
          keteranganPerolehan: "Perolehan rutin dari pusat",
          kodeBarang: "KB001",
          noRegister: "REG001",
          namaBarang: "Laptop ASUS VivoBook",
          merkType: "ASUS/X441",
          tahunBarang: "2023",
          ukuran: "14 inci",
          bahan: "Plastik",
          hargaSatuan: 5000000,
          jumlahBarang: 10,
          nilaiTotal: 50000000,
          namaRuangan: "Ruang Guru",
          kualifikasiAset: "Aset Tetap",
          kondisi: "Baik",
          keterangan: "Laptop untuk staf",
          lampiran: "mutasi_lptp_001.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Sesuai dokumen",
        },
        {
          id: 2,
          mutasiId: "MUT002",
          belanjaApbdId: "BLJ002",
          itemBelanjaApbdId: "ITBLJ002",
          kualifikasiPerolehan: "Dropping Pemda",
          asalLokasi: "Metro",
          asalBidang: "Dinas Kesehatan",
          asalUnit: "Puskesmas B",
          tujuanLokasi: "Bandar Lampung",
          tujuanBidang: "Dinas Kesehatan",
          tujuanUnit: "Puskesmas A",
          tujuanSubUnit: "Sub Unit A",
          tujuanUpb: "UPB PuskA",
          semester: "Ganjil",
          noBeritaAcara: "BA/MUT/002",
          tglBeritaAcara: "2024-02-25",
          tanggalPerolehan: "2024-02-20",
          keteranganPerolehan: "Transfer antar OPD",
          kodeBarang: "KB002",
          noRegister: "REG002",
          namaBarang: "Kursi Ergonomis",
          merkType: "IKEA/MARKUS",
          tahunBarang: "2022",
          ukuran: "Standar",
          bahan: "Fabric",
          hargaSatuan: 1500000,
          jumlahBarang: 5,
          nilaiTotal: 7500000,
          namaRuangan: "Ruang TU",
          kualifikasiAset: "Aset Tetap",
          kondisi: "Rusak Ringan",
          keterangan: "Ada goresan sedikit",
          lampiran: "mutasi_kursi_002.pdf",
          statusVerifikasi: "Menunggu",
          catatanVerifikasi: "",
        },
        {
          id: 3,
          mutasiId: "MUT003",
          belanjaApbdId: "BLJ003",
          itemBelanjaApbdId: "ITBLJ003",
          kualifikasiPerolehan: "Pembelian",
          asalLokasi: "Vendor X",
          asalBidang: "N/A",
          asalUnit: "N/A",
          tujuanLokasi: "Bandar Lampung",
          tujuanBidang: "Dinas Pendidikan",
          tujuanUnit: "SMPN 3",
          tujuanSubUnit: "Sub Unit 3",
          tujuanUpb: "UPB SMP3",
          semester: "Genap",
          noBeritaAcara: "BA/MUT/003",
          tglBeritaAcara: "2023-08-10",
          tanggalPerolehan: "2023-08-05",
          keteranganPerolehan: "Pembelian langsung",
          kodeBarang: "KB003",
          noRegister: "REG003",
          namaBarang: "Projector Epson",
          merkType: "Epson/EB-X06",
          tahunBarang: "2023",
          ukuran: "Portabel",
          bahan: "Plastik",
          hargaSatuan: 4000000,
          jumlahBarang: 2,
          nilaiTotal: 8000000,
          namaRuangan: "Aula",
          kualifikasiAset: "Aset Tetap",
          kondisi: "Baik",
          keterangan: "Untuk presentasi",
          lampiran: "mutasi_proj_003.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Unit baru",
        },
      ];

      setItemMutasiData(dummyItemMutasiData);
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
  const filteredData = itemMutasiData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesAllFilters =
      (selectedKualifikasiPerolehan === "" ||
        item.kualifikasiPerolehan === selectedKualifikasiPerolehan) &&
      (selectedAsal === "" || item.asalLokasi === selectedAsal) && // Filter berdasarkan asalLokasi
      (selectedTujuan === "" || item.tujuanLokasi === selectedTujuan) && // Filter berdasarkan tujuanLokasi
      (selectedSemester === "" || item.semester === selectedSemester) &&
      (selectedStatusVerifikasi === "" ||
        item.statusVerifikasi === selectedStatusVerifikasi) &&
      (selectedKualifikasiAset === "" ||
        item.kualifikasiAset === selectedKualifikasiAset) &&
      (selectedKondisi === "" || item.kondisi === selectedKondisi);

    return matchesSearch && matchesAllFilters;
  });

  const handleExport = () => console.log("Exporting Item Mutasi...");

  const handleRefresh = async () => {
    setSearchTerm("");
    setSelectedKualifikasiPerolehan("");
    setSelectedAsal("");
    setSelectedTujuan("");
    setSelectedSemester("");
    setSelectedStatusVerifikasi("");
    setSelectedKualifikasiAset("");
    setSelectedKondisi("");
    setDataTablePaginationModel({ page: 0, pageSize: entriesPerPage });

    await fetchData();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil dimuat ulang.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Definisi kolom untuk DataTable
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "mutasiId", headerName: "Mutasi", width: 100 },
    { field: "belanjaApbdId", headerName: "No Belanja APBD", width: 150 },
    {
      field: "itemBelanjaApbdId",
      headerName: "ID Item Belanja APBD",
      width: 180,
    },
    {
      field: "kualifikasiPerolehan",
      headerName: "Kualifikasi Perolehan",
      width: 180,
    },
    { field: "asalLokasi", headerName: "Asal", width: 120 }, // Asal (Lokasi)
    { field: "asalBidang", headerName: "Bidang Asal", width: 150 },
    { field: "asalUnit", headerName: "Unit Asal", width: 150 },
    { field: "tujuanLokasi", headerName: "Tujuan", width: 120 }, // Tujuan (Lokasi)
    { field: "tujuanBidang", headerName: "Bidang Tujuan", width: 150 },
    { field: "tujuanUnit", headerName: "Unit Tujuan", width: 150 },
    { field: "tujuanSubUnit", headerName: "Sub Unit Tujuan", width: 150 },
    { field: "tujuanUpb", headerName: "UPB Tujuan", width: 150 },
    { field: "semester", headerName: "Semester", width: 100 },
    { field: "noBeritaAcara", headerName: "No. Berita Acara", width: 150 },
    { field: "tglBeritaAcara", headerName: "Tgl. Berita Acara", width: 150 },
    { field: "tanggalPerolehan", headerName: "Tanggal Perolehan", width: 150 },
    {
      field: "keteranganPerolehan",
      headerName: "Keterangan Perolehan",
      width: 200,
    },
    { field: "kodeBarang", headerName: "Kode Barang", width: 120 },
    { field: "noRegister", headerName: "No Register", width: 120 },
    { field: "namaBarang", headerName: "Nama Barang", width: 200 },
    { field: "merkType", headerName: "Merk/Type", width: 150 },
    { field: "tahunBarang", headerName: "Tahun Barang", width: 120 },
    { field: "ukuran", headerName: "Ukuran", width: 100 },
    { field: "bahan", headerName: "Bahan", width: 100 },
    {
      field: "hargaSatuan",
      headerName: "Harga Satuan",
      type: "number",
      width: 150,
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
    { field: "namaRuangan", headerName: "Nama Ruangan", width: 150 },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 150 },
    { field: "kondisi", headerName: "Kondisi", width: 120 },
    { field: "keterangan", headerName: "Keterangan", width: 200 },
    { field: "lampiran", headerName: "Lampiran", width: 100 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    { field: "catatanVerifikasi", headerName: "Catatan Verifikasi", flex: 1 }, // Flex untuk mengisi sisa ruang
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() =>
              console.log("Lihat Detail Item Mutasi ID:", params.row.id)
            }
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

        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Item Mutasi</h1>

          {/* BARIS Filter */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Filters (kiri) - Menggunakan grid untuk responsifitas */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 flex-1">
              {/* Filter Kualifikasi Perolehan */}
              <select
                value={selectedKualifikasiPerolehan}
                onChange={(e) => {
                  setSelectedKualifikasiPerolehan(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              >
                <option value=""> -- Status Verifikasi -- </option>
                {statusVerifikasiData.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
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
                disabled={loading}
              >
                <option value=""> -- Kualifikasi Aset -- </option>
                {kualifikasiAsetData.map((k) => (
                  <option key={k.id} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
              </select>

              {/* Filter Kondisi */}
              <select
                value={selectedKondisi}
                onChange={(e) => {
                  setSelectedKondisi(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
                disabled={loading}
              >
                <option value=""> -- Kondisi -- </option>
                {kondisiData.map((k) => (
                  <option key={k.id} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Refresh */}
            <div className="flex gap-2 items-center lg:self-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          {/* DataTable Component */}
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
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemMutasiPage;
