import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    username: "",
    email: "",
  };

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    username: storedUser.username || "",
    email: storedUser.email || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUpdate = () => {
    let hasError = false;
    const newErrors = {
      name: "",
      username: "",
      email: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi.";
      hasError = true;
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username wajib diisi.";
      hasError = true;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // Ambil avatar lama
    const oldUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = {
      ...oldUser, // Ambil avatar dan lainnya
      ...formData, // Timpa dengan data baru (name, username, email)
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profil berhasil diperbarui!");
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  return (
    <div className="max-w-xl mx-auto mt-10 border rounded shadow bg-white">
      <div className="bg-[#B53C3C] text-white px-4 py-2 font-semibold rounded-t">
        Edit Profil
      </div>

      <div className="p-4 space-y-4">
        {/* Nama Lengkap */}
        <div>
          <div className="flex items-center">
            <label className="w-40 text-sm font-medium">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <span className="mr-2">:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-3 py-1 w-full text-sm"
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1 ml-[165px]">
              {errors.name}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <div className="flex items-center">
            <label className="w-40 text-sm font-medium">
              Username <span className="text-red-500">*</span>
            </label>
            <span className="mr-2">:</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded px-3 py-1 w-full text-sm"
            />
          </div>
          {errors.username && (
            <p className="text-red-600 text-sm mt-1 ml-[165px]">
              {errors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center">
            <label className="w-40 text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <span className="mr-2">:</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-3 py-1 w-full text-sm"
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1 ml-[165px]">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-100 px-4 py-3 flex justify-center">
        <button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer"
        >
          <Check size={16} />
          Perbaharui
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
