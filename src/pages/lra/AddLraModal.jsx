import React, { useState, useEffect } from "react";

const AddLraModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [tahun, setTahun] = useState("");
  const [semester, setSemester] = useState("");
  const [bidang, setBidang] = useState("");
  const [unit, setUnit] = useState("");
  const [subUnit, setSubUnit] = useState("");
  const [upb, setUpb] = useState("");
  const [nilaiTotal, setNilaiTotal] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // Dummy data untuk dropdowns (dalam aplikasi nyata, ini akan datang dari props atau API)
  const dummyTahunData = ["2023", "2024", "2025"];
  const dummySemesterData = [
    { id: 1, nama: "Ganjil" },
    { id: 2, nama: "Genap" },
  ];
  const dummyBidangData = [
    { id: 1, nama: "Bidang Keuangan" },
    { id: 2, nama: "Bidang Umum" },
  ];
  const dummyUnitData = [
    { id: 1, nama: "Unit Anggaran" },
    { id: 2, nama: "Unit Gaji" },
  ];
  const dummySubUnitData = [
    { id: 1, nama: "Sub Unit A" },
    { id: 2, nama: "Sub Unit B" },
  ];
  const dummyUpbData = [
    { id: 1, nama: "UPB A" },
    { id: 2, nama: "UPB B" },
  ];

  useEffect(() => {
    if (isOpen && initialData) {
      setTahun(initialData.tahun || "");
      setSemester(initialData.semester || "");
      setBidang(initialData.bidang || "");
      setUnit(initialData.unit || "");
      setSubUnit(initialData.subUnit || "");
      setUpb(initialData.upb || "");
      setNilaiTotal(initialData.nilaiTotal || "");
      setKeterangan(initialData.keterangan || "");
    } else if (isOpen && !initialData) {
      // Reset form saat mode tambah baru
      setTahun("");
      setSemester("");
      setBidang("");
      setUnit("");
      setSubUnit("");
      setUpb("");
      setNilaiTotal("");
      setKeterangan("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi manual
    if (
      !tahun ||
      !semester ||
      !bidang ||
      !unit ||
      !subUnit ||
      !upb ||
      !nilaiTotal
    ) {
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }

    const dataToSave = {
      // Nama properti ini harus sesuai dengan 'field' di columns DataTable di LraPage
      tahun,
      semester,
      bidang,
      unit,
      subUnit,
      upb,
      nilaiTotal: Number(nilaiTotal),
      keterangan,
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
            {initialData ? "EDIT LRA" : "TAMBAH LRA"}
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
            <label htmlFor="bidang" className="block mb-2 text-gray-700">
              Bidang: <span className="text-red-500">*</span>
            </label>
            <select
              id="bidang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bidang}
              onChange={(e) => setBidang(e.target.value)}
              required
            >
              <option value="">- Pilih Bidang -</option>
              {dummyBidangData.map((b) => (
                <option key={b.id} value={b.nama}>
                  {b.nama}
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
            <label htmlFor="nilaiTotal" className="block mb-2 text-gray-700">
              Nilai Total: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="nilaiTotal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nilaiTotal}
              onChange={(e) => setNilaiTotal(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="keterangan" className="block mb-2 text-gray-700">
              Keterangan:
            </label>
            <textarea
              id="keterangan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows="3"
            ></textarea>
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

export default AddLraModal;
