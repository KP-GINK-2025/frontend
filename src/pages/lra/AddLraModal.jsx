import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios"; // Changed to relative path and 'api' variable name

const AddLraModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [tahun, setTahun] = useState(String(new Date().getFullYear())); // Set default to current year
  const [bidang, setBidang] = useState("");
  const [unit, setUnit] = useState("");
  const [subUnit, setSubUnit] = useState("");
  const [upb, setUpb] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // State for LRA KIB values
  const [nilaiLraKibA, setNilaiLraKibA] = useState("");
  const [nilaiLraKibB, setNilaiLraKibB] = useState("");
  const [nilaiLraKibC, setNilaiLraKibC] = useState("");
  const [nilaiLraKibD, setNilaiLraKibD] = useState("");
  const [nilaiLraKibE, setNilaiLraKibE] = useState("");
  const [nilaiLraKibF, setNilaiLraKibF] = useState("");
  const [nilaiTotalLra, setNilaiTotalLra] = useState(""); // This is the actual "Nilai Total" input

  // State for dropdown data from API
  const [bidangData, setBidangData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [subUnitData, setSubUnitData] = useState([]);
  const [upbData, setUpbData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Ref for the scrollable form element
  const formRef = useRef(null);

  // Fetch data from API
  const fetchDropdownData = async () => {
    setIsLoading(true);
    try {
      const [bidangRes, unitRes, subUnitRes, upbRes] = await Promise.all([
        api.get("/klasifikasi-instansi/bidang"),
        api.get("/klasifikasi-instansi/unit"),
        api.get("/klasifikasi-instansi/subunit"),
        api.get("/klasifikasi-instansi/upb"),
      ]);

      // Ensure response data is an array, otherwise set as empty array
      setBidangData(
        Array.isArray(bidangRes.data?.data) ? bidangRes.data.data : []
      );
      setUnitData(Array.isArray(unitRes.data?.data) ? unitRes.data.data : []);
      setSubUnitData(
        Array.isArray(subUnitRes.data?.data) ? subUnitRes.data.data : []
      );
      setUpbData(Array.isArray(upbRes.data?.data) ? upbRes.data.data : []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      // Fallback to dummy data if API fails (optional, can be removed if not needed)
      setBidangData([
        { id: 1, nama: "Bidang Keuangan" },
        { id: 2, nama: "Bidang Umum" },
      ]);
      setUnitData([
        { id: 1, nama: "Unit Anggaran" },
        { id: 2, nama: "Unit Gaji" },
      ]);
      setSubUnitData([
        { id: 1, nama: "Sub Unit A" },
        { id: 2, nama: "Sub Unit B" },
      ]);
      setUpbData([
        { id: 1, nama: "UPB A" },
        { id: 2, nama: "UPB B" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();

      if (initialData) {
        setTahun(initialData.tahun || String(new Date().getFullYear())); // Set default to current year if initialData.tahun is empty
        setBidang(initialData.bidang || "");
        setUnit(initialData.unit || "");
        setSubUnit(initialData.subUnit || "");
        setUpb(initialData.upb || "");
        setKeterangan(initialData.keterangan || "");
        setNilaiLraKibA(initialData.nilaiLraKibA || "");
        setNilaiLraKibB(initialData.nilaiLraKibB || "");
        setNilaiLraKibC(initialData.nilaiLraKibC || "");
        setNilaiLraKibD(initialData.nilaiLraKibD || "");
        setNilaiLraKibE(initialData.nilaiLraKibE || "");
        setNilaiLraKibF(initialData.nilaiLraKibF || "");
        setNilaiTotalLra(initialData.nilaiTotalLra || "");
      } else {
        // Reset form when in add new mode
        setTahun(String(new Date().getFullYear())); // Reset to current year
        setBidang("");
        setUnit("");
        setSubUnit("");
        setUpb("");
        setKeterangan("");
        setNilaiLraKibA("");
        setNilaiLraKibB("");
        setNilaiLraKibC("");
        setNilaiLraKibD("");
        setNilaiLraKibE("");
        setNilaiLraKibF("");
        setNilaiTotalLra("");
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors = {};

    // Tahun is no longer a required input, it's displayed statically
    if (!bidang) newErrors.bidang = "Kolom Bidang harus diisi";
    if (!unit) newErrors.unit = "Kolom Unit harus diisi";
    if (!subUnit) newErrors.subUnit = "Kolom Sub Unit harus diisi";
    if (!upb) newErrors.upb = "Kolom UPB harus diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ensure form does not refresh the page

    if (!validateForm()) {
      return;
    }

    const dataToSave = {
      tahun, // Tahun value is taken from state, which is now current year
      bidang,
      unit,
      subUnit,
      upb,
      keterangan,
      nilaiLraKibA: Number(nilaiLraKibA) || 0,
      nilaiLraKibB: Number(nilaiLraKibB) || 0,
      nilaiLraKibC: Number(nilaiLraKibC) || 0,
      nilaiLraKibD: Number(nilaiLraKibD) || 0,
      nilaiLraKibE: Number(nilaiLraKibE) || 0,
      nilaiLraKibF: Number(nilaiLraKibF) || 0,
      nilaiTotalLra: Number(nilaiTotalLra) || 0,
    };

    if (initialData && initialData.id) {
      onSave({ ...dataToSave, id: initialData.id });
    } else {
      onSave(dataToSave);
    }
    onClose();
  };

  // Custom Number Input with increase/decrease buttons
  // This component now manages its own value state internally
  const NumberInputWithControls = ({
    label,
    value: propValue, // Rename prop 'value' to 'propValue' to avoid conflict with internal state
    onChange,
    placeholder = "0,00",
    required = false,
    error,
  }) => {
    const [internalValue, setInternalValue] = useState(propValue);

    // Synchronize internalValue with propValue when propValue changes (e.g., when modal opens for edit)
    useEffect(() => {
      setInternalValue(propValue);
    }, [propValue]);

    const handleIncrement = (e) => {
      e.preventDefault(); // Prevent scroll
      const currentValue = parseFloat(internalValue) || 0;
      setInternalValue((currentValue + 1).toString());
    };

    const handleDecrement = (e) => {
      e.preventDefault(); // Prevent scroll
      const currentValue = parseFloat(internalValue) || 0;
      // Removed the condition 'if (currentValue > 0)' to allow negative values
      setInternalValue((currentValue - 1).toString());
    };

    const handleInputChange = (e) => {
      const val = e.target.value;
      // Allow empty, numbers, and decimal points, and negative sign at the beginning
      if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
        setInternalValue(val);
      }
    };

    // Call onChange prop only when input loses focus (onBlur)
    const handleBlur = () => {
      onChange({ target: { value: internalValue } });
    };

    return (
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            className={`w-full px-3 py-2 pr-10 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={internalValue} // Use internalValue
            onChange={handleInputChange}
            onBlur={handleBlur} // Call handleBlur when input loses focus
            placeholder={placeholder}
          />
          <div className="absolute inset-y-0 right-0 flex flex-col">
            <button
              type="button" // Important: ensure type="button" to prevent form submission and scroll jump
              onClick={handleIncrement}
              className="flex-1 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none border-l border-gray-300"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              type="button" // Important: ensure type="button" to prevent form submission and scroll jump
              onClick={handleDecrement}
              className="flex-1 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none border-l border-t border-gray-300"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center mt-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    );
  };
  const CustomSelect = ({
    label,
    value,
    onChange,
    options = [], // Default empty array
    placeholder,
    required = false,
    error,
    name,
  }) => (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 pr-10 text-sm border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          required={required}
        >
          <option value="">{placeholder}</option>
          {Array.isArray(options) &&
            options.map((option) => (
              <option key={option.id} value={option.nama}>
                {option.nama}
              </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <div className="flex items-center mt-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg mx-4 p-6 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "EDIT LRA" : "ADD LRA"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer transition-colors"
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

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : (
              <form
                ref={formRef}
                className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-4"
              >
                {/* Tahun - Display only, not an input */}
                <div className="mb-4 flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mr-2">
                    Tahun :
                  </label>
                  <span className="text-sm text-gray-900 font-semibold">
                    {tahun}
                  </span>
                </div>

                {/* Semester dropdown removed */}

                <CustomSelect
                  label="Bidang"
                  value={bidang}
                  onChange={(e) => setBidang(e.target.value)}
                  options={bidangData}
                  placeholder="- Pilih Bidang -"
                  required
                  error={errors.bidang}
                  name="bidang"
                />

                <CustomSelect
                  label="Unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  options={unitData}
                  placeholder="- Pilih Unit -"
                  required
                  error={errors.unit}
                  name="unit"
                />

                <CustomSelect
                  label="Sub Unit"
                  value={subUnit}
                  onChange={(e) => setSubUnit(e.target.value)}
                  options={subUnitData}
                  placeholder="- Pilih Sub Unit -"
                  required
                  error={errors.subUnit}
                  name="subUnit"
                />

                <CustomSelect
                  label="UPB"
                  value={upb}
                  onChange={(e) => setUpb(e.target.value)}
                  options={upbData}
                  placeholder="- Pilih UPB -"
                  required
                  error={errors.upb}
                  name="upb"
                />

                <NumberInputWithControls
                  label="Nilai LRA KIB A/Tanah"
                  value={nilaiLraKibA}
                  onChange={(e) => setNilaiLraKibA(e.target.value)}
                />

                <NumberInputWithControls
                  label="Nilai LRA KIB B/Peralatan dan Mesin"
                  value={nilaiLraKibB}
                  onChange={(e) => setNilaiLraKibB(e.target.value)}
                />

                <NumberInputWithControls
                  label="Nilai LRA KIB C/Gedung dan Bangunan"
                  value={nilaiLraKibC}
                  onChange={(e) => setNilaiLraKibC(e.target.value)}
                />

                <NumberInputWithControls
                  label="Nilai LRA KIB D/Jalan, Irigasi dan Jaringan"
                  value={nilaiLraKibD}
                  onChange={(e) => setNilaiLraKibD(e.target.value)}
                />

                <NumberInputWithControls
                  label="Nilai LRA KIB E/Aset Tetap Lainnya"
                  value={nilaiLraKibE}
                  onChange={(e) => setNilaiLraKibE(e.target.value)}
                />

                <NumberInputWithControls
                  label="Nilai LRA KIB F/Kontruksi Dalam Pengerjaan"
                  value={nilaiLraKibF}
                  onChange={(e) => setNilaiLraKibF(e.target.value)}
                />

                <NumberInputWithControls
                  label="Nilai Total"
                  value={nilaiTotalLra}
                  onChange={(e) => setNilaiTotalLra(e.target.value)}
                />

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Keterangan
                  </label>
                  <textarea
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    rows="3"
                    placeholder="Masukkan keterangan (opsional)"
                  />
                </div>
              </form>
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition-colors disabled:opacity-50"
                disabled={isLoading}
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

export default AddLraModal;
