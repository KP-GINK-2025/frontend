import React, { useState, useRef } from "react";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordInputRef = useRef(null);
  const usernameInputRef = useRef(null); // Tambahkan ref untuk input username

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");

    let valid = true;
    if (!username) {
      setUsernameError("Username tidak boleh kosong.");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password tidak boleh kosong.");
      valid = false;
    }
    if (!valid) return;

    console.log("Login attempt:", { username, password });
    navigate("/dashboard");
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (usernameInputRef.current) {
        usernameInputRef.current.focus();
      }
    }
  };

  return (
    <div className="select-none min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-[#B53C3C] flex flex-col items-center justify-center text-white">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/assets/logo-tanggamus.png"
              alt="Logo Kabupaten Tanggamus"
              className="w-48 h-auto"
              draggable="false"
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center leading-tight">
          Kabupaten
          <br />
          Tanggamus
        </h1>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center relative">
        <div className="absolute inset-0">
          <img
            src="/assets/gedung-tanggamus.png"
            alt="Gedung Kabupaten Tanggamus"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-gray-200/70"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#B53C3C] text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <div className="absolute left-3 top-3.5">
                <User size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleUsernameKeyDown}
                ref={usernameInputRef}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B53C3C] focus:border-transparent ${
                  usernameError ? "border-[#B53C3C]" : "border-gray-300"
                }`}
              />
              {usernameError && (
                <p className="text-sm text-[#B53C3C] mt-1">{usernameError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-3 top-3.5">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                ref={passwordInputRef}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B53C3C] focus:border-transparent ${
                  passwordError ? "border-[#B53C3C]" : "border-gray-300"
                }`}
              />
              {passwordError && (
                <p className="text-sm text-[#B53C3C] mt-1">{passwordError}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#B53C3C] text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 shadow-lg cursor-pointer"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="#" className="text-[#B53C3C] hover:text-red-700 text-sm">
              Lupa Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
