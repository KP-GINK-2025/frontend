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
    <div className="bg-[#b00020] text-white flex items-center justify-between px-6 py-3 shadow">
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
          className="flex items-center gap-1 text-sm hover:text-gray-400 transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
