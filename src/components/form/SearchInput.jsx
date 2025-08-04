// src/components/SearchInput.jsx

import React from "react";
import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <div className={`relative w-full md:w-64 ${className}`}>
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={16}
      />
      <input
        type="text"
        placeholder={placeholder || "Cari..."}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 hover:border-gray-500 rounded-md focus:outline-none focus:border-2 focus:border-[#B53C3C]"
      />
    </div>
  );
};

export default SearchInput;
