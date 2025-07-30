import React, { useState, useEffect } from "react";

const AddKelompokModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [namaAsetSatu, setNamaAsetSatu] = useState("");
  const [kodeAsetDua, setKodeAsetDua] = useState("");
  const [namaAsetDua, setNamaAsetDua] = useState("");
  const [kode, setKode] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      // Saat mengedit, pastikan properti yang diambil sesuai dengan field DataTable
      setNamaAsetSatu(initialData.aset1 || ""); // Pastikan ini sesuai dengan field 'aset1' di DataTable
      setKodeAsetDua(initialData.kodeAset2 || "");
      setNamaAsetDua(initialData.namaAset2 || "");
      setKode(initialData.kode || "");
    } else if (isOpen && !initialData) {
      setNamaAsetSatu("");
      setKodeAsetDua("");
      setNamaAsetDua("");
      setKode("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!namaAsetSatu || !kodeAsetDua || !namaAsetDua) {
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }

    const dataToSave = {
      // PENTING: Gunakan properti yang akan dicari oleh kolom DataTable
      // 'aset1' adalah field untuk 'Nama Aset 1' di tabel
      aset1: namaAsetSatu,
      kodeAset2: kodeAsetDua,
      namaAset2: namaAsetDua,
      kode: kode,
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
            {initialData ? "EDIT ASET 2" : "TAMBAH ASET 2"}
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
            <label htmlFor="namaAsetSatu" className="block mb-2 text-gray-700">
              Nama Aset 1: <span className="text-red-500">*</span>
            </label>
            <select
              id="namaAsetSatu"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaAsetSatu}
              onChange={(e) => setNamaAsetSatu(e.target.value)}
              required
            >
              <option value="">- Pilih Aset 1 -</option>
              <option value="Aset">Aset</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="kodeAsetDua" className="block mb-2 text-gray-700">
              Kode Aset 2: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="kodeAsetDua"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kodeAsetDua}
              onChange={(e) => setKodeAsetDua(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="namaAsetDua" className="block mb-2 text-gray-700">
              Nama Aset 2: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaAsetDua"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaAsetDua}
              onChange={(e) => setNamaAsetDua(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="kode" className="block mb-2 text-gray-700">
              Kode:
            </label>
            <input
              type="text"
              id="kode"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
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

export default AddKelompokModal;
