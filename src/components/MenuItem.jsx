import React from "react";

const MenuItem = ({ name, icon: Icon, onClick }) => {
  return (
    <div
      className="bg-[#b00020] text-white rounded-xl w-28 h-28 flex flex-col items-center justify-center cursor-pointer shadow-md hover:bg-[#9e001c] transition"
      onClick={onClick}
    >
      <Icon size={36} />
      <span className="text-sm font-medium text-center mt-2">{name}</span>
    </div>
  );
};

export default MenuItem;
