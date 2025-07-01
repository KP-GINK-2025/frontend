import React, { useState } from "react";

const AddBidangModal = ({ isOpen, onClose, onSave }) => {
  const [kodeBidang, setKodeBidang] = useState("");
  const [namaBidang, setNamaBidang] = useState("");
  const [kode, setKode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You'd typically perform validation here before calling onSave
    onSave({ kodeBidang, namaBidang, kode });
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
          <h2 className="text-xl font-bold text-gray-800">TAMBAH BIDANG</h2>
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
            <label htmlFor="kodeBidang" className="block mb-2 text-gray-700">
              Kode Bidang: <span className="text-red-500">*</span>
            </label>
            <input
              type="number" // Already changed to "number"
              id="kodeBidang"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={kodeBidang}
              onChange={(e) => setKodeBidang(e.target.value)}
              required
              min="0" // Optional: Set a minimum value if desired
              // Can add max, step, etc., as needed for number inputs
            />
          </div>

          <div className="mb-4">
            <label htmlFor="namaBidang" className="block mb-2 text-gray-700">
              Nama Bidang: <span className="text-red-500">*</span>
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

          {/* Action Buttons are moved out of the form tag and into the main modal content div */}
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
            onClick={handleSubmit} // Added onClick for submit button (since it's outside form)
            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBidangModal;
