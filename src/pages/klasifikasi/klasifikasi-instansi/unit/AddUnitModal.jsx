import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

// Helper untuk format options, bisa ditaruh di luar komponen
const formatOptions = (data, valueKey, labelKey, prefixKey = null) =>
  data.map((item) => ({
    value: item[valueKey],
    label: prefixKey
      ? `${item[prefixKey]} - ${item[labelKey]}`
      : item[labelKey],
  }));

const AddUnitModal = ({ isOpen, onClose, onSave, initialData }) => {
  // State untuk data form
  const [kodeUnit, setKodeUnit] = useState("");
  const [namaUnit, setNamaUnit] = useState("");
  const [kode, setKode] = useState("");

  // State untuk dropdowns
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [selectedBidang, setSelectedBidang] = useState(null);

  // State untuk options dan loading
  const [provinsiOptions, setProvinsiOptions] = useState([]);
  const [kabupatenOptions, setKabupatenOptions] = useState([]);
  const [bidangOptions, setBidangOptions] = useState([]);
  const [isLoadingProvinsi, setIsLoadingProvinsi] = useState(false);
  const [isLoadingKabupaten, setIsLoadingKabupaten] = useState(false);
  const [isLoadingBidang, setIsLoadingBidang] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // =================================================================
  // EFEK 1: SETUP UTAMA SAAT MODAL DIBUKA (MEMPERBAIKI BUG #1 & #2)
  // =================================================================
  useEffect(() => {
    if (isOpen) {
      if (initialData?.bidang?.kabupaten_kota?.provinsi) {
        // --- MODE EDIT ---
        const setupEditMode = async () => {
          setIsLoadingProvinsi(true);
          setIsLoadingKabupaten(true);
          setIsLoadingBidang(true);
          try {
            const { bidang } = initialData;
            const prov = bidang.kabupaten_kota.provinsi;
            const kab = bidang.kabupaten_kota;

            const [provRes, kabRes, bidangRes] = await Promise.all([
              api.get("/klasifikasi-instansi/provinsi/all"),
              api.get(
                `/klasifikasi-instansi/kabupaten-kota/by-provinsi/${prov.id}`
              ),
              api.get(
                `/klasifikasi-instansi/bidang/by-kabupaten-kota/${kab.id}`
              ),
            ]);

            const provOptions = formatOptions(
              provRes.data,
              "id",
              "nama_provinsi",
              "kode_provinsi"
            );
            const kabOptions = formatOptions(
              kabRes.data,
              "id",
              "nama_kabupaten_kota",
              "kode_kabupaten_kota"
            );
            const bidangOptionsFmt = formatOptions(
              bidangRes.data,
              "id",
              "nama_bidang",
              "kode_bidang"
            );

            setProvinsiOptions(provOptions);
            setKabupatenOptions(kabOptions);
            setBidangOptions(bidangOptionsFmt);

            setSelectedProvinsi(provOptions.find((p) => p.value === prov.id));
            setSelectedKabupaten(kabOptions.find((k) => k.value === kab.id));
            setSelectedBidang(
              bidangOptionsFmt.find((b) => b.value === bidang.id)
            );

            setKodeUnit(initialData.kode_unit || "");
            setNamaUnit(initialData.nama_unit || "");
            setKode(initialData.kode || "");
          } catch (err) {
            console.error("Gagal setup edit mode:", err);
            Swal.fire("Error", "Gagal memuat data untuk diedit.", "error");
          } finally {
            setIsLoadingProvinsi(false);
            setIsLoadingKabupaten(false);
            setIsLoadingBidang(false);
          }
        };
        setupEditMode();
      } else {
        // --- MODE ADD ---
        // Reset SEMUA state yang relevan ke kondisi awal
        setKodeUnit("");
        setNamaUnit("");
        setKode("");
        setSelectedProvinsi(null);
        setSelectedKabupaten(null);
        setSelectedBidang(null);
        setKabupatenOptions([]);
        setBidangOptions([]);

        const fetchProvinsi = async () => {
          setIsLoadingProvinsi(true);
          try {
            const res = await api.get("/klasifikasi-instansi/provinsi/all");
            setProvinsiOptions(
              formatOptions(res.data, "id", "nama_provinsi", "kode_provinsi")
            );
          } catch (err) {
            setProvinsiOptions([]); // Pastikan kosong jika gagal
            console.error("Gagal fetch provinsi list:", err);
          } finally {
            setIsLoadingProvinsi(false);
          }
        };
        fetchProvinsi();
      }
    }
  }, [isOpen, initialData]);

  // =====================================================================
  // EFEK 2 & 3: CASCADE SAAT INTERAKSI PENGGUNA (MEMPERBAIKI BUG #3)
  // =====================================================================
  // Menangani perubahan Provinsi oleh pengguna
  useEffect(() => {
    if (!selectedProvinsi?.value) return; // Hanya berjalan jika ada nilai

    const fetchKabupaten = async () => {
      setIsLoadingKabupaten(true);
      try {
        const res = await api.get(
          `/klasifikasi-instansi/kabupaten-kota/by-provinsi/${selectedProvinsi.value}`
        );
        setKabupatenOptions(
          formatOptions(
            res.data,
            "id",
            "nama_kabupaten_kota",
            "kode_kabupaten_kota"
          )
        );
      } catch (err) {
        setKabupatenOptions([]);
        console.error("Gagal fetch kabupaten/kota", err);
      } finally {
        setIsLoadingKabupaten(false);
      }
    };

    fetchKabupaten();
  }, [selectedProvinsi]);

  // Menangani perubahan Kabupaten oleh pengguna
  useEffect(() => {
    if (!selectedKabupaten?.value) return; // Hanya berjalan jika ada nilai

    const fetchBidang = async () => {
      setIsLoadingBidang(true);
      try {
        const res = await api.get(
          `/klasifikasi-instansi/bidang/by-kabupaten-kota/${selectedKabupaten.value}`
        );
        setBidangOptions(
          formatOptions(res.data, "id", "nama_bidang", "kode_bidang")
        );
      } catch (err) {
        setBidangOptions([]);
        console.error("Gagal fetch bidang", err);
      } finally {
        setIsLoadingBidang(false);
      }
    };

    fetchBidang();
  }, [selectedKabupaten]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedProvinsi ||
      !selectedKabupaten ||
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
      console.error("Gagal menyimpan: ", err);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
      });
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
              {/* Provinsi */}
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">
                  Provinsi: <span className="text-[#B53C3C]">*</span>
                </label>
                <Select
                  value={selectedProvinsi}
                  onChange={(option) => {
                    setSelectedProvinsi(option);
                    // Reset anak-anaknya secara manual saat ada interaksi
                    setSelectedKabupaten(null);
                    setKabupatenOptions([]);
                    setSelectedBidang(null);
                    setBidangOptions([]);
                  }}
                  options={provinsiOptions}
                  isLoading={isLoadingProvinsi}
                  placeholder="Pilih provinsi..."
                  isClearable
                />
              </div>

              {/* Kabupaten */}
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">
                  Kabupaten/Kota: <span className="text-[#B53C3C]">*</span>
                </label>
                <Select
                  value={selectedKabupaten}
                  onChange={(option) => {
                    setSelectedKabupaten(option);
                    // Reset anak-anaknya
                    setSelectedBidang(null);
                    setBidangOptions([]);
                  }}
                  options={kabupatenOptions}
                  isLoading={isLoadingKabupaten}
                  placeholder={
                    selectedProvinsi
                      ? "Pilih kabupaten/kota..."
                      : "Pilih provinsi terlebih dahulu"
                  }
                  isDisabled={!selectedProvinsi}
                  isClearable
                />
              </div>
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
                  isLoading={isLoadingBidang}
                  placeholder={
                    selectedKabupaten
                      ? "Pilih bidang..."
                      : "Pilih kabupaten/kota terlebih dahulu"
                  }
                  isDisabled={!selectedKabupaten}
                  isClearable
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
