import React, { useState, useRef, useEffect } from "react";
import { Settings, ChevronUp, ChevronDown, Columns3Cog } from "lucide-react";

const ColumnManager = ({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleColumn = (field) => {
    const newVisibility = {
      ...columnVisibility,
      [field]: !columnVisibility[field],
    };
    onColumnVisibilityChange?.(newVisibility);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors cursor-pointer border border-gray-300"
        title="Tampilkan/Sembunyikan Kolom"
      >
        <Columns3Cog size={16} />
      </button>

      {isOpen && (
        <div
          // Perubahan ada di sini:
          className="absolute top-full right-0 mt-2 w-64 md:w-72 bg-white rounded-lg shadow-lg border border-gray-300 z-50 transform origin-top-right transition-transform duration-200 ease-out scale-95 opacity-0 focus:scale-100 focus:opacity-100"
          // Class untuk animasi
          style={{
            transform: isOpen
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(-5px)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-blue-600" />
              <h3 className="text-sm font-medium text-gray-800">
                Tampilkan/Sembunyikan Kolom
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Daftar Checkbox */}
          <div className="max-h-64 overflow-y-auto">
            {columns.map((column) => (
              <div
                key={column.field}
                onClick={() => handleToggleColumn(column.field)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={columnVisibility[column.field]}
                  onChange={() => handleToggleColumn(column.field)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 flex-1 select-none">
                  {column.headerName || column.field}
                </span>
              </div>
            ))}
          </div>

          {/* Footer panah */}
          <div className="flex justify-center py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex flex-col items-center gap-1">
              <ChevronUp size={12} className="text-gray-400" />
              <ChevronDown size={12} className="text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnManager;
