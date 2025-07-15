import React, { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest",
    avatar: null,
  };

  const avatarSrc =
    avatarPreview ||
    storedUser.avatar ||
    `https://ui-avatars.com/api/?name=${storedUser.name}&background=B53C3C&color=fff&size=128`;

  const handleLogout = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ ...storedUser, isLoggedIn: false })
    );
    navigate("/");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleChangePhoto = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const handleDeletePhoto = () => {
    if (window.confirm("Are you sure you want to delete your profile photo?")) {
      setAvatarPreview("");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, avatar: null })
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newAvatarUrl = e.target.result;
      setAvatarPreview(newAvatarUrl);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, avatar: newAvatarUrl })
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync avatar from localStorage
  useEffect(() => {
    const latestUser = JSON.parse(localStorage.getItem("user"));
    if (latestUser?.avatar !== avatarPreview) {
      setAvatarPreview(latestUser?.avatar || "");
    }
  }, [avatarPreview]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <style jsx>{`
        .avatar-container {
          cursor: pointer;
        }
        .photo-action-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .photo-action-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .photo-action-btn.delete {
          background: rgba(220, 38, 38, 0.2);
          border-color: rgba(220, 38, 38, 0.3);
        }
        .photo-action-btn.delete:hover {
          background: rgba(220, 38, 38, 0.3);
          border-color: rgba(220, 38, 38, 0.5);
        }
        .image-preview-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .image-preview-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }
        .image-preview-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          max-width: 80vw;
          max-height: 80vh;
        }
        .image-preview-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s ease;
        }
        .image-preview-close:hover {
          background: rgba(0, 0, 0, 0.7);
        }
      `}</style>

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
          <h1 className="text-xs md:text-md lg:text-lg font-semibold">
            E-REKON
            <br />
            KABUPATEN TANGGAMUS
          </h1>
        </div>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 cursor-pointer"
          >
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border-3 border-white"
            />
            <span className="text-sm font-medium">{storedUser.name}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 z-50 min-w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-[#B53C3C] flex flex-col items-center py-4 gap-2">
                <div
                  className="avatar-container"
                  onClick={() => setShowImagePreview(true)}
                >
                  <img
                    src={avatarSrc}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full border-3 border-white object-cover"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleChangePhoto}
                    className="photo-action-btn"
                  >
                    Change Photo
                  </button>
                  {(avatarPreview || storedUser.avatar) && (
                    <button
                      onClick={handleDeletePhoto}
                      className="photo-action-btn"
                    >
                      Delete Photo
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between px-4 py-3 bg-white border-t border-[#B53C3C] gap-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="flex-1 px-3 py-2 border border-[#B53C3C] text-[#B53C3C] rounded hover:bg-[#B53C3C] hover:text-white transition-all duration-200 text-sm cursor-pointer"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-3 py-2 border border-[#B53C3C] text-[#B53C3C] rounded hover:bg-[#B53C3C] hover:text-white transition-all duration-200 text-sm cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showImagePreview && (
        <div
          className="image-preview-overlay"
          onClick={() => setShowImagePreview(false)}
        >
          <div
            className="image-preview-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={avatarSrc}
              alt="Profile Preview"
              className="image-preview-img"
            />
            <button
              className="image-preview-close"
              onClick={() => setShowImagePreview(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
