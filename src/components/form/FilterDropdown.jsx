// src/components/FilterDropdown.jsx

import React from "react";

const FilterDropdown = ({
  value,
  onChange,
  options = [],
  placeholder,
  loading = false,
  disabled = false,
  className = "border border-gray-300 hover:border-gray-500 rounded-md px-3 py-2 text-sm w-full md:w-auto cursor-pointer focus:outline-none focus:border-2 focus:border-[#B53C3C]",
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className={className}
    >
      <option value="">{loading ? "Memuat..." : placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
