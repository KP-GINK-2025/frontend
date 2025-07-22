import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const AddBidangModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kodeBidang, setKodeBidang] = useState("");
  const [namaBidang, setNamaBidang] = useState("");
  const [kode, setKode] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [kabupatenOptions, setKabupatenOptions] = useState([]);
  const [isLoadingKabupaten, setIsLoadingKabupaten] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // --- MODE EDIT ---
        setKodeBidang(initialData.kode_bidang || "");
        setNamaBidang(initialData.nama_bidang || "");
        setKode(initialData.kode || "");

        // Cek apakah data kabupaten/kota sudah ada di `initialData`
        if (initialData.kabupaten_kota) {
          // Jika ya (dari eager loading atau frontend join), langsung gunakan
          const kab = initialData.kabupaten_kota;
          const option = {
            value: kab.id,
            label: `${kab.kode_kabupaten_kota} - ${kab.nama_kabupaten_kota}`,
          };
          setSelectedKabupaten(option);
          setKabupatenOptions([option]); // Set opsi awal
        } else if (initialData.kabupaten_kota_id) {
          // Fallback: Jika hanya ada ID, fetch ke API (seperti sebelumnya)
          setIsLoadingKabupaten(true);
          api
            .get(
              `/klasifikasi-instansi/kabupaten-kota/${initialData.kabupaten_kota_id}`
            )
            .then((response) => {
              const data = response.data;
              const option = {
                value: data.id,
                label: `${data.kode_kabupaten_kota} - ${data.nama_kabupaten_kota}`,
              };
              setSelectedKabupaten(option);
              setKabupatenOptions([option]);
            })
            .catch((error) =>
              console.error("Gagal fetch initial kabupaten data:", error)
            )
            .finally(() => setIsLoadingKabupaten(false));
        } else {
          setSelectedKabupaten(null);
        }
      } else {
        // --- MODE TAMBAH BARU (Reset semua form) ---
        setKodeBidang("");
        setNamaBidang("");
        setKode("");
        setSelectedKabupaten(null);
        setKabupatenOptions([]);
      }
    }
  }, [isOpen, initialData]);

  const loadKabupatenOptions = (inputValue) => {
    if (!inputValue) {
      return;
    }
    setIsLoadingKabupaten(true);
    api
      .get(`/klasifikasi-instansi/kabupaten-kota/all?search=${inputValue}`)
      .then((response) => {
        // === PERUBAHAN DI SINI ===
        // Langsung map dari response.data karena API mengembalikan array
        const formattedOptions = response.data.map((item) => ({
          value: item.id,
          label: `${item.kode_kabupaten_kota} - ${item.nama_kabupaten_kota}`,
        }));
        setKabupatenOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Gagal cari data kabupaten:", error);
        setKabupatenOptions([]);
      })
      .finally(() => {
        setIsLoadingKabupaten(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedKabupaten ||
      !kodeBidang.trim() ||
      !namaBidang.trim() ||
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
      kabupaten_kota_id: selectedKabupaten.value,
      kode_bidang: kodeBidang,
      nama_bidang: namaBidang,
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
                {initialData ? "EDIT BIDANG" : "TAMBAH BIDANG"}
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
                <label
                  htmlFor="kabupatenKota"
                  className="block mb-2 text-gray-700"
                >
                  Kabupaten/Kota: <span className="text-[#B53C3C]">*</span>
                </label>
                <Select
                  id="kabupatenKota"
                  className="rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  options={kabupatenOptions}
                  value={selectedKabupaten}
                  onChange={setSelectedKabupaten}

                  onInputChange={(newValue) => {
                    loadKabupatenOptions(newValue);
                    return newValue;
                  }}
                  isLoading={isLoadingKabupaten}
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
                <label
                  htmlFor="kodeBidang"
                  className="block mb-2 text-gray-700"
                >
                  Kode Bidang: <span className="text-[#B53C3C]">*</span>
                </label>
                <input
                  type="number"
                  id="kodeBidang"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  value={kodeBidang}
                  onChange={(e) => setKodeBidang(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="namaBidang"
                  className="block mb-2 text-gray-700"
                >
                  Nama Bidang: <span className="text-[#B53C3C]">*</span>
                </label>
                <input
                  type="text"
                  id="namaBidang"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
                  value={namaBidang}
                  onChange={(e) => setNamaBidang(e.target.value)}
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

export default AddBidangModal;
