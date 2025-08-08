// src/pages/LoginPage.jsx (Versi Clean & Aman)
import React, { useState, useRef, useEffect } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("savedUsername", username);
    } else {
      localStorage.removeItem("savedUsername");
    }
  }, [rememberMe, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");

    let isValid = true;
    if (!username.trim()) {
      setUsernameError("Username tidak boleh kosong.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password tidak boleh kosong.");
      isValid = false;
    }
    if (!isValid) return;

    try {
      const response = await api.post("/login", { username, password });
      const { access_token, user } = response.data;

      login(access_token, user);

      Swal.fire({
        icon: "success",
        title: response.data.message || "Login berhasil!", // Ambil pesan dari API
        showConfirmButton: false,
        timer: 1200,
      });
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = "Terjadi kesalahan pada server.";

      if (error.response?.status === 401) {
        errorMessage = errorData?.message || "Username atau password salah.";
      } else if (errorData?.errors) {
        errorMessage = Object.values(errorData.errors).flat().join("\n");
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: errorMessage,
        confirmButtonColor: "#B53C3C",
      });
    }
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      usernameInputRef.current?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="select-none min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-[#B53C3C] flex flex-col items-center justify-center text-white px-6 py-6 md:px-0 md:py-0">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center leading-tight">
            E-REKON
          </h1>
          <div className="flex items-center justify-center mt-4 mb-4 md:mt-6 md:mb-6">
            <img
              src="/assets/logo-tanggamus.png"
              alt="Logo Kabupaten Tanggamus"
              className="w-32 md:w-48 h-auto"
              draggable="false"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center leading-tight">
            KABUPATEN
            <br />
            TANGGAMUS
          </h1>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-grow items-center justify-center relative overflow-hidden px-4 py-6 md:px-0 md:py-0">
        <div className="absolute inset-0">
          <img
            src="/assets/gedung-tanggamus.png"
            alt="Gedung Kabupaten Tanggamus"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-gray-200/70"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm z-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={28} className="text-gray-600" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#B53C3C] text-center mb-6 sm:mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                ref={passwordInputRef}
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  passwordError ? "border-[#B53C3C]" : "border-gray-300"
                }`}
              />
              <div
                className="absolute right-3 top-3.5 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility on click
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-400" />
                ) : (
                  <Eye size={20} className="text-gray-400" />
                )}
              </div>
              {passwordError && (
                <p className="text-sm text-[#B53C3C] mt-1">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Ingat saya
              </label>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#B53C3C] text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 shadow-lg cursor-pointer"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4 sm:mt-6">
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
