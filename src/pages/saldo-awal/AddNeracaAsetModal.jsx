import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants
  const backdropVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const modalVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const formVariants = {
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
    hidden: {
      opacity: 0,
    },
  };

  const fieldVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "EDIT SALDO AWAL" : "TAMBAH SALDO AWAL"}
              </h2>
              <motion.button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
              </motion.button>
            </motion.div>

            {/* Form */}
            <motion.form
              className="max-h-[calc(90vh-180px)] overflow-y-auto pr-2 pb-4 space-y-4"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Tahun */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="tahun"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Tahun: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="tahun"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Tahun -</option>
                  {dummyTahunData.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Semester */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="semester"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Semester: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="semester"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Semester -</option>
                  {dummySemesterData.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Sub Rincian Aset */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="subRincianAset"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Sub Rincian Aset: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="subRincianAset"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={subRincianAset}
                  onChange={(e) => setSubRincianAset(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Sub Rincian Aset -</option>
                  {dummySubRincianAsetData.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Unit */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="unit"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Unit: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="unit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Unit -</option>
                  {dummyUnitData.map((u) => (
                    <option key={u.id} value={u.nama}>
                      {u.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Sub Unit */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="subUnit"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Sub Unit: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="subUnit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={subUnit}
                  onChange={(e) => setSubUnit(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Sub Unit -</option>
                  {dummySubUnitData.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* UPB */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="upb"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  UPB: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="upb"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={upb}
                  onChange={(e) => setUpb(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih UPB -</option>
                  {dummyUpbData.map((u) => (
                    <option key={u.id} value={u.nama}>
                      {u.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Kualifikasi Aset */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="kualifikasiAset"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Kualifikasi Aset: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="kualifikasiAset"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={kualifikasiAset}
                  onChange={(e) => setKualifikasiAset(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Kualifikasi Aset -</option>
                  {dummyKualifikasiAsetData.map((k) => (
                    <option key={k.id} value={k.nama}>
                      {k.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Kelompok Aset */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="kelompokAset"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Kelompok Aset: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="kelompokAset"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={kelompokAset}
                  onChange={(e) => setKelompokAset(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Kelompok Aset -</option>
                  {dummyKelompokAsetData.map((k) => (
                    <option key={k.id} value={k.nama}>
                      {k.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Jenis Aset */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="jenisAset"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Jenis Aset: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="jenisAset"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={jenisAset}
                  onChange={(e) => setJenisAset(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Jenis Aset -</option>
                  {dummyJenisAsetData.map((j) => (
                    <option key={j.id} value={j.nama}>
                      {j.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Objek Aset */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="objekAset"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Objek Aset: <span className="text-red-500">*</span>
                </label>
                <motion.select
                  id="objekAset"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={objekAset}
                  onChange={(e) => setObjekAset(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">- Pilih Objek Aset -</option>
                  {dummyObjekAsetData.map((o) => (
                    <option key={o.id} value={o.nama}>
                      {o.nama}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              {/* Jumlah Barang */}
              <motion.div className="mb-4" variants={fieldVariants}>
                <label
                  htmlFor="jumlahBarang"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Jumlah Barang: <span className="text-red-500">*</span>
                </label>
                <motion.input
                  type="number"
                  id="jumlahBarang"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={jumlahBarang}
                  onChange={(e) => setJumlahBarang(e.target.value)}
                  required
                  min="0"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Nilai Barang */}
              <motion.div className="mb-6" variants={fieldVariants}>
                <label
                  htmlFor="nilaiBarang"
                  className="block mb-2 text-gray-700 font-medium"
                >
                  Nilai Barang: <span className="text-red-500">*</span>
                </label>
                <motion.input
                  type="number"
                  id="nilaiBarang"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={nilaiBarang}
                  onChange={(e) => setNilaiBarang(e.target.value)}
                  required
                  min="0"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
            </motion.form>

            {/* Footer Buttons */}
            <motion.div
              className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Batal
              </motion.button>
              <motion.button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {initialData ? "Simpan Perubahan" : "Simpan"}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddNeracaAsetModal;
