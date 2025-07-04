import React from "react";
import PropTypes from "prop-types";

const MenuItem = ({ name, icon: Icon, onClick }) => {
  return (
    <div
      className="bg-[#b00020] text-white rounded-2xl w-44 h-44 flex flex-col items-center justify-center cursor-pointer shadow-lg hover:bg-[#9e001c] transition-all duration-200 ease-in-out"
      onClick={onClick}
    >
      <Icon size={48} className="mb-3" />
      <span className="text-base font-semibold text-center px-2">{name}</span>
    </div>
  );
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MenuItem;
