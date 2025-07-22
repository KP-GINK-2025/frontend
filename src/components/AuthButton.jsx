import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthButton = ({ storedUser }) => {
  const navigate = useNavigate();

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

  return (
    <button
      onClick={handleLogout}
      className="flex-1 px-3 py-2 border border-[#B53C3C] text-[#B53C3C] rounded hover:bg-[#B53C3C] hover:text-white transition-all duration-200 text-sm cursor-pointer"
    >
      Logout
    </button>
  );
};

export default AuthButton;
