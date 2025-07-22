import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const AddUnitModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kodeUnit, setKodeUnit] = useState("");
  const [namaUnit, setNamaUnit] = useState("");
  const [kode, setKode] = useState("");
  const [selectedBidang, setSelectedBidang] = useState(null);
  const [bidangOptions, setBidangOptions] = useState([]);
  const [isLoadingBidang, setIsLoadingBidang] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // --- MODE EDIT ---
        setKodeUnit(initialData.kode_unit || "");
        setNamaUnit(initialData.nama_unit || "");
        setKode(initialData.kode || "");

        // Cek apakah data bidang sudah ada di `initialData`
        if (initialData.bidang) {
          // Jika ya (dari eager loading atau frontend join), langsung gunakan
          const bidang = initialData.bidang;
          const option = {
            value: bidang.id,
            label: `${bidang.kode_bidang} - ${bidang.nama_bidang}`,
          };
          setSelectedBidang(option);
          setBidangOptions([option]); // Set opsi awal
        } else if (initialData.bidang_id) {
          // Fallback: Jika hanya ada ID, fetch ke API (seperti sebelumnya)
          setIsLoadingBidang(true);
          api
            .get(`/klasifikasi-instansi/bidang/${initialData.bidang_id}`)
            .then((response) => {
              const data = response.data.data;
              const option = {
                value: data.id,
                label: `${data.kode_bidang} - ${data.nama_bidang}`,
              };
              setSelectedBidang(option);
              setBidangOptions([option]);
            })
            .catch((error) =>
              console.error("Gagal fetch initial bidang data:", error)
            )
            .finally(() => setIsLoadingBidang(false));
        } else {
          setSelectedBidang(null);
        }
      } else {
        // --- MODE TAMBAH BARU (Reset semua form) ---
        setKodeUnit("");
        setNamaUnit("");
        setKode("");
        setSelectedBidang(null);
        setBidangOptions([]);
      }
    }
  }, [isOpen, initialData]);

  const loadBidangOptions = (inputValue) => {
    if (!inputValue) {
      return;
    }
    setIsLoadingBidang(true);
    api
      .get(`/klasifikasi-instansi/bidang?per_page=1000&search=${inputValue}`)
      .then((response) => {
        const formattedOptions = response.data.data.map((item) => ({
          value: item.id,
          label: `${item.kode_bidang} - ${item.nama_bidang}`,
        }));
        setBidangOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Gagal cari data bidang:", error);
        setBidangOptions([]);
      })
      .finally(() => {
        setIsLoadingBidang(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedBidang ||
      !kodeUnit.trim() ||
      !namaUnit.trim() ||
      !kode.trim()
    ) {
      Swal.fire({
        text: "Harap lengkapi semua field yang wajib diisi (*)",
        icon: "info",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }
    const dataToSave = {
      bidang_id: selectedBidang.value,
      kode_unit: kodeUnit,
      nama_unit: namaUnit,
      kode,
    };

    try {
      setIsSaving(true); // Mulai state loading
      if (initialData && initialData.id) {
        await onSave({ ...dataToSave, id: initialData.id });
      } else {
        await onSave(dataToSave);
      }
    } catch (err) {
      // alert("Terjadi kesalahan saat menyimpan data.");
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
      });
      console.error("Gagal menyimpan: ", err);
    } finally {
      setIsSaving(false); // Selesai loading
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
            {/* --- Modal Content Mulai dari sini --- */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "EDIT UNIT" : "TAMBAH UNIT"}
              </h2>
              <button
                onClick={onClose}
                disabled={isSaving}
                className={`text-2xl cursor-pointer ${
                  isSaving
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-red-700"
                }`}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-4"
            >
              {/* --- Isi Form --- */}
              <div className="mb-4">
                <label htmlFor="bidang" className="block mb-2 text-gray-700">
                  Bidang: <span className="text-[#B53C3C]">*</span>
                </label>
                <Select
                  id="bidang"
                  className="rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  options={bidangOptions}
                  value={selectedBidang}
                  onChange={setSelectedBidang}
                  onInputChange={(newValue) => {
                    loadBidangOptions(newValue);
                    return newValue;
                  }}
                  isLoading={isLoadingBidang}
                  placeholder="Ketik untuk mencari ID atau Nama..."
                  isClearable
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue
                      ? "Ketik sesuatu untuk mencari"
                      : "Data tidak ditemukan"
                  }
                />
              </div>

              <div className="mb-4">
                <label htmlFor="kodeUnit" className="block mb-2 text-gray-700">
                  Kode Unit: <span className="text-[#B53C3C]">*</span>
                </label>
                <input
                  type="number"
                  id="kodeUnit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  value={kodeUnit}
                  onChange={(e) => setKodeUnit(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="namaUnit" className="block mb-2 text-gray-700">
                  Nama Unit: <span className="text-[#B53C3C]">*</span>
                </label>
                <input
                  type="text"
                  id="namaUnit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  value={namaUnit}
                  onChange={(e) => setNamaUnit(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="kode" className="block mb-2 text-gray-700">
                  Kode: <span className="text-[#B53C3C]">*</span>
                </label>
                <input
                  type="text"
                  id="kode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
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
            {/* --- Modal Content Selesai --- */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddUnitModal;
