import React, { useState, useRef, useEffect } from "react";
import { Settings, ChevronUp, ChevronDown, Columns3Cog } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-md transition-colors cursor-pointer border border-gray-300 hover:border-gray-500"
        title="Tampilkan/Sembunyikan Kolom"
      >
        <Columns3Cog size={16} />
        <label
          htmlFor="columnManager"
          className="cursor-pointer hidden sm:inline"
        >
          Atur Kolom
        </label>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 origin-top-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-800" />
                <h3 className="text-sm font-semibold text-gray-800">
                  Atur Kolom
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Daftar Checkbox */}
            <div className="max-h-64 overflow-y-auto p-1">
              {columns.map((column) => (
                <label
                  key={column.field}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={columnVisibility[column.field] ?? true}
                    onChange={() => handleToggleColumn(column.field)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 flex-1 select-none">
                    {column.headerName || column.field}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColumnManager;
