import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const AddAkunModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kodeAkunAset, setKodeAkunAset] = useState("");
  const [namaAkunAset, setNamaAkunAset] = useState("");
  const [kode, setKode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // --- MODE EDIT ---
        setKodeAkunAset(initialData.kode_akun_aset || "");
        setNamaAkunAset(initialData.nama_akun_aset || "");
        setKode(initialData.kode || "");
      } else {
        // --- MODE TAMBAH BARU (Reset semua form) ---
        setKodeAkunAset("");
        setNamaAkunAset("");
        setKode("");
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kodeAkunAset.trim() || !namaAkunAset.trim() || !kode.trim()) {
      Swal.fire({
        text: "Harap lengkapi semua field yang wajib diisi (*)",
        icon: "info",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    const dataToSave = {
      kode_akun_aset: kodeAkunAset,
      nama_akun_aset: namaAkunAset,
      kode,
    };

    try {
      setIsSaving(true);
      if (initialData && initialData.id) {
        await onSave({ ...dataToSave, id: initialData.id });
      } else {
        await onSave(dataToSave);
      }
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
      });
      console.error("Gagal menyimpan: ", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "EDIT AKUN ASET" : "TAMBAH AKUN ASET"}
              </h2>
              <button onClick={onClose} disabled={isSaving} className="...">
                &times;
              </button>
            </div>

            {/* Form tidak perlu event onSubmit karena button sudah handle, tapi tetap bagus untuk semantic */}
            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-4"
            >
              <div className="mb-4">
                <label
                  htmlFor="kodeAkunAset"
                  className="block mb-2 text-gray-700"
                >
                  Kode Akun: <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  id="kodeAkunAset"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={kodeAkunAset}
                  onChange={(e) => setKodeAkunAset(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="namaAkunAset"
                  className="block mb-2 text-gray-700"
                >
                  Nama Akun: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="namaAkunAset"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={namaAkunAset}
                  onChange={(e) => setNamaAkunAset(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="kode" className="block mb-2 text-gray-700">
                  Kode: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="kode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  required
                />
              </div>
            </form>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer ${
                  isSaving
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Batal
              </button>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C] cursor-pointer ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isSaving
                  ? initialData
                    ? "Menyimpan Perubahan..."
                    : "Menyimpan..."
                  : initialData
                  ? "Simpan Perubahan"
                  : "Simpan"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAkunModal;
