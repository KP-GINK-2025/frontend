import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../../../api/axios";

const AddSubUnitModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kodeSubUnit, setKodeSubUnit] = useState("");
  const [namaSubUnit, setNamaSubUnit] = useState("");
  const [kode, setKode] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  const [isLoadingUnit, setIsLoadingUnit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // --- MODE EDIT ---
        setKodeSubUnit(initialData.kode_sub_unit || "");
        setNamaSubUnit(initialData.nama_sub_unit || "");
        setKode(initialData.kode || "");

        // Cek apakah data unit sudah ada di `initialData`
        if (initialData.unit) {
          // Jika ya (dari eager loading atau frontend join), langsung gunakan
          const unit = initialData.unit;
          const option = {
            value: unit.id,
            label: `${unit.kode_unit} - ${unit.nama_unit}`,
          };
          setSelectedUnit(option);
          setUnitOptions([option]); // Set opsi awal
        } else if (initialData.unit_id) {
          // Fallback: Jika hanya ada ID, fetch ke API (seperti sebelumnya)
          setIsLoadingUnit(true);
          api
            .get(`/klasifikasi-instansi/unit/${initialData.unit_id}`)
            .then((response) => {
              const data = response.data.data;
              const option = {
                value: data.id,
                label: `${data.kode_unit} - ${data.nama_unit}`,
              };
              setSelectedUnit(option);
              setUnitOptions([option]);
            })
            .catch((error) =>
              console.error("Gagal fetch initial unit data:", error)
            )
            .finally(() => setIsLoadingUnit(false));
        } else {
          setSelectedUnit(null);
        }
      } else {
        // --- MODE TAMBAH BARU (Reset semua form) ---
        setKodeSubUnit("");
        setNamaSubUnit("");
        setKode("");
        setSelectedUnit(null);
        setUnitOptions([]);
      }
    }
  }, [isOpen, initialData]);

  const loadUnitOptions = (inputValue) => {
    if (!inputValue) {
      return;
    }
    setIsLoadingUnit(true);
    api
      .get(`/klasifikasi-instansi/unit?per_page=1000&search=${inputValue}`)
      .then((response) => {
        const formattedOptions = response.data.data.map((item) => ({
          value: item.id,
          label: `${item.kode_unit} - ${item.nama_unit}`,
        }));
        setUnitOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Gagal cari data unit:", error);
        setUnitOptions([]);
      })
      .finally(() => {
        setIsLoadingUnit(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedUnit ||
      !kodeSubUnit.trim() ||
      !namaSubUnit.trim() ||
      !kode.trim()
    ) {
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }
    const dataToSave = {
      unit_id: selectedUnit.value,
      kode_sub_unit: kodeSubUnit,
      nama_sub_unit: namaSubUnit,
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
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error("Gagal menyimpan: ", err);
    } finally {
      setIsSaving(false); // Selesai loading
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "EDIT SUB UNIT" : "TAMBAH SUB UNIT"}
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
          <div className="mb-4">
            <label htmlFor="unit" className="block mb-2 text-gray-700">
              Unit: <span className="text-[#B53C3C]">*</span>
            </label>
            <Select
              id="unit"
              className="rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
              options={unitOptions}
              value={selectedUnit}
              onChange={setSelectedUnit}
              onInputChange={loadUnitOptions}
              isLoading={isLoadingUnit}
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
            <label htmlFor="kodeSubUnit" className="block mb-2 text-gray-700">
              Kode Sub Unit: <span className="text-[#B53C3C]">*</span>
            </label>
            <input
              type="number"
              id="kodeSubUnit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
              value={kodeSubUnit}
              onChange={(e) => setKodeSubUnit(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="namaSubUnit" className="block mb-2 text-gray-700">
              Nama Sub Unit: <span className="text-[#B53C3C]">*</span>
            </label>
            <input
              type="text"
              id="namaSubUnit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
              value={namaSubUnit}
              onChange={(e) => setNamaSubUnit(e.target.value)}
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

export default AddSubUnitModal;
