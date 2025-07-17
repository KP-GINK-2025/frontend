import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import api from "../../../../api/axios";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isInitialRender = useRef(true);

  const formatOptions = (data, valueKey, labelKey, labelPrefixKey) =>
    data.map((item) => ({
      value: item[valueKey],
      label: `${item[labelPrefixKey] || ""} - ${item[labelKey]}`.replace(
        /^- /,
        ""
      ),
    }));

  // EFEK 1: Setup awal saat modal terbuka
  useEffect(() => {
    if (!isOpen) {
      isInitialRender.current = true;
      return;
    }

    const setupEditMode = async () => {
      isInitialRender.current = true;
      setIsLoading(true);
      try {
        const { bidang } = initialData;
        setKodeUnit(initialData.kode_unit || "");
        setNamaUnit(initialData.nama_unit || "");
        setKode(initialData.kode || "");

        const [provinsiRes, kabRes, bidangRes] = await Promise.all([
          api.get("/klasifikasi-instansi/provinsi/all"),
          // ==== PERUBAHAN ENDPOINT 1 (Mode Edit) ====
          api.get(
            `/klasifikasi-instansi/kabupaten-kota/by-provinsi/${bidang.kabupaten_kota.provinsi.id}`
          ),
          api.get(
            `/klasifikasi-instansi/bidang?per_page=1000&kabupaten_kota_id=${bidang.kabupaten_kota.id}`
          ),
        ]);

        setProvinsiOptions(
          formatOptions(
            provinsiRes.data,
            "id",
            "nama_provinsi",
            "kode_provinsi"
          )
        );
        setKabupatenOptions(
          formatOptions(
            kabRes.data,
            "id",
            "nama_kabupaten_kota",
            "kode_kabupaten_kota"
          )
        );
        setBidangOptions(
          formatOptions(bidangRes.data.data, "id", "nama_bidang", "kode_bidang")
        );

        setSelectedProvinsi({
          value: bidang.kabupaten_kota.provinsi.id,
          label: `${bidang.kabupaten_kota.provinsi.kode_provinsi} - ${bidang.kabupaten_kota.provinsi.nama_provinsi}`,
        });
        setSelectedKabupaten({
          value: bidang.kabupaten_kota.id,
          label: `${bidang.kabupaten_kota.kode_kabupaten_kota} - ${bidang.kabupaten_kota.nama_kabupaten_kota}`,
        });
        setSelectedBidang({
          value: bidang.id,
          label: `${bidang.kode_bidang} - ${bidang.nama_bidang}`,
        });
      } catch (err) {
        console.error("Gagal setup edit mode:", err);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          isInitialRender.current = false;
        }, 0);
      }
    };

    const setupAddMode = async () => {
      isInitialRender.current = true;
      setIsLoading(true);
      setKodeUnit("");
      setNamaUnit("");
      setKode("");
      setSelectedProvinsi(null);
      setSelectedKabupaten(null);
      setSelectedBidang(null);
      setKabupatenOptions([]);
      setBidangOptions([]);
      try {
        const res = await api.get("/klasifikasi-instansi/provinsi/all");
        setProvinsiOptions(
          formatOptions(res.data, "id", "nama_provinsi", "kode_provinsi")
        );
      } catch (err) {
        console.error("Gagal fetch provinsi list:", err);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          isInitialRender.current = false;
        }, 0);
      }
    };

    if (initialData) {
      setupEditMode();
    } else {
      setupAddMode();
    }
  }, [isOpen, initialData]);

  // EFEK 2: Berjalan SAAT PENGGUNA mengubah pilihan Provinsi
  useEffect(() => {
    if (isInitialRender.current) return;

    setSelectedKabupaten(null);
    setBidangOptions([]);
    setSelectedBidang(null);
    setKabupatenOptions([]);

    if (!selectedProvinsi?.value) return;

    setIsLoading(true);
    // ==== PERUBAHAN ENDPOINT 2 (Mode Interaktif) ====
    api
      .get(
        `/klasifikasi-instansi/kabupaten-kota/by-provinsi/${selectedProvinsi.value}`
      )
      .then((res) => {
        // Asumsi endpoint baru ini mengembalikan array langsung, bukan objek paginasi
        setKabupatenOptions(
          formatOptions(
            res.data,
            "id",
            "nama_kabupaten_kota",
            "kode_kabupaten_kota"
          )
        );
      })
      .catch((err) =>
        console.error("Gagal fetch kabupaten/kota by provinsi:", err)
      )
      .finally(() => setIsLoading(false));
  }, [selectedProvinsi]);

  // EFEK 3: Berjalan SAAT PENGGUNA mengubah pilihan Kabupaten/Kota
  useEffect(() => {
    if (isInitialRender.current) return;

    setSelectedBidang(null);
    setBidangOptions([]);

    if (!selectedKabupaten?.value) return;

    setIsLoading(true);
    api
      .get(
        `/klasifikasi-instansi/bidang?per_page=1000&kabupaten_kota_id=${selectedKabupaten.value}`
      )
      .then((res) => {
        setBidangOptions(
          formatOptions(res.data.data, "id", "nama_bidang", "kode_bidang")
        );
      })
      .catch((err) => console.error("Gagal fetch bidang:", err))
      .finally(() => setIsLoading(false));
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
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }
    const dataToSave = {
      bidang_id: selectedBidang.value,
      kode_unit: kodeUnit,
      nama_unit: namaUnit,
      kode,
    };

    try {
      setIsSaving(true); // start loading
      await onSave(
        initialData ? { ...dataToSave, id: initialData.id } : dataToSave
      );
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan: ", err);
    } finally {
      setIsSaving(false); // stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
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
          className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2"
        >
          <div className="mb-4">
            <label htmlFor="provinsi" className="block mb-2 text-gray-700">
              Provinsi: <span className="text-[#B53C3C]">*</span>
            </label>
            <Select
              id="provinsi"
              options={provinsiOptions}
              value={selectedProvinsi}
              onChange={setSelectedProvinsi}
              isLoading={isLoading && provinsiOptions.length === 0}
              isDisabled={isLoading}
              placeholder="- Pilih Provinsi -"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="kabKot" className="block mb-2 text-gray-700">
              Kabupaten/Kota: <span className="text-[#B53C3C]">*</span>
            </label>
            <Select
              id="kabKot"
              options={kabupatenOptions}
              value={selectedKabupaten}
              onChange={setSelectedKabupaten}
              isLoading={isLoading && !!selectedProvinsi}
              isDisabled={!selectedProvinsi || isLoading}
              placeholder="- Pilih Kabupaten/Kota -"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bidang" className="block mb-2 text-gray-700">
              Bidang: <span className="text-[#B53C3C]">*</span>
            </label>
            <Select
              id="bidang"
              options={bidangOptions}
              value={selectedBidang}
              onChange={setSelectedBidang}
              isLoading={isLoading && !!selectedKabupaten}
              isDisabled={!selectedKabupaten || isLoading}
              placeholder="- Pilih Bidang -"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="kodeUnit" className="block mb-2 text-gray-700">
              Kode Unit: <span className="text-[#B53C3C]">*</span>
            </label>
            <input
              type="text"
              id="kodeUnit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
              value={kodeUnit}
              onChange={(e) => setKodeUnit(e.target.value)}
              required
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
      </div>
    </div>
  );
};

export default AddUnitModal;
