import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Download, Search } from "lucide-react";
import Swal from "sweetalert2";

const PostingMutasiPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [postingMutasiData, setPostingMutasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data dropdown filter
  const [kualifikasiPerolehanData, setKualifikasiPerolehanData] = useState([]);
  const [asalData, setAsalData] = useState([]);
  const [tujuanData, setTujuanData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);

  // Selected filter states
  const [selectedKualifikasiPerolehan, setSelectedKualifikasiPerolehan] =
    useState("");
  const [selectedAsal, setSelectedAsal] = useState("");
  const [selectedTujuan, setSelectedTujuan] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

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

      // Dummy data untuk tabel Posting Mutasi
      const dummyPostingMutasiData = [
        {
          id: 1,
          kualifikasiPerolehan: "Dropping Pusat",
          asal: "Jakarta",
          tujuan: "Bandar Lampung",
          tahun: "2024",
          semester: "Ganjil",
          noBeritaAcara: "BA/DP/001",
          tglBeritaAcara: "2024-01-20",
          totalBarang: 50,
          totalHarga: 250000000,
          lampiran: "lampiran_dp001.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Dokumen lengkap",
          posting: "Sudah Posting",
        },
        {
          id: 2,
          kualifikasiPerolehan: "Dropping Pemda",
          asal: "Metro",
          tujuan: "Bandar Lampung",
          tahun: "2024",
          semester: "Ganjil",
          noBeritaAcara: "BA/DPM/002",
          tglBeritaAcara: "2024-02-25",
          totalBarang: 20,
          totalHarga: 75000000,
          lampiran: "lampiran_dpm002.pdf",
          statusVerifikasi: "Menunggu",
          catatanVerifikasi: "",
          posting: "Belum Posting",
        },
        {
          id: 3,
          kualifikasiPerolehan: "Pembelian",
          asal: "Bandar Lampung",
          tujuan: "Bandar Lampung",
          tahun: "2023",
          semester: "Genap",
          noBeritaAcara: "BA/PBL/003",
          tglBeritaAcara: "2023-08-10",
          totalBarang: 5,
          totalHarga: 10000000,
          lampiran: "lampiran_pbl003.pdf",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Pembelian rutin",
          posting: "Sudah Posting",
        },
      ];

      setPostingMutasiData(dummyPostingMutasiData);
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
  const filteredData = postingMutasiData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesAllFilters =
      (selectedKualifikasiPerolehan === "" ||
        item.kualifikasiPerolehan === selectedKualifikasiPerolehan) &&
      (selectedAsal === "" || item.asal === selectedAsal) &&
      (selectedTujuan === "" || item.tujuan === selectedTujuan) &&
      (selectedSemester === "" || item.semester === selectedSemester);

    return matchesSearch && matchesAllFilters;
  });

  const handleExport = () => console.log("Exporting Posting Mutasi...");

  const handleRefresh = async () => {
    setSearchTerm("");
    setSelectedKualifikasiPerolehan("");
    setSelectedAsal("");
    setSelectedTujuan("");
    setSelectedSemester("");
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

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "kualifikasiPerolehan",
      headerName: "Kualifikasi Perolehan",
      width: 180,
    },
    { field: "asal", headerName: "Asal", width: 120 },
    { field: "tujuan", headerName: "Tujuan", width: 120 },
    { field: "tahun", headerName: "Tahun", width: 100 },
    { field: "semester", headerName: "Semester", width: 100 },
    { field: "noBeritaAcara", headerName: "No. Berita Acara", width: 150 },
    { field: "tglBeritaAcara", headerName: "Tgl. Berita Acara", width: 150 },
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
    { field: "lampiran", headerName: "Lampiran", width: 100 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 200,
    },
    { field: "posting", headerName: "Posting", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => console.log("Posting Mutasi ID:", params.row.id)}
            className="bg-[#B53C3C] p-2 text-white hover:bg-gray-300 hover:text-[#B53C3C] rounded-md text-sm cursor-pointer"
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
          <h1 className="text-2xl font-bold mb-6">Posting Mutasi</h1>

          {/* BARIS Filter & Tombol Aksi */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Filters (kiri) */}
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

export default PostingMutasiPage;
