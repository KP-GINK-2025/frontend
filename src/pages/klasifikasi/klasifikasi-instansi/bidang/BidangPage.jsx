import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import Navbar from "../../../../components/Navbar";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import AddBidangModal from "./AddBidangModal";
import DataTable from "../../../../components/DataTable";

const BidangPage = () => {
  // --- State untuk Data dan Filter ---
  const [searchTerm, setSearchTerm] = useState("");
  const [bidangData, setBidangData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0); // Total jumlah baris dari API
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- State untuk Modal Add/Edit ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBidang, setEditingBidang] = useState(null);

  // --- State untuk Paginasi DataTable ---
  const [dataTablePaginationModel, setDataTablePaginationModel] = useState({
    page: 0, // Halaman saat ini (0-indexed)
    pageSize: 10, // Jumlah baris per halaman
  });

  // --- OPTIMISASI: Debounce search term ---
  // State untuk menyimpan search term yang di-debounce
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Tunggu 300ms setelah user berhenti mengetik

    return () => {
      clearTimeout(timer); // Bersihkan timer jika searchTerm berubah sebelum 300ms
    };
  }, [searchTerm]);

  // Reset halaman ke 0 ketika debouncedSearchTerm berubah
  useEffect(() => {
    // Pastikan ini hanya memicu reset halaman jika debouncedSearchTerm benar-benar berubah
    // dan bukan saat inisialisasi awal jika searchTerm kosong
    if (debouncedSearchTerm !== searchTerm) {
      setDataTablePaginationModel((prev) => ({ ...prev, page: 0 }));
    }
  }, [debouncedSearchTerm, searchTerm]);

  // --- EFEK UTAMA UNTUK FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", dataTablePaginationModel.page + 1); // API biasanya 1-indexed
        params.append("per_page", dataTablePaginationModel.pageSize);
        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }

        const response = await api.get(
          `/klasifikasi-instansi/bidang?${params.toString()}`
        );
        setBidangData(response.data.data);
        setRowCount(response.data.meta.total);
      } catch (error) {
        console.error("Gagal fetch data bidang:", error);
        setBidangData([]); // Reset data jika gagal
        setRowCount(0); // Reset total jika gagal
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataTablePaginationModel, debouncedSearchTerm, refreshTrigger]); // Dependencies yang memicu re-fetch

  // --- Handler Fungsi ---

  const handleExport = () => {
    console.log("Exporting data...");
    // Implementasi logika ekspor data di sini
  };

  const handleRefresh = () => {
    setRefreshTrigger((c) => c + 1);
  };

  const handleOpenAddModal = () => {
    setEditingBidang(null); // Pastikan modal dalam mode 'add'
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditingBidang(null); // Reset editing state
    // Tidak perlu memanggil handleRefresh di sini, karena onSave akan memanggilnya
  };

  const handleSaveNewBidang = async (bidangToSave) => {
    try {
      if (bidangToSave.id) {
        // Mode Edit
        const { id, ...payload } = bidangToSave;
        await api.patch(`/klasifikasi-instansi/bidang/${id}`, payload);
      } else {
        // Mode Add
        await api.post("/klasifikasi-instansi/bidang", bidangToSave);
      }
      alert("Data berhasil disimpan!");
      handleCloseAddModal(); // Tutup modal
      handleRefresh(); // Panggil refresh untuk mengambil data terbaru
    } catch (error) {
      console.error(
        "Gagal simpan bidang:",
        error.response?.data || error.message
      );
      alert("Gagal menyimpan data bidang. Cek console untuk detail.");
    }
  };

  const handleEditClick = (id) => {
    const bidangToEdit = bidangData.find((item) => item.id === id);
    if (bidangToEdit) {
      setEditingBidang(bidangToEdit);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteClick = async (id) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!konfirmasi) return;

    try {
      await api.delete(`/klasifikasi-instansi/bidang/${id}`);
      console.log("Berhasil menghapus bidang dengan ID:", id);
      handleRefresh(); // Refresh data setelah hapus
    } catch (error) {
      console.error("Gagal menghapus bidang:", error);
      alert("Gagal menghapus bidang. Cek console untuk detail.");
    }
  };

  // --- Konfigurasi Kolom DataTable ---
  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      sortable: false,
      renderCell: (params) => {
        // Menggunakan dataTablePaginationModel untuk perhitungan nomor
        const index = bidangData.findIndex((row) => row.id === params.row.id);
        return (
          dataTablePaginationModel.page * dataTablePaginationModel.pageSize +
          index +
          1
        );
      },
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        // === PERBAIKAN DI SINI ===
        const provinsi = params.row.kabupaten_kota?.provinsi;
        return provinsi
          ? `${provinsi.kode_provinsi} - ${provinsi.nama_provinsi}`
          : "N/A";
      },
    },
    {
      field: "kabupaten_kota",
      headerName: "Kabupaten/Kota",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        // === PERBAIKAN DI SINI ===
        const kabKot = params.row.kabupaten_kota;
        return kabKot
          ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
          : "N/A";
      },
    },
    {
      field: "kode_bidang",
      headerName: "Kode Bidang",
      width: 150,
    },
    { field: "nama_bidang", headerName: "Nama Bidang", flex: 1, minWidth: 250 },
    { field: "kode", headerName: "Kode", width: 120 },
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

  // --- Render UI ---
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />

        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={handleExport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Daftar Bidang</h1>
            <div className="flex gap-3">
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
                <Plus size={16} /> Add Bidang
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                value={dataTablePaginationModel.pageSize}
                onChange={(e) => {
                  setDataTablePaginationModel((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    page: 0, // Reset ke halaman pertama saat jumlah entri berubah
                  }));
                }}
                className="border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer"
              >
                {[5, 10, 25, 50, 75, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="text-gray-600 text-sm">entries</span>
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <DataTable
            rows={bidangData}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            filterMode="server" // Ini sebenarnya dikontrol oleh cara Anda mem-fetch data dengan 'search' param
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            paginationModel={dataTablePaginationModel}
            onPaginationModelChange={setDataTablePaginationModel}
            height={500}
            emptyRowsMessage="Tidak ada data bidang yang tersedia"
            disableRowSelectionOnClick // Menambahkan ini agar baris tidak terpilih saat diklik
            hideFooterSelectedRowCount // Menambahkan ini untuk menyembunyikan hitungan baris yang dipilih di footer
          />
        </div>
      </div>

      <AddBidangModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewBidang}
        initialData={editingBidang}
      />
    </div>
  );
};

export default BidangPage;
