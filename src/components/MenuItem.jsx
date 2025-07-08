import React from "react";
import PropTypes from "prop-types";

const MenuItem = ({ name, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-36 sm:w-40 md:w-44 h-44 cursor-pointer flex flex-col items-center justify-center rounded-2xl bg-[#b00020] text-white shadow-md hover:bg-[#9e001c] transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b00020]"
    >
      <Icon size={48} className="mb-3" />
      <span className="text-base font-semibold text-center px-2 leading-tight">
        {name}
      </span>
    </button>
  );
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MenuItem;
