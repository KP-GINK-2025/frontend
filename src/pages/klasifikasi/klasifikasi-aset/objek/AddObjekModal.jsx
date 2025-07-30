import React, { useState, useEffect } from "react";

const AddObjekModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [namaAsetSatu, setNamaAsetSatu] = useState("");
  const [namaAsetDua, setNamaAsetDua] = useState("");
  const [namaAsetTiga, setNamaAsetTiga] = useState("");
  const [kodeAsetEmpat, setKodeAsetEmpat] = useState("");
  const [namaAsetEmpat, setNamaAsetEmpat] = useState("");
  const [kode, setKode] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      setNamaAsetSatu(initialData.aset1 || "");
      setNamaAsetDua(initialData.aset2 || "");
      setNamaAsetTiga(initialData.aset3 || "");
      setKodeAsetEmpat(initialData.kodeAset4 || "");
      setNamaAsetEmpat(initialData.namaAset4 || "");
      setKode(initialData.kode || "");
    } else if (isOpen && !initialData) {
      setNamaAsetSatu("");
      setNamaAsetDua("");
      setNamaAsetTiga("");
      setKodeAsetEmpat("");
      setNamaAsetEmpat("");
      setKode("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !namaAsetSatu ||
      !namaAsetDua ||
      !namaAsetTiga ||
      !kodeAsetEmpat ||
      !namaAsetEmpat
    ) {
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }

    const dataToSave = {
      // PENTING: Gunakan properti yang akan dicari oleh kolom DataTable
      aset1: namaAsetSatu,
      aset2: namaAsetDua,
      aset3: namaAsetTiga,
      kodeAset4: kodeAsetEmpat,
      namaAset4: namaAsetEmpat,
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
            {initialData ? "EDIT ASET 4" : "TAMBAH ASET 4"}
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
            <label htmlFor="namaAsetDua" className="block mb-2 text-gray-700">
              Nama Aset 2: <span className="text-red-500">*</span>
            </label>
            <select
              id="namaAsetDua"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaAsetDua}
              onChange={(e) => setNamaAsetDua(e.target.value)}
              required
            >
              <option value="">- Pilih Aset 2 -</option>
              <option value="Aset Lancar">Aset Lancar</option>
              <option value="Aset Tetap">Aset Tetap</option>
              <option value="Aset Lainnya">Aset Lainnya</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="namaAsetTiga" className="block mb-2 text-gray-700">
              Nama Aset 3: <span className="text-red-500">*</span>
            </label>
            <select
              id="namaAsetTiga"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaAsetTiga}
              onChange={(e) => setNamaAsetTiga(e.target.value)}
              required
            >
              <option value="">- Pilih Aset 3 -</option>
              <option value="Tanah">Tanah</option>
              <option value="Peralatan dan Mesin">Peralatan dan Mesin</option>
              <option value="Gedung dan Bangunan">Gedung dan Bangunan</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="kodeAsetEmpat" className="block mb-2 text-gray-700">
              Kode Aset 4: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="kodeAsetEmpat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kodeAsetEmpat}
              onChange={(e) => setKodeAsetEmpat(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="namaAsetEmpat" className="block mb-2 text-gray-700">
              Nama Aset 4: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaAsetEmpat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaAsetEmpat}
              onChange={(e) => setNamaAsetEmpat(e.target.value)}
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

export default AddObjekModal;
