import React, { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sistem!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B53C3C",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, isLoggedIn: false })
        );
        navigate("/");

        // Toast notification setelah logout
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logout berhasil",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleChangePhoto = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const handleDeletePhoto = () => {
    Swal.fire({
      title: "Hapus Foto Profil?",
      text: "Apakah Anda yakin ingin menghapus foto profil Anda?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setAvatarPreview("");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, avatar: null })
        );
        if (fileInputRef.current) fileInputRef.current.value = "";

        // Success notification
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Foto profil berhasil dihapus",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Format File Tidak Valid",
        text: "Silakan pilih file gambar yang valid.",
        confirmButtonColor: "#B53C3C",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Ukuran File Terlalu Besar",
        text: "Ukuran file harus kurang dari 5MB.",
        confirmButtonColor: "#B53C3C",
      });
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

      // Success notification
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Foto profil berhasil diubah",
        showConfirmButton: false,
        timer: 1500,
      });
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
                  className="cursor-pointer"
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
                    className="bg-red bg-opacity-20 border border-white border-opacity-30 text-white px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-opacity-30 hover:border-opacity-50"
                  >
                    Change Photo
                  </button>
                  {(avatarPreview || storedUser.avatar) && (
                    <button
                      onClick={handleDeletePhoto}
                      className="bg-red bg-opacity-20 border border-white border-opacity-30 text-white px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-opacity-30 hover:border-opacity-50"
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
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000]"
          onClick={() => setShowImagePreview(false)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={avatarSrc}
              alt="Profile Preview"
              className="w-full h-full object-contain max-w-[80vw] max-h-[80vh]"
            />
            <button
              className="absolute top-2.5 right-2.5 bg-black bg-opacity-50 text-white border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-lg transition-all duration-200 hover:bg-opacity-70"
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
