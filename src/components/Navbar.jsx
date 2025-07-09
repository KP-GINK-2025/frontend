import React from "react";
import { LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-[#b00020] text-white flex items-center justify-between px-6 py-3 shadow select-none">
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
        <h1 className="text-lg font-semibold">
          E-Rekon
          <br />
          Kabupaten Tanggamus
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <UserCircle size={35} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#b00020] text-white text-sm font-medium border-2 border-white rounded-full shadow-sm transition-all duration-200 hover:bg-white hover:text-[#b00020] hover:scale-[1.03] cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
