import React, { useState } from "react";

const AddBidangModal = ({ isOpen, onClose, onSave }) => {
  const [kodeBidang, setKodeBidang] = useState("");
  const [namaBidang, setNamaBidang] = useState("");
  const [kode, setKode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You'd typically perform validation here before calling onSave
    onSave({ kodeBidang, namaBidang, kode });
    // Optionally close the modal after saving
    onClose();
  };

  if (!isOpen) {
    return null; // Don't render the modal if isOpen is false
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Overlay */}
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        {/* Modal Content */}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">TAMBAH BIDANG</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
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

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="kodeBidang" className="block mb-2 text-gray-700">
              Kode Bidang :
            </label>
            <select
              id="kodeBidang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kodeBidang}
              onChange={(e) => setKodeBidang(e.target.value)}
            >
              <option value="">Pilih Kode Bidang</option>
              {/* Add your options here dynamically or statically */}
              <option value="KB001">KB001</option>
              <option value="KB002">KB002</option>
              <option value="KB003">KB003</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="namaBidang" className="block mb-2 text-gray-700">
              Nama Bidang :
            </label>
            <input
              type="text"
              id="namaBidang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={namaBidang}
              onChange={(e) => setNamaBidang(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="kode" className="block mb-2 text-gray-700">
              Kode :
            </label>
            <input
              type="text"
              id="kode"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBidangModal;
