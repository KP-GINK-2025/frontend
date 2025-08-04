// src/components/Buttons.jsx
import React from "react";

const Buttons = ({
  children,
  onClick,
  type = "button",
  variant = "secondary", // 'success', 'danger', 'info', 'secondary'
  disabled = false,
  className = "",
}) => {
  // Kelas dasar untuk semua tombol, disesuaikan dengan contoh Anda
  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 rounded-md gap-2 cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed";

  // Objek untuk menyimpan semua style varian
  const variantStyles = {
    success: "text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400",
    danger: "text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400",
    info: "text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400",
  };

  // Pilih kelas berdasarkan prop variant, fallback ke 'secondary' jika tidak ada
  const variantClasses = variantStyles[variant] || variantStyles.secondary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Buttons;
