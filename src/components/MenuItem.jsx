import React from "react";
import PropTypes from "prop-types";

const MenuItem = ({ name, icon: Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-36 h-36 md:w-40 md:h-40 cursor-pointer flex flex-col items-center justify-center bg-[#B53C3C] text-white text-sm font-medium outline-2 rounded-xl shadow-sm transition-all duration-200 hover:bg-white hover:text-[#B53C3C] hover:scale-[1.03]"
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
