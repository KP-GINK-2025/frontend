import React, { useState, useEffect } from "react";

const AddMutasiModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kualifikasiPerolehan, setKualifikasiPerolehan] = useState("");
  const [asal, setAsal] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [tanggalBeritaAcara, setTanggalBeritaAcara] = useState("");
  const [nomorBeritaAcara, setNomorBeritaAcara] = useState("");
  const [totalBarang, setTotalBarang] = useState("");
  const [totalHarga, setTotalHarga] = useState("");
  const [lampiran, setLampiran] = useState("");
  const [statusVerifikasi, setStatusVerifikasi] = useState("");
  const [catatanVerifikasi, setCatatanVerifikasi] = useState("");

  // Conditional Fields for Dropping Pusat
  const [tahunPerolehan, setTahunPerolehan] = useState("");
  const [nomorSp2d, setNomorSp2d] = useState("");
  const [tanggalSp2d, setTanggalSp2d] = useState("");
  const [nomorSuratPengantar, setNomorSuratPengantar] = useState("");
  const [tanggalSuratPengantar, setTanggalSuratPengantar] = useState("");

  // Conditional Fields for Dropping Pemda
  const [opdAsal, setOpdAsal] = useState("");
  const [opdTujuan, setOpdTujuan] = useState("");
  const [nomorSkpd, setNomorSkpd] = useState("");
  const [tanggalSkpd, setTanggalSkpd] = useState("");

  // Dummy data for dropdowns
  const dummyKualifikasiPerolehanData = [
    { id: 1, nama: "Dropping Pusat" },
    { id: 2, nama: "Dropping Pemda" },
    { id: 3, nama: "Hibah" },
    { id: 4, nama: "Pembelian" },
  ];
  const dummyAsalTujuanData = [
    { id: 1, nama: "Jakarta" },
    { id: 2, nama: "Lampung" },
    { id: 3, nama: "Bandar Lampung" },
  ];
  const dummyStatusVerifikasiData = [
    { id: 1, nama: "Diverifikasi" },
    { id: 2, nama: "Menunggu" },
    { id: 3, nama: "Ditolak" },
  ];
  const dummyTahunData = ["2023", "2024", "2025"];
  const dummyOpdData = [
    { id: 1, nama: "Dinas Pendidikan" },
    { id: 2, nama: "Dinas Kesehatan" },
  ];

  // Efek untuk mengisi form saat mode edit atau mereset saat mode tambah
  useEffect(() => {
    if (isOpen) {
      // Hanya reset/isi saat modal dibuka
      if (initialData) {
        setKualifikasiPerolehan(initialData.kualifikasiPerolehan || "");
        setAsal(initialData.asal || "");
        setTujuan(initialData.tujuan || "");
        setTanggalBeritaAcara(initialData.tanggalBeritaAcara || "");
        setNomorBeritaAcara(initialData.nomorBeritaAcara || "");
        setTotalBarang(initialData.totalBarang || "");
        setTotalHarga(initialData.totalHarga || "");
        setLampiran(initialData.lampiran || "");
        setStatusVerifikasi(initialData.statusVerifikasi || "");
        setCatatanVerifikasi(initialData.catatanVerifikasi || "");

        // Conditional fields for Dropping Pusat
        setTahunPerolehan(initialData.tahunPerolehan || "");
        setNomorSp2d(initialData.nomorSp2d || "");
        setTanggalSp2d(initialData.tanggalSp2d || "");
        setNomorSuratPengantar(initialData.nomorSuratPengantar || "");
        setTanggalSuratPengantar(initialData.tanggalSuratPengantar || "");

        // Conditional fields for Dropping Pemda
        setOpdAsal(initialData.opdAsal || "");
        setOpdTujuan(initialData.opdTujuan || "");
        setNomorSkpd(initialData.nomorSkpd || "");
        setTanggalSkpd(initialData.tanggalSkpd || "");
      } else {
        // Reset semua field untuk tambah baru
        setKualifikasiPerolehan("");
        setAsal("");
        setTujuan("");
        setTanggalBeritaAcara("");
        setNomorBeritaAcara("");
        setTotalBarang("");
        setTotalHarga("");
        setLampiran("");
        setStatusVerifikasi("");
        setCatatanVerifikasi("");

        setTahunPerolehan("");
        setNomorSp2d("");
        setTanggalSp2d("");
        setNomorSuratPengantar("");
        setTanggalSuratPengantar("");

        setOpdAsal("");
        setOpdTujuan("");
        setNomorSkpd("");
        setTanggalSkpd("");
      }
    }
  }, [isOpen, initialData]);

  // Fungsi untuk mereset field kondisional saat kualifikasi berubah
  const handleKualifikasiChange = (e) => {
    const value = e.target.value;
    setKualifikasiPerolehan(value);
    // Reset semua field kondisional saat kualifikasi berubah
    setTahunPerolehan("");
    setNomorSp2d("");
    setTanggalSp2d("");
    setNomorSuratPengantar("");
    setTanggalSuratPengantar("");
    setOpdAsal("");
    setOpdTujuan("");
    setNomorSkpd("");
    setTanggalSkpd("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi dasar untuk field umum
    if (
      !kualifikasiPerolehan ||
      !asal ||
      !tujuan ||
      !tanggalBeritaAcara ||
      !nomorBeritaAcara ||
      !totalBarang ||
      !totalHarga ||
      !statusVerifikasi
    ) {
      alert("Harap lengkapi semua field umum yang wajib diisi (*).");
      return;
    }

    // Validasi kondisional berdasarkan Kualifikasi Perolehan
    if (kualifikasiPerolehan === "Dropping Pusat") {
      if (
        !tahunPerolehan ||
        !nomorSp2d ||
        !tanggalSp2d ||
        !nomorSuratPengantar ||
        !tanggalSuratPengantar
      ) {
        alert(
          "Harap lengkapi semua field Dropping Pusat yang wajib diisi (*)."
        );
        return;
      }
    } else if (kualifikasiPerolehan === "Dropping Pemda") {
      if (!opdAsal || !opdTujuan || !nomorSkpd || !tanggalSkpd) {
        alert(
          "Harap lengkapi semua field Dropping Pemda yang wajib diisi (*)."
        );
        return;
      }
    }
    // Tambahkan validasi untuk kualifikasi lain jika ada

    const dataToSave = {
      // General fields
      kualifikasiPerolehan,
      asal,
      tujuan,
      tanggalBeritaAcara,
      nomorBeritaAcara,
      totalBarang: Number(totalBarang),
      totalHarga: Number(totalHarga),
      lampiran, // Opsional
      statusVerifikasi,
      catatanVerifikasi, // Opsional

      // Conditional fields (akan diisi hanya jika relevan, lainnya undefined/null)
      tahunPerolehan:
        kualifikasiPerolehan === "Dropping Pusat" ? tahunPerolehan : undefined,
      nomorSp2d:
        kualifikasiPerolehan === "Dropping Pusat" ? nomorSp2d : undefined,
      tanggalSp2d:
        kualifikasiPerolehan === "Dropping Pusat" ? tanggalSp2d : undefined,
      nomorSuratPengantar:
        kualifikasiPerolehan === "Dropping Pusat"
          ? nomorSuratPengantar
          : undefined,
      tanggalSuratPengantar:
        kualifikasiPerolehan === "Dropping Pusat"
          ? tanggalSuratPengantar
          : undefined,

      opdAsal: kualifikasiPerolehan === "Dropping Pemda" ? opdAsal : undefined,
      opdTujuan:
        kualifikasiPerolehan === "Dropping Pemda" ? opdTujuan : undefined,
      nomorSkpd:
        kualifikasiPerolehan === "Dropping Pemda" ? nomorSkpd : undefined,
      tanggalSkpd:
        kualifikasiPerolehan === "Dropping Pemda" ? tanggalSkpd : undefined,
    };

    if (initialData && initialData.id) {
      onSave({ ...dataToSave, id: initialData.id });
    } else {
      onSave(dataToSave);
    }
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "EDIT MUTASI" : "TAMBAH MUTASI"}
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
            <label
              htmlFor="kualifikasiPerolehan"
              className="block mb-2 text-gray-700"
            >
              Kualifikasi Perolehan: <span className="text-red-500">*</span>
            </label>
            <select
              id="kualifikasiPerolehan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kualifikasiPerolehan}
              onChange={handleKualifikasiChange} // handler khusus
              required
            >
              <option value="">- Pilih Kualifikasi Perolehan -</option>
              {dummyKualifikasiPerolehanData.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Bagian Umum Mutasi */}
          <div className="mb-4">
            <label htmlFor="asal" className="block mb-2 text-gray-700">
              Asal: <span className="text-red-500">*</span>
            </label>
            <select
              id="asal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={asal}
              onChange={(e) => setAsal(e.target.value)}
              required
            >
              <option value="">- Pilih Asal -</option>
              {dummyAsalTujuanData.map((a) => (
                <option key={a.id} value={a.nama}>
                  {a.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="tujuan" className="block mb-2 text-gray-700">
              Tujuan: <span className="text-red-500">*</span>
            </label>
            <select
              id="tujuan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              required
            >
              <option value="">- Pilih Tujuan -</option>
              {dummyAsalTujuanData.map((t) => (
                <option key={t.id} value={t.nama}>
                  {t.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="tanggalBeritaAcara"
              className="block mb-2 text-gray-700"
            >
              Tanggal Berita Acara: <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggalBeritaAcara"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tanggalBeritaAcara}
              onChange={(e) => setTanggalBeritaAcara(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="nomorBeritaAcara"
              className="block mb-2 text-gray-700"
            >
              Nomor Berita Acara: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nomorBeritaAcara"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nomorBeritaAcara}
              onChange={(e) => setNomorBeritaAcara(e.target.value)}
              required
            />
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
            <label htmlFor="lampiran" className="block mb-2 text-gray-700">
              Lampiran:
            </label>
            <input
              type="text" // Asumsi ini adalah teks/URL/nama file
              id="lampiran"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lampiran}
              onChange={(e) => setLampiran(e.target.value)}
            />
          </div>

          <div className="mb-4">
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
              <option value="">- Pilih Status Verifikasi -</option>
              {dummyStatusVerifikasiData.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="catatanVerifikasi"
              className="block mb-2 text-gray-700"
            >
              Catatan Verifikasi:
            </label>
            <textarea
              id="catatanVerifikasi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={catatanVerifikasi}
              onChange={(e) => setCatatanVerifikasi(e.target.value)}
              rows="3"
            ></textarea>
          </div>

          {/* Conditional Fields Rendering */}
          {kualifikasiPerolehan === "Dropping Pusat" && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-t pt-4 mt-4">
                Detail Dropping Pusat
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="tahunPerolehan"
                  className="block mb-2 text-gray-700"
                >
                  Tahun Perolehan: <span className="text-red-500">*</span>
                </label>
                <select
                  id="tahunPerolehan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tahunPerolehan}
                  onChange={(e) => setTahunPerolehan(e.target.value)}
                  required
                >
                  <option value="">- Pilih Tahun Perolehan -</option>
                  {dummyTahunData.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="nomorSp2d" className="block mb-2 text-gray-700">
                  Nomor SP2D: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomorSp2d"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nomorSp2d}
                  onChange={(e) => setNomorSp2d(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="tanggalSp2d"
                  className="block mb-2 text-gray-700"
                >
                  Tanggal SP2D: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggalSp2d"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tanggalSp2d}
                  onChange={(e) => setTanggalSp2d(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="nomorSuratPengantar"
                  className="block mb-2 text-gray-700"
                >
                  Nomor Surat Pengantar: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomorSuratPengantar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nomorSuratPengantar}
                  onChange={(e) => setNomorSuratPengantar(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="tanggalSuratPengantar"
                  className="block mb-2 text-gray-700"
                >
                  Tanggal Surat Pengantar:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggalSuratPengantar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tanggalSuratPengantar}
                  onChange={(e) => setTanggalSuratPengantar(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {kualifikasiPerolehan === "Dropping Pemda" && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-t pt-4 mt-4">
                Detail Dropping Pemda
              </h3>
              <div className="mb-4">
                <label htmlFor="opdAsal" className="block mb-2 text-gray-700">
                  OPD Asal: <span className="text-red-500">*</span>
                </label>
                <select
                  id="opdAsal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={opdAsal}
                  onChange={(e) => setOpdAsal(e.target.value)}
                  required
                >
                  <option value="">- Pilih OPD Asal -</option>
                  {dummyOpdData.map((opd) => (
                    <option key={opd.id} value={opd.nama}>
                      {opd.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="opdTujuan" className="block mb-2 text-gray-700">
                  OPD Tujuan: <span className="text-red-500">*</span>
                </label>
                <select
                  id="opdTujuan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={opdTujuan}
                  onChange={(e) => setOpdTujuan(e.target.value)}
                  required
                >
                  <option value="">- Pilih OPD Tujuan -</option>
                  {dummyOpdData.map((opd) => (
                    <option key={opd.id} value={opd.nama}>
                      {opd.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="nomorSkpd" className="block mb-2 text-gray-700">
                  Nomor SKPD: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nomorSkpd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nomorSkpd}
                  onChange={(e) => setNomorSkpd(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="tanggalSkpd"
                  className="block mb-2 text-gray-700"
                >
                  Tanggal SKPD: <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tanggalSkpd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tanggalSkpd}
                  onChange={(e) => setTanggalSkpd(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          {/* Tambahkan bagian rendering untuk kualifikasi lain jika ada */}
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

export default AddMutasiModal;
