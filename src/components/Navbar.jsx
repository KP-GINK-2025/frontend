import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown"; // Import the new UserDropdown component
import ImagePreviewModal from "./ImagePreviewModal"; // Import the new ImagePreviewModal component

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest",
    avatar: null,
  };

  const avatarSrc =
    avatarPreview ||
    storedUser.avatar ||
    `https://ui-avatars.com/api/?name=${storedUser.name}&background=B53C3C&color=fff&size=128`;

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  // Sync avatar from localStorage
  useEffect(() => {
    const latestUser = JSON.parse(localStorage.getItem("user"));
    if (latestUser?.avatar !== avatarPreview) {
      setAvatarPreview(latestUser?.avatar || "");
    }
  }, [avatarPreview]);

  return (
    <>
      <div className="bg-[#B53C3C] text-white flex items-center justify-between px-4 md:px-6 py-4 shadow select-none">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleGoToDashboard}
        >
          <img
            src="/assets/logo-tanggamus.png"
            alt="Logo"
            className="w-12 h-auto"
            draggable="false"
          />
          <h1 className="text-xs md:text-md lg:text-lg font-semibold leading-snug">
            E-REKON
            <br />
            <span className="block sm:inline">
              KABUPATEN<span className="sm:inline hidden">&nbsp;</span>
              <br className="sm:hidden" />
              TANGGAMUS
            </span>
          </h1>
        </div>

        <UserDropdown
          storedUser={storedUser}
          avatarSrc={avatarSrc}
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
          setIsDropdownOpen={setIsDropdownOpen}
          isDropdownOpen={isDropdownOpen}
          // Pass a function to UserDropdown to trigger image preview
          onAvatarClick={() => setShowImagePreview(true)}
        />
      </div>

      <ImagePreviewModal
        show={showImagePreview}
        src={avatarSrc}
        onClose={() => setShowImagePreview(false)}
      />
    </>
  );
};

export default Navbar;
