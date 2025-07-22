import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const AddUpbModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kodeUpb, setKodeUpb] = useState("");
  const [namaUpb, setNamaUpb] = useState("");
  const [kode, setKode] = useState("");
  const [selectedSubUnit, setSelectedSubUnit] = useState(null);
  const [subUnitOptions, setSubUnitOptions] = useState([]);
  const [isLoadingSubUnit, setIsLoadingSubUnit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // --- MODE EDIT ---
        setKodeUpb(initialData.kode_upb || "");
        setNamaUpb(initialData.nama_upb || "");
        setKode(initialData.kode || "");

        // Cek apakah data sub unit sudah ada di `initialData`
        if (initialData.sub_unit) {
          // atau if (initialData.subUnit)
          // Jika ya (dari eager loading atau frontend join), langsung gunakan
          const subUnit = initialData.sub_unit;
          const option = {
            value: subUnit.id,
            label: `${subUnit.kode_sub_unit} - ${subUnit.nama_sub_unit}`,
          };
          setSelectedSubUnit(option);
          setSubUnitOptions([option]); // Set opsi awal
        } else if (initialData.sub_unit_id) {
          // Fallback: Jika hanya ada ID, fetch ke API (seperti sebelumnya)
          setIsLoadingSubUnit(true);
          api
            .get(`/klasifikasi-instansi/subunit/${initialData.sub_unit_id}`)
            .then((response) => {
              const data = response.data.data;
              const option = {
                value: data.id,
                label: `${data.kode_sub_unit} - ${data.nama_sub_unit}`,
              };
              setSelectedSubUnit(option);
              setSubUnitOptions([option]);
            })
            .catch((error) =>
              console.error("Gagal fetch initial unit data:", error)
            )
            .finally(() => setIsLoadingSubUnit(false));
        } else {
          setSelectedSubUnit(null);
        }
      } else {
        // --- MODE TAMBAH BARU (Reset semua form) ---
        setKodeUpb("");
        setNamaUpb("");
        setKode("");
        setSelectedSubUnit(null);
        setSubUnitOptions([]);
      }
    }
  }, [isOpen, initialData]);

  const loadSubUnitOptions = (inputValue) => {
    if (!inputValue) {
      return;
    }
    setIsLoadingSubUnit(true);
    api
      .get(`/klasifikasi-instansi/subunit?per_page=1000&search=${inputValue}`)
      .then((response) => {
        const formattedOptions = response.data.data.map((item) => ({
          value: item.id,
          label: `${item.kode_sub_unit} - ${item.nama_sub_unit}`,
        }));
        setSubUnitOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Gagal cari data subunit:", error);
        setSubUnitOptions([]);
      })
      .finally(() => {
        setIsLoadingSubUnit(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedSubUnit ||
      !kodeUpb.trim() ||
      !namaUpb.trim() ||
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
      sub_unit_id: selectedSubUnit.value,
      kode_upb: kodeUpb,
      nama_upb: namaUpb,
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
                {initialData ? "EDIT UPB" : "TAMBAH UPB"}
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
                <label htmlFor="subUnit" className="block mb-2 text-gray-700">
                  Sub Unit: <span className="text-[#B53C3C]">*</span>
                </label>
                <Select
                  id="subUnit"
                  className="rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  options={subUnitOptions}
                  value={selectedSubUnit}
                  onChange={setSelectedSubUnit}
                  onInputChange={(newValue) => {
                    loadSubUnitOptions(newValue);
                    return newValue;
                  }}
                  isLoading={isLoadingSubUnit}
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
                <label htmlFor="kodeUpb" className="block mb-2 text-gray-700">
                  Kode UPB: <span className="text-[#B53C3C]">*</span>
                </label>
                <input
                  type="number"
                  id="kodeUpb"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  value={kodeUpb}
                  onChange={(e) => setKodeUpb(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="namaUpb" className="block mb-2 text-gray-700">
                  Nama UPB: <span className="text-[#B53C3C]">*</span>
                </label>
                <input
                  type="text"
                  id="namaUpb"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  value={namaUpb}
                  onChange={(e) => setNamaUpb(e.target.value)}
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

export default AddUpbModal;
