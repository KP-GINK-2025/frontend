import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const UserDropdown = ({
  avatarSrc,
  avatarPreview,
  setAvatarPreview,
  setIsDropdownOpen,
  isDropdownOpen,
}) => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

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
        logout();

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
        // Buat objek user baru tanpa avatar
        const updatedUser = { ...user, avatar: null };
        // Panggil fungsi updateUser dari context
        updateUser(updatedUser);

        setAvatarPreview(""); // Update UI lokal jika perlu
        Swal.fire("Dihapus!", "Foto profil berhasil dihapus.", "success");
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

      // Buat objek user baru dengan avatar baru
      const updatedUser = { ...user, avatar: newAvatarUrl };
      // Panggil fungsi updateUser dari context
      updateUser(updatedUser);

      setAvatarPreview(newAvatarUrl); // Update UI lokal
      Swal.fire("Berhasil!", "Foto profil berhasil diubah.", "success");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-2 py-1 cursor-pointer"
      >
        <img
          src={avatarSrc}
          alt="User Avatar"
          className="w-9 h-9 rounded-full object-cover border-3 border-white"
        />
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 z-50 min-w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#B53C3C] flex flex-col items-center py-4 gap-2">
            <div className="cursor-pointer">
              <img
                src={avatarSrc}
                alt="User Avatar"
                className="w-20 h-20 rounded-full border-3 border-white object-cover"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleChangePhoto}
                className="bg-red bg-opacity-20 border border-white border-opacity-30 text-white px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-white hover:text-[#B53C3C] hover:border-[#B53C3C]"
              >
                Change Photo
              </button>
              {(avatarPreview || user.avatar) && (
                <button
                  onClick={handleDeletePhoto}
                  className="bg-red bg-opacity-20 border border-white border-opacity-30 text-white px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-white hover:text-[#B53C3C] hover:border-[#B53C3C]"
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UserDropdown;
