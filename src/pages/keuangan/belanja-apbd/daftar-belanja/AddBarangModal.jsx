import React, { useState, useEffect } from "react";

const AddBarangModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [upb, setUpb] = useState("");
  const [tanggalBaPenerimaan, setTanggalBaPenerimaan] = useState("");
  const [kodeKegiatan, setKodeKegiatan] = useState("");
  const [namaPekerjaan, setNamaPekerjaan] = useState("");
  const [nomorKontrak, setNomorKontrak] = useState("");
  const [tanggalKontrak, setTanggalKontrak] = useState("");
  const [kualifikasiBelanja, setKualifikasiBelanja] = useState("");
  const [totalBarang, setTotalBarang] = useState("");
  const [totalHarga, setTotalHarga] = useState("");
  const [nilaiRetensi, setNilaiRetensi] = useState("");
  const [nilaiRealisasi, setNilaiRealisasi] = useState("");
  const [statusTotalHarga, setStatusTotalHarga] = useState("");
  const [statusVerifikasi, setStatusVerifikasi] = useState("");

  // Dummy data for dropdowns (sesuaikan dengan kebutuhan riil)
  const dummyUpbData = [
    { id: 1, nama: "UPB 001" },
    { id: 2, nama: "UPB 002" },
    { id: 3, nama: "UPB 003" },
  ];
  const dummyKualifikasiBelanja = [
    { id: 1, nama: "Barang" },
    { id: 2, nama: "Jasa" },
    { id: 3, nama: "Modal" },
  ];
  const dummyStatusTotalHarga = [
    { id: 1, nama: "Lunas" },
    { id: 2, nama: "Belum Lunas" },
  ];
  const dummyStatusVerifikasi = [
    { id: 1, nama: "Diverifikasi" },
    { id: 2, nama: "Menunggu" },
    { id: 3, nama: "Ditolak" },
  ];

  useEffect(() => {
    if (isOpen && initialData) {
      setUpb(initialData.upb || "");
      setTanggalBaPenerimaan(initialData.tanggalBaPenerimaan || "");
      setKodeKegiatan(initialData.kodeKegiatan || "");
      setNamaPekerjaan(initialData.namaPekerjaan || "");
      setNomorKontrak(initialData.nomorKontrak || "");
      setTanggalKontrak(initialData.tanggalKontrak || "");
      setKualifikasiBelanja(initialData.kualifikasiBelanja || "");
      setTotalBarang(initialData.totalBarang || "");
      setTotalHarga(initialData.totalHarga || "");
      setNilaiRetensi(initialData.nilaiRetensi || "");
      setNilaiRealisasi(initialData.nilaiRealisasi || "");
      setStatusTotalHarga(initialData.statusTotalHarga || "");
      setStatusVerifikasi(initialData.statusVerifikasi || "");
    } else if (isOpen && !initialData) {
      setUpb("");
      setTanggalBaPenerimaan("");
      setKodeKegiatan("");
      setNamaPekerjaan("");
      setNomorKontrak("");
      setTanggalKontrak("");
      setKualifikasiBelanja("");
      setTotalBarang("");
      setTotalHarga("");
      setNilaiRetensi("");
      setNilaiRealisasi("");
      setStatusTotalHarga("");
      setStatusVerifikasi("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !upb ||
      !tanggalBaPenerimaan ||
      !kodeKegiatan ||
      !namaPekerjaan ||
      !nomorKontrak ||
      !tanggalKontrak ||
      !kualifikasiBelanja ||
      !totalBarang ||
      !totalHarga ||
      !nilaiRetensi ||
      !nilaiRealisasi ||
      !statusTotalHarga ||
      !statusVerifikasi
    ) {
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }

    const dataToSave = {
      upb,
      tanggalBaPenerimaan,
      kodeKegiatan,
      namaPekerjaan,
      nomorKontrak,
      tanggalKontrak,
      kualifikasiBelanja,
      totalBarang: Number(totalBarang),
      totalHarga: Number(totalHarga),
      nilaiRetensi: Number(nilaiRetensi),
      nilaiRealisasi: Number(nilaiRealisasi),
      statusTotalHarga,
      statusVerifikasi,
    };

    if (initialData && initialData.id) {
      onSave({ ...dataToSave, id: initialData.id });
    } else {
      onSave(dataToSave); // Untuk item baru, tidak ada 'id' di objek ini.
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "EDIT BELANJA APBD" : "TAMBAH BELANJA APBD"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-4">
          <div className="mb-4">
            <label htmlFor="upb" className="block mb-2 text-gray-700">
              UPB: <span className="text-red-500">*</span>
            </label>
            <select
              id="upb"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={upb}
              onChange={(e) => setUpb(e.target.value)}
              required
            >
              <option value="">- Pilih UPB -</option>
              {dummyUpbData.map((u) => (
                <option key={u.id} value={u.nama}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="tanggalBaPenerimaan"
              className="block mb-2 text-gray-700"
            >
              Tanggal BA Penerimaan: <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalBaPenerimaan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tanggalBaPenerimaan}
              onChange={(e) => setTanggalBaPenerimaan(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="kodeKegiatan" className="block mb-2 text-gray-700">
              Kode Kegiatan: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="kodeKegiatan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kodeKegiatan}
              onChange={(e) => setKodeKegiatan(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="namaPekerjaan" className="block mb-2 text-gray-700">
              Nama Pekerjaan: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaPekerjaan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaPekerjaan}
              onChange={(e) => setNamaPekerjaan(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nomorKontrak" className="block mb-2 text-gray-700">
              Nomor Kontrak: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nomorKontrak"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nomorKontrak}
              onChange={(e) => setNomorKontrak(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="tanggalKontrak"
              className="block mb-2 text-gray-700"
            >
              Tanggal Kontrak: <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalKontrak"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tanggalKontrak}
              onChange={(e) => setTanggalKontrak(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="kualifikasiBelanja"
              className="block mb-2 text-gray-700"
            >
              Kualifikasi Belanja: <span className="text-red-500">*</span>
            </label>
            <select
              id="kualifikasiBelanja"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kualifikasiBelanja}
              onChange={(e) => setKualifikasiBelanja(e.target.value)}
              required
            >
              <option value="">- Pilih Kualifikasi -</option>
              {dummyKualifikasiBelanja.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="totalBarang" className="block mb-2 text-gray-700">
              Total Barang: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="totalBarang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={totalBarang}
              onChange={(e) => setTotalBarang(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="totalHarga" className="block mb-2 text-gray-700">
              Total Harga: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="totalHarga"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={totalHarga}
              onChange={(e) => setTotalHarga(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nilaiRetensi" className="block mb-2 text-gray-700">
              Nilai Retensi: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="nilaiRetensi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nilaiRetensi}
              onChange={(e) => setNilaiRetensi(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="nilaiRealisasi"
              className="block mb-2 text-gray-700"
            >
              Nilai Realisasi: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="nilaiRealisasi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nilaiRealisasi}
              onChange={(e) => setNilaiRealisasi(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="statusTotalHarga"
              className="block mb-2 text-gray-700"
            >
              Status Total Harga: <span className="text-red-500">*</span>
            </label>
            <select
              id="statusTotalHarga"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusTotalHarga}
              onChange={(e) => setStatusTotalHarga(e.target.value)}
              required
            >
              <option value="">- Pilih Status -</option>
              {dummyStatusTotalHarga.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="statusVerifikasi"
              className="block mb-2 text-gray-700"
            >
              Status Verifikasi: <span className="text-red-500">*</span>
            </label>
            <select
              id="statusVerifikasi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusVerifikasi}
              onChange={(e) => setStatusVerifikasi(e.target.value)}
              required
            >
              <option value="">- Pilih Status -</option>
              {dummyStatusVerifikasi.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {initialData ? "Simpan Perubahan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBarangModal;
