import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const AddRuanganModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  dropdownData = {},
}) => {
  const [formData, setFormData] = useState({
    tahun: "",
    bidang: "",
    unit: "",
    subUnit: "",
    upb: "",
    nama_ruangan: "",
    provinsi: "",
    kabupaten_kota: "",
    kode_ruangan: "",
    nama_penanggung_jawab: "",
    nip_penanggung_jawab: "",
    jabatan_penanggung_jawab: "",
    no_register: "",
    pemilik: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          tahun: initialData.tahun || "",
          bidang: initialData.bidang?.nama || "",
          unit: initialData.unit?.nama || "",
          subUnit: initialData.subUnit?.nama || "",
          upb: initialData.upb?.nama || "",
          nama_ruangan: initialData.nama_ruangan || "",
          provinsi: initialData.provinsi || "",
          kabupaten_kota: initialData.kabupaten_kota || "",
          kode_ruangan: initialData.kode_ruangan || "",
          nama_penanggung_jawab: initialData.nama_penanggung_jawab || "",
          nip_penanggung_jawab: initialData.nip_penanggung_jawab || "",
          jabatan_penanggung_jawab: initialData.jabatan_penanggung_jawab || "",
          no_register: initialData.no_register || "",
          pemilik: initialData.pemilik || "",
        });
      } else {
        setFormData({
          tahun: "",
          bidang: "",
          unit: "",
          subUnit: "",
          upb: "",
          nama_ruangan: "",
          provinsi: "",
          kabupaten_kota: "",
          kode_ruangan: "",
          nama_penanggung_jawab: "",
          nip_penanggung_jawab: "",
          jabatan_penanggung_jawab: "",
          no_register: "",
          pemilik: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "tahun",
      "bidang",
      "unit",
      "subUnit",
      "upb",
      "nama_ruangan",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "Field ini wajib diisi";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data",
        text: "Harap lengkapi semua field yang wajib diisi (*).",
      });
      return;
    }

    const dataToSave = { ...formData };
    if (initialData?.id) {
      dataToSave.id = initialData.id;
    }

    onSave(dataToSave);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: initialData
        ? "Data ruangan berhasil diubah."
        : "Data ruangan berhasil ditambahkan.",
      timer: 1500,
      showConfirmButton: false,
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({
      tahun: "",
      bidang: "",
      unit: "",
      subUnit: "",
      upb: "",
      nama_ruangan: "",
      provinsi: "",
      kabupaten_kota: "",
      kode_ruangan: "",
      nama_penanggung_jawab: "",
      nip_penanggung_jawab: "",
      jabatan_penanggung_jawab: "",
      no_register: "",
      pemilik: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] p-6 bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "Edit Ruangan" : "Tambah Ruangan"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto max-h-[calc(90vh-140px)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ...seluruh field form tetap seperti kode kamu sebelumnya... */}
                {/* Tahun */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Tahun <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.tahun ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.tahun}
                    onChange={(e) => handleInputChange("tahun", e.target.value)}
                  >
                    <option value="">- Pilih Tahun -</option>
                    {dropdownData.tahun?.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.tahun && (
                    <p className="mt-1 text-sm text-red-500">{errors.tahun}</p>
                  )}
                </div>
                {/* ...field lain tetap seperti sebelumnya... */}
                {/* Bidang */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Bidang <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.bidang ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.bidang}
                    onChange={(e) =>
                      handleInputChange("bidang", e.target.value)
                    }
                  >
                    <option value="">- Pilih Bidang -</option>
                    {dropdownData.bidang?.map((item) => (
                      <option key={item.id} value={item.nama_bidang}>
                        {item.nama_bidang}
                      </option>
                    ))}
                  </select>
                  {errors.bidang && (
                    <p className="mt-1 text-sm text-red-500">{errors.bidang}</p>
                  )}
                </div>
                {/* ...field lain tetap seperti sebelumnya... */}
                {/* Unit */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.unit ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                  >
                    <option value="">- Pilih Unit -</option>
                    {dropdownData.unit?.map((item) => (
                      <option key={item.id} value={item.nama_unit}>
                        {item.nama_unit}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
                  )}
                </div>
                {/* Sub Unit */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Sub Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.subUnit ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.subUnit}
                    onChange={(e) =>
                      handleInputChange("subUnit", e.target.value)
                    }
                  >
                    <option value="">- Pilih Sub Unit -</option>
                    {dropdownData.subUnit?.map((item) => (
                      <option key={item.id} value={item.nama_sub_unit}>
                        {item.nama_sub_unit}
                      </option>
                    ))}
                  </select>
                  {errors.subUnit && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.subUnit}
                    </p>
                  )}
                </div>
                {/* UPB */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    UPB <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.upb ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.upb}
                    onChange={(e) => handleInputChange("upb", e.target.value)}
                  >
                    <option value="">- Pilih UPB -</option>
                    {dropdownData.upb?.map((item) => (
                      <option key={item.id} value={item.nama_upb}>
                        {item.nama_upb}
                      </option>
                    ))}
                  </select>
                  {errors.upb && (
                    <p className="mt-1 text-sm text-red-500">{errors.upb}</p>
                  )}
                </div>
                {/* Nama Ruangan */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nama Ruangan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nama_ruangan ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.nama_ruangan}
                    onChange={(e) =>
                      handleInputChange("nama_ruangan", e.target.value)
                    }
                    placeholder="Masukkan nama ruangan"
                  />
                  {errors.nama_ruangan && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.nama_ruangan}
                    </p>
                  )}
                </div>
                {/* ...field lain tetap seperti sebelumnya... */}
                {/* Provinsi */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.provinsi}
                    onChange={(e) =>
                      handleInputChange("provinsi", e.target.value)
                    }
                    placeholder="Masukkan provinsi"
                  />
                </div>
                {/* Kabupaten/Kota */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Kabupaten/Kota
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.kabupaten_kota}
                    onChange={(e) =>
                      handleInputChange("kabupaten_kota", e.target.value)
                    }
                    placeholder="Masukkan kabupaten/kota"
                  />
                </div>
                {/* Kode Ruangan */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Kode Ruangan
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.kode_ruangan}
                    onChange={(e) =>
                      handleInputChange("kode_ruangan", e.target.value)
                    }
                    placeholder="Masukkan kode ruangan"
                  />
                </div>
                {/* Nama Penanggung Jawab */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nama Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.nama_penanggung_jawab}
                    onChange={(e) =>
                      handleInputChange("nama_penanggung_jawab", e.target.value)
                    }
                    placeholder="Masukkan nama penanggung jawab"
                  />
                </div>
                {/* NIP Penanggung Jawab */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    NIP Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.nip_penanggung_jawab}
                    onChange={(e) =>
                      handleInputChange("nip_penanggung_jawab", e.target.value)
                    }
                    placeholder="Masukkan NIP penanggung jawab"
                  />
                </div>
                {/* Jabatan Penanggung Jawab */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Jabatan Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.jabatan_penanggung_jawab}
                    onChange={(e) =>
                      handleInputChange(
                        "jabatan_penanggung_jawab",
                        e.target.value
                      )
                    }
                    placeholder="Masukkan jabatan penanggung jawab"
                  />
                </div>
                {/* No Register */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    No Register
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.no_register}
                    onChange={(e) =>
                      handleInputChange("no_register", e.target.value)
                    }
                    placeholder="Masukkan no register"
                  />
                </div>
                {/* Pemilik */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Pemilik
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.pemilik}
                    onChange={(e) =>
                      handleInputChange("pemilik", e.target.value)
                    }
                    placeholder="Masukkan pemilik"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {initialData ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddRuanganModal;
