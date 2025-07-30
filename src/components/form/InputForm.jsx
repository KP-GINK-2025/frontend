// src/components/form/InputForm.jsx
import React from "react";

const InputForm = ({
  formTitle,
  id,
  type = "text",
  value,
  onChange,
  required = true,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2 text-gray-700">
        {formTitle} <span className="text-[#e53935]">*</span>
      </label>
      <input
        type={type}
        id={id}
        className="w-full px-3 py-2 border border-gray-300 hover:border-gray-500 rounded-sm focus:outline-none focus:border-2 focus:border-[#B53C3C]"
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
};

export default InputForm;
