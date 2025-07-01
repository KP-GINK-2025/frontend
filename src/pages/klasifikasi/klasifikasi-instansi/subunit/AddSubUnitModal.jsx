import React, { useState } from "react";

const AddSubUnitModal = ({ isOpen, onClose, onSave }) => {
  const [provinsi, setProvinsi] = useState("");
  const [kabKot, setKabKot] = useState("");
  const [bidang, setBidang] = useState("");
  const [unit, setUnit] = useState("");
  const [kodeSubUnit, setKodeSubUnit] = useState("");
  const [namaSubUnit, setNamaSubUnit] = useState("");
  const [kode, setKode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Anda bisa menambahkan validasi di sini sebelum memanggil onSave
    onSave({ provinsi, kabKot, bidang, unit, kodeSubUnit, namaSubUnit, kode });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Overlay */}
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">TAMBAH SUB UNIT</h2>
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

        {/* Form Fields - Add max-h- and overflow-y-auto here */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-4"
        >
          {/* max-h-[calc(100vh-180px)] is a placeholder; adjust 180px as needed */}
          {/* pr-2 for scrollbar, pb-4 for bottom spacing */}

          <div className="mb-4">
            <label htmlFor="provinsi" className="block mb-2 text-gray-700">
              Provinsi: <span className="text-red-500">*</span>
            </label>
            <select
              id="provinsi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              required
            >
              <option value="">- Pilih Provinsi -</option>
              {/* Add your options here dynamically or statically */}
              <option value="18 - Lampung">18 - Lampung</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="kabKot" className="block mb-2 text-gray-700">
              Kabupaten/Kota: <span className="text-red-500">*</span>
            </label>
            <select
              id="kabKot"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kabKot}
              onChange={(e) => setKabKot(e.target.value)}
              required
            >
              <option value="">- Pilih Kabupaten/Kota -</option>
              {/* Add your options here dynamically or statically */}
              <option value="0 - Kab. Tanggamus">
                0 - PEMERINTAH PROVINSI LAMPUNG
              </option>
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
              {/* Add your options here dynamically or statically */}
              <option value="1 - Sekwan/DPRD">1 - Sekwan/DPRD</option>
              <option value="2 - Gubernur/Bupati/Walikota">
                2 - Gubernur/Bupati/Walikota
              </option>
              <option value="3 - Wakil Gubernur/Bupati/Walikota">
                3 - Wakil Gubernur/Bupati/Walikota
              </option>
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
              {/* Add your options here dynamically or statically */}
              <option value="1 - Sekretariat DPRD">1 - Sekretariat DPRD</option>
              <option value="1 - Bupati Tanggamus">1 - Bupati Tanggamus</option>
              <option value="1 - Wakil Bupati Tanggamus">
                1 - Wakil Bupati Tanggamus
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="kodeSubUnit" className="block mb-2 text-gray-700">
              Kode Sub Unit: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="kodeSubUnit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kodeSubUnit}
              onChange={(e) => setKodeSubUnit(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="namaSubUnit" className="block mb-2 text-gray-700">
              Nama Sub Unit: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaSubUnit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaSubUnit}
              onChange={(e) => setNamaSubUnit(e.target.value)}
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

          {/* Action Buttons - These will stay at the bottom of the modal, not scroll with the form */}
        </form>

        {/* Action Buttons - Placed outside the scrollable form but inside the modal content */}
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
            onClick={handleSubmit} // Moved handleSubmit to onClick for button outside form
            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubUnitModal;
