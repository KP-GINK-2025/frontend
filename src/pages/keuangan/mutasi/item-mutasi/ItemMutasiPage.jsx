import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { RefreshCw, Download, Search, Sheet } from "lucide-react";
import Swal from "sweetalert2";
import { ColumnManager } from "@/components/table";

const ItemMutasiPage = () => {
  // State untuk data dan UI
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [itemMutasiData, setItemMutasiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data dropdown filter
  const [filterData, setFilterData] = useState({
    kualifikasiPerolehan: [],
    asal: [],
    tujuan: [],
    semester: [],
    statusVerifikasi: [],
    kualifikasiAset: [],
    kondisi: [],
  });

  // State untuk filter yang dipilih
  const [filters, setFilters] = useState({
    kualifikasiPerolehan: "",
    asal: "",
    tujuan: "",
    semester: "",
    statusVerifikasi: "",
    kualifikasiAset: "",
    kondisi: "",
  });

  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0,
    pageSize: entriesPerPage,
  });

  // State untuk visibilitas kolom
  const [columnVisibility, setColumnVisibility] = useState({
    action: true,
    no: true,
    asalLokasi: true,
    tujuanLokasi: true,
    noBeritaAcara: true,
    tglBeritaAcara: true,
    tanggalPerolehan: true,
    kodeBarang: true,
    namaBarang: true,
    merkType: true,
    jumlahBarang: true,
    nilaiTotal: true,
    kualifikasiAset: true,
    statusVerifikasi: true,
    // Kolom lainnya disembunyikan
    mutasi: false,
    id: false,
    kualifikasiPerolehan: false,
    asalKode: false,
    bidang: false,
    unit: false,
    bidangTujuan: false,
    unitTujuan: false,
    subUnitTujuan: false,
    upbTujuan: false,
    belanjaApbd: false,
    itemBelanjaApbd: false,
    kibId: false,
    kelompok: false,
    subKelompok: false,
    subSubKelompok: false,
    subSubKelompok6: false,
    subSubKelompok7: false,
    semester: false,
    keteranganPerolehan: false,
    noRegister: false,
    tahunBarang: false,
    ukuran: false,
    bahan: false,
    hargaSatuan: false,
    namaRuangan: false,
    kondisi: false,
    keterangan: false,
    lampiran: false,
    catatanVerifikasi: false,
  });

  // Fetch data dari API/dummy
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulasi delay API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Set data dropdown filter
      setFilterData({
        kualifikasiPerolehan: [
          { id: 1, nama: "Dropping Pusat" },
          { id: 2, nama: "Dropping Pemda" },
        ],
        asal: [
          { id: 1, nama: "Dinas Lingkungan Hidup" },
          { id: 2, nama: "Dinas Perpustakaan dan Kearsipan Daerah" },
        ],
        tujuan: [
          { id: 1, nama: "Dinas Pekerjaan Umum dan Perumahan Rakyat" },
          { id: 2, nama: "Sekretariat Daerah" },
        ],
        semester: [
          { id: 1, nama: "Ganjil" },
          { id: 2, nama: "Genap" },
        ],
        statusVerifikasi: [
          { id: 1, nama: "Draft" },
          { id: 2, nama: "Valid" },
        ],
        kualifikasiAset: [
          { id: 1, nama: "INTRA COUNTABLE" },
          { id: 2, nama: "Aset Tetap" },
        ],
        kondisi: [
          { id: 1, nama: "Baik" },
          { id: 2, nama: "Rusak" },
        ],
      });

      // Dummy data untuk tabel
      const dummyData = [
        {
          mutasi: "MUT001",
          id: 1,
          kualifikasiPerolehan: "Dropping Pusat",
          asalKode: "18.0.16.1.1.1",
          asalLokasi: "Dinas Lingkungan Hidup",
          bidang: "13",
          unit: "3",
          tujuanLokasi: "Dinas Pekerjaan Umum dan Perumahan Rakyat",
          bidangTujuan: "Pekerjaan Umum",
          unitTujuan: "Seksi Konstruksi",
          subUnitTujuan: "Sub Unit Konstruksi",
          upbTujuan: "UPB PU",
          belanjaApbd: "BLJ001",
          itemBelanjaApbd: "ITBLJ001",
          kibId: "KIB001",
          kelompok: "Kelompok 1",
          subKelompok: "Sub Kelompok 1",
          subSubKelompok: "Sub Sub Kelompok 1",
          subSubKelompok6: "Sub Sub Kelompok 6",
          subSubKelompok7: "Sub Sub Kelompok 7",
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
          nilaiTotal: 15000,
          namaRuangan: "-",
          kualifikasiAset: "INTRA COUNTABLE",
          kondisi: "Baik",
          keterangan: "-",
          lampiran: "-",
          statusVerifikasi: "Draft",
          catatanVerifikasi: "",
        },
        {
          mutasi: "MUT002",
          id: 2,
          kualifikasiPerolehan: "Dropping Pemda",
          asalKode: "18.0.16.1.1.1",
          asalLokasi: "Dinas Perpustakaan dan Kearsipan Daerah",
          bidang: "13",
          unit: "3",
          tujuanLokasi: "Sekretariat Daerah",
          bidangTujuan: "Pekerjaan Umum",
          unitTujuan: "Seksi Konstruksi",
          subUnitTujuan: "Sub Unit Konstruksi",
          upbTujuan: "UPB PU",
          belanjaApbd: "BLJ002",
          itemBelanjaApbd: "ITBLJ002",
          kibId: "KIB002",
          kelompok: "Kelompok 1",
          subKelompok: "Sub Kelompok 1",
          subSubKelompok: "Sub Sub Kelompok 1",
          subSubKelompok6: "Sub Sub Kelompok 6",
          subSubKelompok7: "Sub Sub Kelompok 7",
          semester: "Genap",
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
          nilaiTotal: 20000,
          namaRuangan: "-",
          kualifikasiAset: "Aset Tetap",
          kondisi: "Rusak",
          keterangan: "-",
          lampiran: "-",
          statusVerifikasi: "Valid",
          catatanVerifikasi: "",
        },
      ];

      setItemMutasiData(dummyData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setDataTablePaginationModel((prev) => ({
      ...prev,
      pageSize: entriesPerPage,
    }));
  }, [entriesPerPage]);

  // Filter data berdasarkan search dan dropdown
  const filteredData = itemMutasiData.filter((item) => {
    const matchesSearch = Object.values(item).some((val) =>
      String(val)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (value === "") return true;

      const fieldMap = {
        asal: "asalLokasi",
        tujuan: "tujuanLokasi",
      };

      const fieldName = fieldMap[key] || key;
      return item[fieldName] === value;
    });

    return matchesSearch && matchesFilters;
  });

  // Hitung total
  const totals = filteredData.reduce(
    (acc, item) => ({
      jumlahBarang: acc.jumlahBarang + item.jumlahBarang,
      nilaiTotal: acc.nilaiTotal + item.nilaiTotal,
    }),
    { jumlahBarang: 0, nilaiTotal: 0 }
  );

  // Buat row total - label "Total" dipindah ke kolom no
  const createEmptyFields = () => ({
    id: "total-row", // Ubah ID agar tidak bentrok dengan data normal
    mutasi: "",
    kualifikasiPerolehan: "",
    asalKode: "",
    asalLokasi: "",
    bidang: "",
    unit: "",
    tujuanLokasi: "",
    bidangTujuan: "",
    unitTujuan: "",
    subUnitTujuan: "",
    upbTujuan: "",
    belanjaApbd: "",
    itemBelanjaApbd: "",
    kibId: "",
    kelompok: "",
    subKelompok: "",
    subSubKelompok: "",
    subSubKelompok6: "",
    subSubKelompok7: "",
    semester: "",
    noBeritaAcara: "",
    tglBeritaAcara: "",
    tanggalPerolehan: "",
    keteranganPerolehan: "",
    kodeBarang: "",
    noRegister: "",
    namaBarang: "",
    merkType: "",
    tahunBarang: "",
    ukuran: "",
    bahan: "",
    hargaSatuan: "",
    namaRuangan: "",
    kualifikasiAset: "",
    kondisi: "",
    keterangan: "",
    lampiran: "",
    statusVerifikasi: "",
    catatanVerifikasi: "",
    action: "",
    no: "",
  });

  const totalRow = {
    ...createEmptyFields(),
    jumlahBarang: totals.jumlahBarang,
    nilaiTotal: totals.nilaiTotal,
  };

  const dataWithTotal = [...filteredData, totalRow];

  // Event handlers
  const handleLihatClick = (id) => {
    console.log("Lihat Item Mutasi clicked for ID:", id);
  };

  const handleLihatDetailMutasiClick = (id) => {
    console.log("Lihat Detail Mutasi clicked for ID:", id);
  };

  const handleExport = () => {
    console.log("Exporting Item Mutasi...");
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleRefresh = async () => {
    setSearchTerm("");
    setFilters({
      kualifikasiPerolehan: "",
      asal: "",
      tujuan: "",
      semester: "",
      statusVerifikasi: "",
      kualifikasiAset: "",
      kondisi: "",
    });
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

  // Utility functions
  const formatCurrency = (value) => {
    if (!value || value === 0) return "0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Definisi kolom
  const columnDefinitions = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === "total-row") return null;
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
        if (params.row.id === "total-row") {
          return <span className="font-bold">Total</span>;
        }
        return (
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1 +
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize
        );
      },
    },
    { field: "mutasi", headerName: "Mutasi", width: 200 },
    {
      field: "id",
      headerName: "ID",
      width: 200,
      renderCell: (params) => {
        // Jika ini adalah total row, return kosong
        if (params.row.id === "total-row") return "";
        return params.value;
      },
    },
    {
      field: "kualifikasiPerolehan",
      headerName: "Kualifikasi Perolehan",
      width: 200,
    },
    { field: "asalKode", headerName: "Kode Asal", width: 200 },
    { field: "asalLokasi", headerName: "Asal Lokasi", width: 200 },
    { field: "bidang", headerName: "Bidang", width: 200 },
    { field: "unit", headerName: "Unit", width: 200 },
    { field: "tujuanLokasi", headerName: "Tujuan", width: 200 },
    { field: "bidangTujuan", headerName: "Bidang Tujuan", width: 200 },
    { field: "unitTujuan", headerName: "Unit Tujuan", width: 200 },
    { field: "subUnitTujuan", headerName: "Sub Unit Tujuan", width: 200 },
    { field: "upbTujuan", headerName: "UPB Tujuan", width: 200 },
    { field: "belanjaApbd", headerName: "Belanja APBD", width: 200 },
    { field: "itemBelanjaApbd", headerName: "Item Belanja APBD", width: 200 },
    { field: "kibId", headerName: "KIB ID", width: 200 },
    { field: "kelompok", headerName: "Kelompok", width: 200 },
    { field: "subKelompok", headerName: "Sub Kelompok", width: 200 },
    { field: "subSubKelompok", headerName: "Sub Sub Kelompok", width: 200 },
    { field: "subSubKelompok6", headerName: "Sub Sub Kelompok6", width: 200 },
    { field: "subSubKelompok7", headerName: "Sub Sub Kelompok7", width: 200 },
    { field: "semester", headerName: "Semester", width: 200 },
    { field: "noBeritaAcara", headerName: "No. Berita Acara", width: 150 },
    { field: "tglBeritaAcara", headerName: "Tgl. Berita Acara", width: 150 },
    { field: "tanggalPerolehan", headerName: "Tanggal Perolehan", width: 150 },
    {
      field: "keteranganPerolehan",
      headerName: "Keterangan Perolehan",
      width: 200,
    },
    { field: "kodeBarang", headerName: "Kode Barang", width: 150 },
    { field: "noRegister", headerName: "No Register", width: 200 },
    { field: "namaBarang", headerName: "Nama Barang", width: 200 },
    { field: "merkType", headerName: "Merk/Type", width: 150 },
    { field: "tahunBarang", headerName: "Tahun Barang", width: 200 },
    { field: "ukuran", headerName: "Ukuran", width: 200 },
    { field: "bahan", headerName: "Bahan", width: 200 },
    { field: "hargaSatuan", headerName: "Harga Satuan", width: 200 },
    {
      field: "jumlahBarang",
      headerName: "Jumlah Barang",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <span className="font-semibold">{params.value}</span>
      ),
    },
    {
      field: "nilaiTotal",
      headerName: "Nilai Total",
      width: 150,
      renderCell: (params) => (
        <span className="font-semibold">{formatCurrency(params.value)}</span>
      ),
    },
    { field: "namaRuangan", headerName: "Nama Ruangan", width: 200 },
    { field: "kualifikasiAset", headerName: "Kualifikasi Aset", width: 150 },
    { field: "kondisi", headerName: "Kondisi", width: 200 },
    { field: "keterangan", headerName: "Keterangan", width: 200 },
    { field: "lampiran", headerName: "Lampiran", width: 200 },
    { field: "statusVerifikasi", headerName: "Status Verifikasi", width: 150 },
    {
      field: "catatanVerifikasi",
      headerName: "Catatan Verifikasi",
      width: 200,
    },
  ];

  // Filter kolom berdasarkan visibility
  const visibleColumns = columnDefinitions.filter(
    (column) => columnVisibility[column.field] !== false
  );

  // Render filter dropdown
  const renderFilterDropdown = (filterKey, label, options) => (
    <select
      value={filters[filterKey]}
      onChange={(e) => handleFilterChange(filterKey, e.target.value)}
      className="w-full md:max-w-xs border border-gray-300 rounded px-3 py-2 text-sm"
      disabled={loading}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.nama}>
          {option.nama}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="px-8 py-8">
        <Breadcrumbs />

        {/* Export Button */}
        <div className="flex justify-end items-center gap-2 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Item Mutasi</h1>

          {/* Filter Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 flex-1">
              {renderFilterDropdown(
                "kualifikasiPerolehan",
                " -- Kualifikasi Perolehan -- ",
                filterData.kualifikasiPerolehan
              )}
              {renderFilterDropdown("asal", " -- Asal -- ", filterData.asal)}
              {renderFilterDropdown(
                "tujuan",
                " -- Tujuan -- ",
                filterData.tujuan
              )}
              {renderFilterDropdown(
                "semester",
                " -- Semester -- ",
                filterData.semester
              )}
              {renderFilterDropdown(
                "statusVerifikasi",
                " -- Status Verifikasi -- ",
                filterData.statusVerifikasi
              )}
              {renderFilterDropdown(
                "kualifikasiAset",
                " -- Kualifikasi Aset -- ",
                filterData.kualifikasiAset
              )}
              {renderFilterDropdown(
                "kondisi",
                " -- Kondisi -- ",
                filterData.kondisi
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1"
                disabled={loading}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
              <ColumnManager
                columns={columnDefinitions}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
              />
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

          {/* DataTable */}
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
                rows={dataWithTotal}
                columns={visibleColumns}
                initialPageSize={entriesPerPage}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                height={500}
                emptyRowsMessage="Tidak ada data tersedia"
                paginationModel={dataTablePaginationModel}
                onPaginationModelChange={setDataTablePaginationModel}
                loading={loading}
                getRowClassName={(params) =>
                  params.id === "total-row" ? "bg-gray-100 font-bold" : ""
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
