import React from "react";

const ImagePreviewModal = ({ show, src, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt="Profile Preview"
          className="w-full h-full object-contain max-w-[80vw] max-h-[80vh]"
        />
        <button
          className="absolute top-2.5 right-2.5 bg-black bg-opacity-50 text-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-lg transition-all duration-200 hover:bg-opacity-70"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
