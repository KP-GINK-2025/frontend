import React from "react";
import PropTypes from "prop-types";

const MenuItem = ({ name, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-36 sm:w-40 md:w-44 h-44 cursor-pointer flex flex-col items-center justify-center bg-[#b00020] text-white text-sm font-medium outline-2 rounded-xl shadow-sm transition-all duration-200 hover:bg-white hover:text-[#b00020] hover:scale-[1.03]"
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
