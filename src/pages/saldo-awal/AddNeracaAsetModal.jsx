import React, { useState, useEffect } from "react";

const AddNeracaAsetModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [tahun, setTahun] = useState("");
  const [semester, setSemester] = useState("");
  const [subRincianAset, setSubRincianAset] = useState("");
  const [unit, setUnit] = useState("");
  const [subUnit, setSubUnit] = useState("");
  const [upb, setUpb] = useState("");
  const [kualifikasiAset, setKualifikasiAset] = useState("");
  const [kelompokAset, setKelompokAset] = useState("");
  const [jenisAset, setJenisAset] = useState("");
  const [objekAset, setObjekAset] = useState("");
  const [jumlahBarang, setJumlahBarang] = useState("");
  const [nilaiBarang, setNilaiBarang] = useState("");

  // Dummy data untuk dropdown (dalam aplikasi nyata, ini akan datang dari props atau API)
  const dummyTahunData = ["2023", "2024", "2025"];
  const dummySemesterData = [
    { id: 1, nama: "Ganjil" },
    { id: 2, nama: "Genap" },
  ];
  const dummySubRincianAsetData = [
    { id: 1, nama: "Sub Rincian A" },
    { id: 2, nama: "Sub Rincian B" },
  ];
  const dummyUnitData = [
    { id: 1, nama: "Unit A" },
    { id: 2, nama: "Unit B" },
  ];
  const dummySubUnitData = [
    { id: 1, nama: "Sub Unit X" },
    { id: 2, nama: "Sub Unit Y" },
  ];
  const dummyUpbData = [
    { id: 1, nama: "UPB 1" },
    { id: 2, nama: "UPB 2" },
  ];
  const dummyKualifikasiAsetData = [
    { id: 1, nama: "Tanah" },
    { id: 2, nama: "Bangunan" },
  ];
  const dummyKelompokAsetData = [
    { id: 1, nama: "Gedung" },
    { id: 2, nama: "Peralatan" },
  ];
  const dummyJenisAsetData = [
    { id: 1, nama: "Meja" },
    { id: 2, nama: "Kursi" },
  ];
  const dummyObjekAsetData = [
    { id: 1, nama: "Komputer" },
    { id: 2, nama: "Laptop" },
  ];

  useEffect(() => {
    if (isOpen && initialData) {
      setTahun(initialData.tahun || "");
      setSemester(initialData.semester || "");
      setSubRincianAset(initialData.subRincianAset || "");
      setUnit(initialData.unit || "");
      setSubUnit(initialData.subUnit || "");
      setUpb(initialData.upb || "");
      setKualifikasiAset(initialData.kualifikasiAset || "");
      setKelompokAset(initialData.kelompokAset || "");
      setJenisAset(initialData.jenisAset || "");
      setObjekAset(initialData.objekAset || "");
      setJumlahBarang(initialData.jumlahBarang || "");
      setNilaiBarang(initialData.nilaiBarang || "");
    } else if (isOpen && !initialData) {
      // Reset form saat mode tambah baru
      setTahun("");
      setSemester("");
      setSubRincianAset("");
      setUnit("");
      setSubUnit("");
      setUpb("");
      setKualifikasiAset("");
      setKelompokAset("");
      setJenisAset("");
      setObjekAset("");
      setJumlahBarang("");
      setNilaiBarang("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi manual
    if (
      !tahun ||
      !semester ||
      !subRincianAset ||
      !unit ||
      !subUnit ||
      !upb ||
      !kualifikasiAset ||
      !kelompokAset ||
      !jenisAset ||
      !objekAset ||
      !jumlahBarang ||
      !nilaiBarang
    ) {
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }

    const dataToSave = {
      // Nama properti ini harus sesuai dengan 'field' di columns DataTable di SaldoAwalPage
      tahun,
      semester,
      subRincianAset,
      unit,
      subUnit,
      upb,
      kualifikasiAset,
      kelompokAset,
      jenisAset,
      objekAset,
      jumlahBarang: Number(jumlahBarang), // Pastikan ini angka
      nilaiBarang: Number(nilaiBarang), // Pastikan ini angka
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "EDIT SALDO AWAL" : "TAMBAH SALDO AWAL"}
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
            <label htmlFor="tahun" className="block mb-2 text-gray-700">
              Tahun: <span className="text-red-500">*</span>
            </label>
            <select
              id="tahun"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              required
            >
              <option value="">- Pilih Tahun -</option>
              {dummyTahunData.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="semester" className="block mb-2 text-gray-700">
              Semester: <span className="text-red-500">*</span>
            </label>
            <select
              id="semester"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">- Pilih Semester -</option>
              {dummySemesterData.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="subRincianAset"
              className="block mb-2 text-gray-700"
            >
              Sub Rincian Aset: <span className="text-red-500">*</span>
            </label>
            <select
              id="subRincianAset"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subRincianAset}
              onChange={(e) => setSubRincianAset(e.target.value)}
              required
            >
              <option value="">- Pilih Sub Rincian Aset -</option>
              {dummySubRincianAsetData.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="unit" className="block mb-2 text-gray-700">
              Unit: <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            >
              <option value="">- Pilih Unit -</option>
              {dummyUnitData.map((u) => (
                <option key={u.id} value={u.nama}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="subUnit" className="block mb-2 text-gray-700">
              Sub Unit: <span className="text-red-500">*</span>
            </label>
            <select
              id="subUnit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subUnit}
              onChange={(e) => setSubUnit(e.target.value)}
              required
            >
              <option value="">- Pilih Sub Unit -</option>
              {dummySubUnitData.map((s) => (
                <option key={s.id} value={s.nama}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>

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
              htmlFor="kualifikasiAset"
              className="block mb-2 text-gray-700"
            >
              Kualifikasi Aset: <span className="text-red-500">*</span>
            </label>
            <select
              id="kualifikasiAset"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kualifikasiAset}
              onChange={(e) => setKualifikasiAset(e.target.value)}
              required
            >
              <option value="">- Pilih Kualifikasi Aset -</option>
              {dummyKualifikasiAsetData.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="kelompokAset" className="block mb-2 text-gray-700">
              Kelompok Aset: <span className="text-red-500">*</span>
            </label>
            <select
              id="kelompokAset"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kelompokAset}
              onChange={(e) => setKelompokAset(e.target.value)}
              required
            >
              <option value="">- Pilih Kelompok Aset -</option>
              {dummyKelompokAsetData.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="jenisAset" className="block mb-2 text-gray-700">
              Jenis Aset: <span className="text-red-500">*</span>
            </label>
            <select
              id="jenisAset"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jenisAset}
              onChange={(e) => setJenisAset(e.target.value)}
              required
            >
              <option value="">- Pilih Jenis Aset -</option>
              {dummyJenisAsetData.map((j) => (
                <option key={j.id} value={j.nama}>
                  {j.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="objekAset" className="block mb-2 text-gray-700">
              Objek Aset: <span className="text-red-500">*</span>
            </label>
            <select
              id="objekAset"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={objekAset}
              onChange={(e) => setObjekAset(e.target.value)}
              required
            >
              <option value="">- Pilih Objek Aset -</option>
              {dummyObjekAsetData.map((o) => (
                <option key={o.id} value={o.nama}>
                  {o.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="jumlahBarang" className="block mb-2 text-gray-700">
              Jumlah Barang: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="jumlahBarang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jumlahBarang}
              onChange={(e) => setJumlahBarang(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="nilaiBarang" className="block mb-2 text-gray-700">
              Nilai Barang: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="nilaiBarang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nilaiBarang}
              onChange={(e) => setNilaiBarang(e.target.value)}
              required
              min="0"
            />
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

export default AddNeracaAsetModal;
