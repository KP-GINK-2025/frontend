import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { RefreshCw, Download, Search } from "lucide-react";
import DataTable from "../../../../components/DataTable";

const PostingBelanjaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [postingBelanjaData, setPostingBelanjaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data dropdown filter
  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [kualifikasiBelanjaData, setKualifikasiBelanjaData] = useState([]);
  const [kualifikasiAsetData, setKualifikasiAsetData] = useState([]);

  // Selected filter states
  const [selectedBidang, setSelectedBidang] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState("");
  const [selectedUpb, setSelectedUpb] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedKualifikasiBelanja, setSelectedKualifikasiBelanja] =
    useState("");
  const [selectedKualifikasiAset, setSelectedKualifikasiAset] = useState("");

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
      setKualifikasiBelanjaData([
        { id: 1, nama: "Barang" },
        { id: 2, nama: "Jasa" },
        { id: 3, nama: "Modal" },
      ]);
      setKualifikasiAsetData([
        { id: 1, nama: "Aset Tetap" },
        { id: 2, nama: "Bukan Aset" },
      ]);

      // Dummy data untuk tabel Posting Belanja
      const dummyPostingBelanjaData = [
        {
          id: 1,
          belanjaApbdId: "BLJ001",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          upb: "UPB 001",
          semester: "1",
          tanggalPerolehan: "2024-01-15",
          kegiatan: "Kegiatan A",
          pekerjaan: "Pengadaan Komputer",
          kontrak: "Kontrak-A-001",
          kualifikasiBelanja: "Barang",
          jenisItem: "Elektronik",
          kodeBarang: "KB001",
          namaBarang: "Laptop ASUS",
          merkType: "ASUS/X441",
          ukuran: "14 inci",
          jumlahBarang: 10,
          nilaiTotal: 50000000,
          kualifikasiAset: "Aset Tetap",
          peningkatanKualitas: "Tidak ada",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Sesuai",
          jumlahPosting: 2,
        },
        {
          id: 2,
          belanjaApbdId: "BLJ002",
          bidang: "Bidang Kesehatan",
          unit: "Dinas Kesehatan",
          subUnit: "Sub Unit Puskesmas",
          upb: "UPB 002",
          semester: "1",
          tanggalPerolehan: "2024-02-20",
          kegiatan: "Kegiatan B",
          pekerjaan: "Renovasi Gedung",
          kontrak: "Kontrak-B-001",
          kualifikasiBelanja: "Jasa",
          jenisItem: "Konstruksi",
          kodeBarang: "KC001",
          namaBarang: "Cat Dinding",
          merkType: "Dulux/Weatherbond",
          ukuran: "5 kg",
          jumlahBarang: 50,
          nilaiTotal: 25000000,
          kualifikasiAset: "Bukan Aset",
          peningkatanKualitas: "Ada",
          statusVerifikasi: "Menunggu",
          catatanVerifikasi: "",
          jumlahPosting: 0,
        },
        {
          id: 3,
          belanjaApbdId: "BLJ003",
          bidang: "Bidang Pendidikan",
          unit: "Dinas Pendidikan",
          subUnit: "Sub Unit Sekolah",
          upb: "UPB 001",
          semester: "2",
          tanggalPerolehan: "2024-03-01",
          kegiatan: "Kegiatan C",
          pekerjaan: "Pemasangan CCTV",
          kontrak: "Kontrak-C-001",
          kualifikasiBelanja: "Jasa",
          jenisItem: "Elektronik",
          kodeBarang: "KB002",
          namaBarang: "CCTV Outdoor",
          merkType: "Hikvision/DS-2CE",
          ukuran: "2MP",
          jumlahBarang: 5,
          nilaiTotal: 7500000,
          kualifikasiAset: "Aset Tetap",
          peningkatanKualitas: "Tidak ada",
          statusVerifikasi: "Diverifikasi",
          catatanVerifikasi: "Selesai",
          jumlahPosting: 1,
        },
      ];

      setPostingBelanjaData(dummyPostingBelanjaData);
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
  const filteredData = postingBelanjaData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesAllFilters =
      (selectedBidang === "" || item.bidang === selectedBidang) &&
      (selectedUnit === "" || item.unit === selectedUnit) &&
      (selectedSubUnit === "" || item.subUnit === selectedSubUnit) &&
      (selectedUpb === "" || item.upb === selectedUpb) &&
      (selectedSemester === "" || item.semester === selectedSemester) &&
      (selectedKualifikasiBelanja === "" ||
        item.kualifikasiBelanja === selectedKualifikasiBelanja) &&
      (selectedKualifikasiAset === "" ||
        item.kualifikasiAset === selectedKualifikasiAset);

    return matchesSearch && matchesAllFilters;
  });

  const handleExport = () => console.log("Exporting Posting Belanja...");

  const handleRefresh = () => {
    setLoading(true);
    setSearchTerm("");
    setSelectedBidang("");
    setSelectedUnit("");
    setSelectedSubUnit("");
    setSelectedUpb("");
    setSelectedSemester("");
    setSelectedKualifikasiBelanja("");
    setSelectedKualifikasiAset("");
    fetchData();
  };

  // Tidak ada handleOpenAddModal, handleCloseAddModal, handleSaveNewItem, handleEditClick, handleDeleteClick

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "belanjaApbdId", headerName: "No Belanja APBD", width: 150 },
    { field: "bidang", headerName: "Bidang", width: 150 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "subUnit", headerName: "Sub Unit", width: 150 },
    { field: "upb", headerName: "UPB", width: 120 },
    { field: "semester", headerName: "Semester", width: 100 },
    { field: "tanggalPerolehan", headerName: "Tanggal Perolehan", width: 150 },
    { field: "kegiatan", headerName: "Kegiatan", width: 200 },
    { field: "pekerjaan", headerName: "Pekerjaan", width: 200 },
    { field: "kontrak", headerName: "Kontrak", width: 150 },
    { field: "kualifikasiBelanja", headerName: "Jenis Belanja", width: 150 },
    { field: "jenisItem", headerName: "Jenis Item", width: 120 },
    { field: "kodeBarang", headerName: "Kode Barang", width: 120 },
    { field: "namaBarang", headerName: "Nama Barang", width: 200 },
    { field: "merkType", headerName: "Merk/Type", width: 150 },
    { field: "ukuran", headerName: "Ukuran", width: 100 },
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
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 150 },
    {
      field: "peningkatanKualitas",
      headerName: "Peningkatan Kualitas",
      width: 150,
    },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 200,
    },
    {
      field: "jumlahPosting",
      headerName: "Jumlah Posting",
      type: "number",
      width: 120,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2 items-center">
          {/* <button
            onClick={() => console.log("Posting Item ID:", params.row.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
          >
            Posting
          </button> */}
          {/* Opsional: Tombol Lihat Detail jika diperlukan */}
          <button
            onClick={() => console.log("Lihat Detail Item ID:", params.row.id)}
            className=" bg-[#B53C3C] p-2 text-white hover:bg-gray-300 hover:text-[#B53C3C] rounded-md text-sm cursor-pointer"
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
          <h1 className="text-2xl font-bold mb-6">Posting Belanja APBD</h1>

          {/* BARIS Filter & Tombol Aksi */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            {/* Dropdown Filters (kiri) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 flex-1">
              {" "}
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
              {/* Filter Jenis Belanja (Kualifikasi Belanja) */}
              <select
                value={selectedKualifikasiBelanja}
                onChange={(e) => {
                  setSelectedKualifikasiBelanja(e.target.value);
                  setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">-- Jenis Belanja --</option>
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
            </div>

            {/* Tombol Refresh */}
            <div className="flex gap-2 items-center lg:self-end">
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              {/* Tidak ada tombol Add di halaman ini */}
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

export default PostingBelanjaPage;
