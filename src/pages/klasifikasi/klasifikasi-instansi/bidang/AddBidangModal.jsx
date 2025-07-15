import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../../../api/axios";

const AddBidangModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kodeBidang, setKodeBidang] = useState("");
  const [namaBidang, setNamaBidang] = useState("");
  const [kode, setKode] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState(null);
  const [kabupatenOptions, setKabupatenOptions] = useState([]);
  const [isLoadingKabupaten, setIsLoadingKabupaten] = useState(false);

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
            label: `${kab.id} - ${kab.nama_kabupaten_kota}`,
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
                label: `${data.id} - ${data.nama_kabupaten_kota}`,
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
          label: `${item.id} - ${item.nama_kabupaten_kota}`,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedKabupaten || !kodeBidang || !namaBidang || !kode) {
      alert("Harap lengkapi semua field yang wajib diisi (*).");
      return;
    }
    const dataToSave = {
      kabupaten_kota_id: selectedKabupaten.value,
      kode_bidang: kodeBidang,
      nama_bidang: namaBidang,
      kode,
    };
    if (initialData && initialData.id) {
      onSave({ ...dataToSave, id: initialData.id });
    } else {
      onSave(dataToSave);
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
            {initialData ? "EDIT BIDANG" : "TAMBAH BIDANG"}
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

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-4"
        >
          <div className="mb-4">
            <label htmlFor="kabupatenKota" className="block mb-2 text-gray-700">
              Kabupaten/Kota: <span className="text-[#B53C3C]">*</span>
            </label>
            <Select
              id="kabupatenKota"
              className="rounded-md focus:outline-none focus:ring-2 focus:ring-[#B53C3C]"
              options={kabupatenOptions}
              value={selectedKabupaten}
              onChange={setSelectedKabupaten}
              onInputChange={loadKabupatenOptions}
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
            <label htmlFor="kodeBidang" className="block mb-2 text-gray-700">
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
            <label htmlFor="namaBidang" className="block mb-2 text-gray-700">
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
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#B53C3C] cursor-pointer"
          >
            {initialData ? "Simpan Perubahan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBidangModal;
