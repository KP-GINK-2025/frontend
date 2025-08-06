import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; // Removed ChevronUp, ChevronDown as we won't use them
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

// Helper Component for Text/Number Inputs
const FormInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  min = null, // For number inputs
  max = null, // For number inputs
}) => {
  const isNumber = type === "number";

  const handleNumberChange = (e) => {
    const val = e.target.value;
    // Allow empty string for clearing input, otherwise parse as number
    onChange(id, val === "" ? "" : Number(val));
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-500" : ""
        }`}
        value={value}
        onChange={
          isNumber ? handleNumberChange : (e) => onChange(id, e.target.value)
        }
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Helper Component for Select Inputs
const FormSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  valueKey = "id",
  labelKey = "nama",
  codeKey = null, // Optional code for display like "CODE - Name"
  error,
  placeholder = `- Pilih ${label} -`,
  required = false,
  disabled = false,
  loading = false,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-700"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? "border-red-500" : ""
      }`}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      required={required}
      disabled={disabled || loading}
    >
      <option value="">{loading ? "Memuat..." : placeholder}</option>
      {options.map((option) => (
        <option
          key={option[valueKey] || option} // Use valueKey or option itself if it's a primitive
          value={option[valueKey] || option}
        >
          {codeKey && option[codeKey] ? `${option[codeKey]} - ` : ""}
          {option[labelKey] || option}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const AddRuanganModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  // Ensure dropdownData contains all necessary lists
  dropdownData = {
    tahun: [],
    provinsi: [],
    kabupaten_kota: [],
    bidang: [],
    unit: [],
    subUnit: [],
    upb: [],
    bidang1: [], // Assuming these are separate lists for "Bidang 1", etc.
    unit1: [],
    subunit1: [],
    upb1: [],
    akun: [],
    kelompok: [],
    jenis: [],
    objek: [],
    rincian_objek: [],
    sub_rincian: [],
    sub_sub_rincian: [],
  },
}) => {
  const [formData, setFormData] = useState({
    tahun: "",
    provinsi: "",
    kabupaten_kota: "",
    bidang: "",
    unit: "",
    subUnit: "",
    upb: "",
    kode_ruangan: "",
    nama_ruangan: "",
    nama_penanggung_jawab: "",
    nip_penanggung_jawab: "",
    jabatan_penanggung_jawab: "",
    bidang1: "",
    unit1: "",
    subunit1: "",
    upb1: "",
    akun: "",
    kelompok: "",
    jenis: "",
    objek: "",
    rincian_objek: "",
    sub_rincian: "",
    sub_sub_rincian: "",
    no_register: "",
    pemilik: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Map initialData to formData, handling nested objects and potential nulls
        setFormData({
          tahun: initialData.tahun || "",
          provinsi: initialData.bidang?.kabupaten_kota?.provinsi?.id || "", // Assuming ID for select
          kabupaten_kota: initialData.bidang?.kabupaten_kota?.id || "", // Assuming ID for select
          bidang: initialData.bidang?.id || "", // Assuming ID for select
          unit: initialData.unit?.id || "", // Assuming ID for select
          subUnit: initialData.subUnit?.id || "", // Assuming ID for select
          upb: initialData.upb?.id || "", // Assuming ID for select
          kode_ruangan: initialData.kode_ruangan || "",
          nama_ruangan: initialData.nama_ruangan || "",
          nama_penanggung_jawab: initialData.nama_penanggung_jawab || "",
          nip_penanggung_jawab: initialData.nip_penanggung_jawab || "",
          jabatan_penanggung_jawab: initialData.jabatan_penanggung_jawab || "",
          bidang1: initialData.bidang1?.id || "",
          unit1: initialData.unit1?.id || "",
          subunit1: initialData.subunit1?.id || "",
          upb1: initialData.upb1?.id || "",
          akun: initialData.akun?.id || "",
          kelompok: initialData.kelompok?.id || "",
          jenis: initialData.jenis?.id || "",
          objek: initialData.objek?.id || "",
          rincian_objek: initialData.rincian_objek?.id || "",
          sub_rincian: initialData.sub_rincian?.id || "",
          sub_sub_rincian: initialData.sub_sub_rincian?.id || "",
          no_register: initialData.no_register || "",
          pemilik: initialData.pemilik || "",
        });
      } else {
        // Reset form for new entry
        setFormData({
          tahun: "",
          provinsi: "",
          kabupaten_kota: "",
          bidang: "",
          unit: "",
          subUnit: "",
          upb: "",
          kode_ruangan: "",
          nama_ruangan: "",
          nama_penanggung_jawab: "",
          nip_penanggung_jawab: "",
          jabatan_penanggung_jawab: "",
          bidang1: "",
          unit1: "",
          subunit1: "",
          upb1: "",
          akun: "",
          kelompok: "",
          jenis: "",
          objek: "",
          rincian_objek: "",
          sub_rincian: "",
          sub_sub_rincian: "",
          no_register: "",
          pemilik: "",
        });
      }
      setErrors({}); // Clear errors when modal opens
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
      "provinsi",
      "kabupaten_kota",
      "bidang",
      "unit",
      "subUnit",
      "upb",
      "kode_ruangan",
      "nama_ruangan",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
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

    // Prepare data to save, potentially mapping IDs back to objects if needed by parent
    const dataToSave = { ...formData };

    // Example of mapping ID back to object for parent component if needed
    // This is a simplified example; in a real app, you might pass the ID and let the backend handle relations
    const findObjectById = (list, id) =>
      list.find((item) => String(item.id) === String(id));

    dataToSave.bidang = findObjectById(dropdownData.bidang, formData.bidang);
    dataToSave.unit = findObjectById(dropdownData.unit, formData.unit);
    dataToSave.subUnit = findObjectById(dropdownData.subUnit, formData.subUnit);
    dataToSave.upb = findObjectById(dropdownData.upb, formData.upb);
    dataToSave.bidang1 = findObjectById(dropdownData.bidang1, formData.bidang1);
    dataToSave.unit1 = findObjectById(dropdownData.unit1, formData.unit1);
    dataToSave.subunit1 = findObjectById(
      dropdownData.subunit1,
      formData.subunit1
    );
    dataToSave.upb1 = findObjectById(dropdownData.upb1, formData.upb1);
    dataToSave.akun = findObjectById(dropdownData.akun, formData.akun);
    dataToSave.kelompok = findObjectById(
      dropdownData.kelompok,
      formData.kelompok
    );
    dataToSave.jenis = findObjectById(dropdownData.jenis, formData.jenis);
    dataToSave.objek = findObjectById(dropdownData.objek, formData.objek);
    dataToSave.rincian_objek = findObjectById(
      dropdownData.rincian_objek,
      formData.rincian_objek
    );
    dataToSave.sub_rincian = findObjectById(
      dropdownData.sub_rincian,
      formData.sub_rincian
    );
    dataToSave.sub_sub_rincian = findObjectById(
      dropdownData.sub_sub_rincian,
      formData.sub_sub_rincian
    );

    // For provinsi and kabupaten_kota, they are nested under bidang in DataRuanganPage.
    // Here, we assume the dropdownData provides flat lists for them.
    // You might need to adjust this logic based on how these are truly structured in your backend.
    const selectedProvinsi = findObjectById(
      dropdownData.provinsi,
      formData.provinsi
    );
    const selectedKabupatenKota = findObjectById(
      dropdownData.kabupaten_kota,
      formData.kabupaten_kota
    );
    if (selectedProvinsi) dataToSave.provinsi = selectedProvinsi.nama_provinsi; // Or just the ID if parent expects it
    if (selectedKabupatenKota)
      dataToSave.kabupaten_kota = selectedKabupatenKota.nama_kabupaten_kota; // Or just the ID

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
      // Reset form data to initial empty state
      tahun: "",
      provinsi: "",
      kabupaten_kota: "",
      bidang: "",
      unit: "",
      subUnit: "",
      upb: "",
      kode_ruangan: "",
      nama_ruangan: "",
      nama_penanggung_jawab: "",
      nip_penanggung_jawab: "",
      jabatan_penanggung_jawab: "",
      bidang1: "",
      unit1: "",
      subunit1: "",
      upb1: "",
      akun: "",
      kelompok: "",
      jenis: "",
      objek: "",
      rincian_objek: "",
      sub_rincian: "",
      sub_sub_rincian: "",
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
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md max-h-[90vh] p-6 bg-white rounded-lg shadow-lg flex flex-col" /* Adjusted max-w-md */
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "Edit Ruangan" : "Tambah Ruangan"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <form
              onSubmit={handleSubmit}
              className="flex-grow overflow-y-auto pr-2 -mr-2"
            >
              {" "}
              {/* Added pr-2 -mr-2 for scrollbar */}
              <div className="grid grid-cols-1 gap-4">
                {" "}
                {/* Changed to 1 column for narrower layout */}
                <FormInput
                  id="tahun"
                  label="Tahun"
                  type="number" // Changed to number
                  value={formData.tahun}
                  onChange={handleInputChange}
                  required={true}
                  error={errors.tahun}
                  placeholder="Masukkan tahun"
                />
                <FormSelect
                  id="provinsi"
                  label="Provinsi"
                  value={formData.provinsi}
                  onChange={handleInputChange}
                  options={dropdownData.provinsi}
                  required={true}
                  error={errors.provinsi}
                  valueKey="id"
                  labelKey="nama_provinsi"
                />
                <FormSelect
                  id="kabupaten_kota"
                  label="Kabupaten/Kota"
                  value={formData.kabupaten_kota}
                  onChange={handleInputChange}
                  options={dropdownData.kabupaten_kota}
                  required={true}
                  error={errors.kabupaten_kota}
                  valueKey="id"
                  labelKey="nama_kabupaten_kota"
                />
                <FormSelect
                  id="bidang"
                  label="Bidang"
                  value={formData.bidang}
                  onChange={handleInputChange}
                  options={dropdownData.bidang}
                  required={true}
                  error={errors.bidang}
                  valueKey="id"
                  labelKey="nama_bidang"
                  codeKey="kode_bidang"
                />
                <FormSelect
                  id="unit"
                  label="Unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  options={dropdownData.unit}
                  required={true}
                  error={errors.unit}
                  valueKey="id"
                  labelKey="nama_unit"
                  codeKey="kode_unit"
                />
                <FormSelect
                  id="subUnit"
                  label="Sub Unit"
                  value={formData.subUnit}
                  onChange={handleInputChange}
                  options={dropdownData.subUnit}
                  required={true}
                  error={errors.subUnit}
                  valueKey="id"
                  labelKey="nama_sub_unit"
                  codeKey="kode_sub_unit"
                />
                <FormSelect
                  id="upb"
                  label="UPB"
                  value={formData.upb}
                  onChange={handleInputChange}
                  options={dropdownData.upb}
                  required={true}
                  error={errors.upb}
                  valueKey="id"
                  labelKey="nama_upb"
                  codeKey="kode_upb"
                />
                <FormInput
                  id="kode_ruangan"
                  label="Kode Ruangan"
                  type="number" // Changed to number
                  value={formData.kode_ruangan}
                  onChange={handleInputChange}
                  required={true}
                  error={errors.kode_ruangan}
                  placeholder="Masukkan kode ruangan"
                />
                <FormInput
                  id="nama_ruangan"
                  label="Nama Ruangan"
                  value={formData.nama_ruangan}
                  onChange={handleInputChange}
                  required={true}
                  error={errors.nama_ruangan}
                  placeholder="Masukkan nama ruangan"
                />
                <FormInput
                  id="nama_penanggung_jawab"
                  label="Nama Penanggung Jawab"
                  value={formData.nama_penanggung_jawab}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama penanggung jawab"
                />
                <FormInput
                  id="nip_penanggung_jawab"
                  label="NIP Penanggung Jawab"
                  value={formData.nip_penanggung_jawab}
                  onChange={handleInputChange}
                  placeholder="Masukkan NIP penanggung jawab"
                />
                <FormInput
                  id="jabatan_penanggung_jawab"
                  label="Jabatan Penanggung Jawab"
                  value={formData.jabatan_penanggung_jawab}
                  onChange={handleInputChange}
                  placeholder="Masukkan jabatan penanggung jawab"
                />
                <FormSelect
                  id="bidang1"
                  label="Bidang 1"
                  value={formData.bidang1}
                  onChange={handleInputChange}
                  options={dropdownData.bidang1}
                  valueKey="id"
                  labelKey="nama" // Assuming 'nama' for these generic classification fields
                />
                <FormSelect
                  id="unit1"
                  label="Unit 1"
                  value={formData.unit1}
                  onChange={handleInputChange}
                  options={dropdownData.unit1}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="subunit1"
                  label="Sub Unit 1"
                  value={formData.subunit1}
                  onChange={handleInputChange}
                  options={dropdownData.subunit1}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="upb1"
                  label="UPB 1"
                  value={formData.upb1}
                  onChange={handleInputChange}
                  options={dropdownData.upb1}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="akun"
                  label="Akun"
                  value={formData.akun}
                  onChange={handleInputChange}
                  options={dropdownData.akun}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="kelompok"
                  label="Kelompok"
                  value={formData.kelompok}
                  onChange={handleInputChange}
                  options={dropdownData.kelompok}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="jenis"
                  label="Jenis"
                  value={formData.jenis}
                  onChange={handleInputChange}
                  options={dropdownData.jenis}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="objek"
                  label="Objek"
                  value={formData.objek}
                  onChange={handleInputChange}
                  options={dropdownData.objek}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="rincian_objek"
                  label="Rincian Objek"
                  value={formData.rincian_objek}
                  onChange={handleInputChange}
                  options={dropdownData.rincian_objek}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="sub_rincian"
                  label="Sub Rincian Objek"
                  value={formData.sub_rincian}
                  onChange={handleInputChange}
                  options={dropdownData.sub_rincian}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormSelect
                  id="sub_sub_rincian"
                  label="Sub Sub Rincian Objek"
                  value={formData.sub_sub_rincian}
                  onChange={handleInputChange}
                  options={dropdownData.sub_sub_rincian}
                  valueKey="id"
                  labelKey="nama"
                />
                <FormInput
                  id="no_register"
                  label="No Register"
                  type="number" // Changed to number
                  value={formData.no_register}
                  onChange={handleInputChange}
                  placeholder="Masukkan no register"
                />
                <FormInput
                  id="pemilik"
                  label="Pemilik"
                  value={formData.pemilik}
                  onChange={handleInputChange}
                  placeholder="Masukkan pemilik"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors cursor-pointer" /* Changed to red */
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
