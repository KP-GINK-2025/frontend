import React, { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const fileInputRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest",
    avatar: null,
  };

  const [avatarPreview, setAvatarPreview] = useState(storedUser.avatar || "");

  const avatarSrc =
    avatarPreview ||
    `https://ui-avatars.com/api/?name=${
      storedUser.name || "Guest"
    }&background=B53C3C&color=fff&size=128`;

  const handleLogout = () => {
    const updatedUser = { ...storedUser, isLoggedIn: false };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/");
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      // Validasi ukuran file (maksimal 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatarUrl = e.target.result;
        setAvatarPreview(newAvatarUrl);

        // Update localStorage
        const updatedUser = { ...storedUser, avatar: newAvatarUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const latestUser = JSON.parse(localStorage.getItem("user"));
      if (latestUser?.avatar !== avatarPreview) {
        setAvatarPreview(latestUser?.avatar || "");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Effect untuk menyesuaikan posisi dropdown
  useEffect(() => {
    if (isDropdownOpen && dropdownContentRef.current) {
      const dropdownRect = dropdownContentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Reset transform terlebih dahulu
      dropdownContentRef.current.style.transform = "translateY(0)";
      dropdownContentRef.current.style.right = "0";

      // Dapatkan posisi baru setelah reset
      const newRect = dropdownContentRef.current.getBoundingClientRect();

      // Cek jika dropdown melebihi batas kanan viewport
      if (newRect.right > viewportWidth) {
        const overflowRight = newRect.right - viewportWidth + 10;
        dropdownContentRef.current.style.right = `${overflowRight}px`;
      }

      // Cek jika dropdown melebihi batas bawah viewport
      if (newRect.bottom > viewportHeight) {
        const overflowBottom = newRect.bottom - viewportHeight + 10;
        dropdownContentRef.current.style.transform = `translateY(-${overflowBottom}px)`;
      }
    }
  }, [isDropdownOpen, avatarPreview, storedUser.name]);

  return (
    <>
      {/* Input file tersembunyi untuk upload foto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Tambahkan style untuk memastikan navbar tidak overflow */}
      <style jsx>{`
        .navbar-container {
          position: relative;
          overflow: visible;
        }

        .dropdown-container {
          position: relative;
          overflow: visible;
        }

        .dropdown-content {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 9999;
          min-width: 16rem;
          max-width: 20rem;
          width: max-content;
        }

        /* Pastikan body tidak memiliki overflow hidden */
        body {
          overflow-x: auto;
        }

        .avatar-container {
          position: relative;
          display: inline-block;
        }

        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          cursor: pointer;
        }

        .avatar-container:hover .avatar-overlay {
          opacity: 1;
        }

        .avatar-overlay-text {
          color: white;
          font-size: 10px;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
        }
      `}</style>

      <div className="navbar-container bg-[#B53C3C] text-white flex items-center justify-between px-6 py-3 shadow relative z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src="/assets/logo-tanggamus.png"
            alt="Logo"
            className="w-12 h-auto"
            draggable="false"
          />
          <h1 className="text-lg font-semibold">
            E-Rekon
            <br />
            Kabupaten Tanggamus
          </h1>
        </div>

        <div
          className="dropdown-container flex items-center gap-4 relative"
          ref={dropdownRef}
        >
          <button
            onClick={handleToggleDropdown}
            className="flex items-center gap-2 px-2 py-1"
          >
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border border-white"
            />
            <span className="text-sm font-medium">{storedUser.name}</span>
          </button>

          {isDropdownOpen && (
            <div
              className="dropdown-content bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
              ref={dropdownContentRef}
            >
              {/* Bagian atas dropdown */}
              <div className="bg-[#B53C3C] flex flex-col items-center py-4 gap-2">
                <div className="avatar-container">
                  <img
                    src={avatarSrc}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white object-cover"
                  />
                  <div className="avatar-overlay" onClick={handleChangePhoto}>
                    <span className="avatar-overlay-text">
                      Change
                      <br />
                      Photo
                    </span>
                  </div>
                </div>

                <p className="text-white text-sm font-medium">
                  {storedUser.name}
                </p>
              </div>

              {/* Tombol aksi */}
              <div className="flex justify-between px-4 py-3 bg-white border-t border-[#B53C3C] gap-2">
                <button
                  onClick={handleProfile}
                  className="flex-1 px-3 py-2 border border-[#B53C3C] text-[#B53C3C] rounded hover:bg-[#B53C3C] hover:text-white transition-all duration-200 cursor-pointer text-sm"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-3 py-2 border border-[#B53C3C] text-[#B53C3C] rounded hover:bg-[#B53C3C] hover:text-white transition-all duration-200 cursor-pointer text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
