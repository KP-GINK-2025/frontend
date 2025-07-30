// src/components/form/SelectForm.jsx
import React from "react";
import Select from "react-select";

const SelectForm = ({
  formTitle,
  id,
  options,
  value,
  onChange,
  isLoading,
  placeholder,
  isDisabled,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2 text-gray-700">
        {formTitle} <span className="text-[#e53935]">*</span>
      </label>
      <Select
        id={id}
        options={options}
        value={value}
        onChange={onChange}
        isLoading={isLoading}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable
        required
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: "42px", // Konsistensi tinggi
            borderRadius: "4px", // Meniru 'rounded-sm'
            boxShadow: "none", // Menghapus efek shadow bawaan
            outline: "none", // Meniru 'focus:outline-none'

            // Mengatur border-width & border-color secara dinamis
            borderWidth: state.isFocused ? "2px" : "1px", // Meniru 'focus:border-2'
            borderColor: state.isFocused
              ? "#B53C3C" // Warna border saat FOKUS
              : "#d1d5db", // Warna border NORMAL (gray-300)

            // Mengatur warna border saat di-hover
            "&:hover": {
              borderColor: state.isFocused
                ? "#B53C3C" // Warna border saat FOKUS dan di-hover
                : "#6b7280", // Warna border saat di-hover (gray-500)
            },
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: "0 11px", // Disesuaikan sedikit agar pas dengan px-3 & border-2
          }),
          // Style lain bisa ditambahkan di sini jika perlu
          option: (provided, state) => ({
            ...provided,
            cursor: "pointer",
            backgroundColor: state.isSelected
              ? "#B53C3C"
              : state.isFocused
              ? "#fee2e2" // red-100 untuk hover/focus
              : "white",
            color: state.isSelected ? "white" : "black",
            "&:active": {
              backgroundColor: "#ef4444", // red-500
            },
          }),
          menu: (provided) => ({
            ...provided,
            marginTop: "2px",
            borderRadius: "4px",
          }),
        }}
      />
    </div>
  );
};

export default SelectForm;
