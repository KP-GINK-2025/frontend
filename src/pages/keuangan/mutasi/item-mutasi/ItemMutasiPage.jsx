import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Download, Search, Sheet } from "lucide-react";
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
        { id: 1, nama: "Dinas Lingkungan Hidup" },
        { id: 2, nama: "Dinas Perpustaan dan Kearsipan Daerah" },
        { id: 3, nama: "Badan Pengelola Keuangan dan Aset Daerah" },
      ]);
      setTujuanData([
        { id: 1, nama: "Dinas Pekerjaan Umum dan Perumahan Rakyat" },
        { id: 2, nama: "Sekretariat Daerah" },
        { id: 3, nama: "Badan Pendapatan Daerah" },
      ]);
      setSemesterData([
        { id: 1, nama: "Ganjil" },
        { id: 2, nama: "Genap" },
      ]);
      setStatusVerifikasiData([
        { id: 1, nama: "Diverifikasi" },
        { id: 2, nama: "Menunggu" },
        { id: 3, nama: "Ditolak" },
        { id: 4, nama: "Draft" },
      ]);
      setKualifikasiAsetData([
        { id: 1, nama: "INTRA COUNTABLE" },
        { id: 2, nama: "Aset Tetap" },
        { id: 3, nama: "Bukan Aset" },
      ]);
      setKondisiData([
        { id: 1, nama: "Baik" },
        { id: 2, nama: "Rusak Ringan" },
        { id: 3, nama: "Rusak Berat" },
      ]);

      // Dummy data untuk tabel Item Mutasi berdasarkan screenshot
      const dummyItemMutasiData = [
        {
          id: 1,
          mutasiId: "MUT001",
          belanjaApbdId: "BLJ001",
          itemBelanjaApbdId: "ITBLJ001",
          kualifikasiPerolehan: "Dropping Pusat",
          asalLokasi: "Dinas Lingkungan Hidup",
          asalBidang: "Lingkungan Hidup",
          asalUnit: "Seksi Pengelolaan",
          tujuanLokasi: "Dinas Pekerjaan Umum dan Perumahan Rakyat",
          tujuanBidang: "Pekerjaan Umum",
          tujuanUnit: "Seksi Konstruksi",
          tujuanSubUnit: "Sub Unit Konstruksi",
          tujuanUpb: "UPB PU",
          semester: "Ganjil",
          noBeritaAcara: "028/374 a...",
          tglBeritaAcara: "17/12/2024",
          tanggalPerolehan: "24/11/2021",
          keteranganPerolehan: "Transfer antar OPD",
          kodeBarang: "1.3.1.01.01.0...",
          noRegister: "REG001",
          namaBarang: "Tanah Perumahan Gol 1 Griya Abd",
          merkType: "-",
          tahunBarang: "2021",
          ukuran: "-",
          bahan: "-",
          hargaSatuan: 0,
          jumlahBarang: 1,
          nilaiTotal: 0,
          namaRuangan: "-",
          kualifikasiAset: "INTRA COUNTABLE",
          kondisi: "Baik",
          keterangan: "-",
          lampiran: "-",
          statusVerifikasi: "Draft",
        },
        {
          id: 2,
          mutasiId: "MUT002",
          belanjaApbdId: "BLJ002",
          itemBelanjaApbdId: "ITBLJ002",
          kualifikasiPerolehan: "Dropping Pemda",
          asalLokasi: "Dinas Perpustaan dan Kearsipan Daerah",
          asalBidang: "Perpustakaan",
          asalUnit: "Seksi Layanan",
          tujuanLokasi: "Sekretariat Daerah",
          tujuanBidang: "Sekretariat",
          tujuanUnit: "Bagian Umum",
          tujuanSubUnit: "Sub Bagian Umum",
          tujuanUpb: "UPB Sekda",
          semester: "Genap",
          noBeritaAcara: "024/58/37...",
          tglBeritaAcara: "04/06/2025",
          tanggalPerolehan: "31/12/2005",
          keteranganPerolehan: "Mutasi rutin",
          kodeBarang: "1.3.2.02.01.0...",
          noRegister: "REG002",
          namaBarang: "Alat Angkutan Darat Bermotor",
          merkType: "Toyota/Avanza",
          tahunBarang: "2005",
          ukuran: "1500cc",
          bahan: "Metal",
          hargaSatuan: 125000000,
          jumlahBarang: 1,
          nilaiTotal: 125000000,
          namaRuangan: "Parkir",
          kualifikasiAset: "INTRA COUNTABLE",
          kondisi: "Baik",
          keterangan: "Kendaraan operasional",
          lampiran: "mutasi_kendaraan_002.pdf",
          statusVerifikasi: "Draft",
        },
        {
          id: 3,
          mutasiId: "MUT003",
          belanjaApbdId: "BLJ003",
          itemBelanjaApbdId: "ITBLJ003",
          kualifikasiPerolehan: "Hibah",
          asalLokasi: "Badan Pengelola Keuangan dan Aset Daerah",
          asalBidang: "Pengelolaan Keuangan",
          asalUnit: "Seksi Aset",
          tujuanLokasi: "Badan Pendapatan Daerah",
          tujuanBidang: "Pendapatan",
          tujuanUnit: "Seksi Pajak",
          tujuanSubUnit: "Sub Seksi Pajak",
          tujuanUpb: "UPB Bapenda",
          semester: "Ganjil",
          noBeritaAcara: "900/1080/...",
          tglBeritaAcara: "06/01/2025",
          tanggalPerolehan: "31/12/2002",
          keteranganPerolehan: "Hibah dari pemerintah pusat",
          kodeBarang: "1.3.2.02.01.0...",
          noRegister: "REG003",
          namaBarang: "Alat Angkutan Darat",
          merkType: "Suzuki/APV",
          tahunBarang: "2002",
          ukuran: "1500cc",
          bahan: "Metal",
          hargaSatuan: 65000000,
          jumlahBarang: 1,
          nilaiTotal: 65000000,
          namaRuangan: "Parkir",
          kualifikasiAset: "INTRA COUNTABLE",
          kondisi: "Rusak Ringan",
          keterangan: "Perlu perbaikan",
          lampiran: "mutasi_kendaraan_003.pdf",
          statusVerifikasi: "Draft",
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

  const handleLihatClick = (id) => {
    if (id !== "total") {
      console.log("Lihat Item Mutasi clicked for ID:", id);
      // Logic to view individual item details
    }
  };

  const handleLihatDetailMutasiClick = (id) => {
    if (id !== "total") {
      console.log("Lihat Detail Mutasi clicked for ID:", id);
      // Logic to view the detailed mutation document
    }
  };

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

  // Format currency untuk display
  const formatCurrency = (value) => {
    if (!value || value === 0) return "0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // --- LOGIKA TOTAL BARU DIMULAI DI SINI ---

  // Hitung total dari data yang sudah difilter
  const totalJumlahBarang = filteredData.reduce(
    (sum, item) => sum + item.jumlahBarang,
    0
  );
  const totalNilai = filteredData.reduce(
    (sum, item) => sum + item.nilaiTotal,
    0
  );

  // Buat objek baris total
  const totalRow = {
    id: "total",
    asalLokasi: "Total", // Gunakan kolom yang relevan untuk label
    jumlahBarang: totalJumlahBarang,
    nilaiTotal: totalNilai,
    // Kosongkan field lain yang tidak relevan di baris total
    action: "",
    no: "",
    tujuanLokasi: "",
    noBeritaAcara: "",
    tglBeritaAcara: "",
    tanggalPerolehan: "",
    kodeBarang: "",
    namaBarang: "",
    merkType: "",
    kualifikasiAset: "",
    statusVerifikasi: "",
  };

  // Gabungkan baris total ke data yang akan ditampilkan
  const dataWithTotal = [...filteredData, totalRow];

  // --- LOGIKA TOTAL SELESAI ---

  // Definisi kolom untuk DataTable
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        // Jangan render action button untuk baris total
        if (params.row.id === "total") return null;
        return (
          <div className="flex items-center gap-3 h-full">
            <button
              onClick={() => handleLihatClick(params.row.id)}
              className="text-blue-600 hover:text-blue-800 cursor-pointer p-1 hover:bg-blue-50 rounded"
              title="Lihat Item Mutasi"
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => handleLihatDetailMutasiClick(params.row.id)}
              className="text-green-600 hover:text-green-800 cursor-pointer p-1 hover:bg-green-50 rounded"
              title="Lihat Detail Mutasi"
            >
              <Sheet size={16} />
            </button>
          </div>
        );
      },
    },
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        // Jangan render nomor untuk baris total
        if (params.row.id === "total") return null;
        return (
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1 +
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize
        );
      },
    },
    {
      field: "asalLokasi",
      headerName: "Asal",
      width: 200,
      renderCell: (params) => {
        // Tampilkan label "Total" dengan bold
        if (params.row.id === "total")
          return <span className="font-bold">{params.value}</span>;
        return params.value;
      },
    },
    { field: "tujuanLokasi", headerName: "Tujuan", width: 200 },
    { field: "noBeritaAcara", headerName: "No. Berita Acara", width: 150 },
    { field: "tglBeritaAcara", headerName: "Tgl. Berita Acara", width: 150 },
    { field: "tanggalPerolehan", headerName: "Tanggal Perolehan", width: 150 },
    { field: "kodeBarang", headerName: "Kode Barang", width: 150 },
    { field: "namaBarang", headerName: "Nama Barang", width: 200 },
    { field: "merkType", headerName: "Merk/Type", width: 150 },
    {
      field: "jumlahBarang",
      headerName: "Jumlah Barang",
      type: "number",
      width: 120,
      renderCell: (params) => (
        // Tampilkan nilai total dengan bold
        <span className="font-semibold">{params.value}</span>
      ),
    },
    {
      field: "nilaiTotal",
      headerName: "Nilai Total",
      width: 150,
      renderCell: (params) => (
        // Tampilkan nilai total dengan format mata uang dan bold
        <span className="font-semibold">{formatCurrency(params.value)}</span>
      ),
    },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 150 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
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
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                rows={dataWithTotal} // Gunakan dataWithTotal
                columns={columns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={loading}
                // Tambahkan styling khusus untuk baris total
                getRowClassName={(params) =>
                  params.id === "total" ? "bg-gray-100 font-bold" : ""
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemMutasiPage;
