import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Swal from "sweetalert2";

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
    position: storedUser.position || "",
    active: storedUser.active ?? 1,
    roles: storedUser.roles?.map((role) => role.name) || [],
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error as user types
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Valid",
        text: "Silakan lengkapi semua field yang wajib diisi dengan benar.",
        confirmButtonColor: "#B53C3C",
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi Perubahan",
      text: "Apakah Anda yakin ingin memperbarui profil?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B53C3C",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Perbarui",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;

        api
          .put(`/users/${userId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const updatedUser = res.data.data || res.data;

            localStorage.setItem("user", JSON.stringify(updatedUser));

            Swal.fire({
              position: "center",
              icon: "success",
              title: "Profil berhasil diperbarui!",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate(-1);
            });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              title: "Gagal Memperbarui",
              text:
                err.response?.data?.message ||
                "Terjadi kesalahan saat menyimpan data.",
              confirmButtonColor: "#B53C3C",
            });
          });
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 border rounded shadow bg-white">
      <div className="bg-[#B53C3C] text-white px-4 py-2 font-semibold rounded-t">
        Edit Profil
      </div>

      <div className="p-4 space-y-4">
        {/* Nama Lengkap */}
        <div className="grid grid-cols-[160px_10px_1fr] items-start gap-2">
          <label className="text-sm font-medium">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <span>:</span>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-3 py-1 w-full text-sm"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="grid grid-cols-[160px_10px_1fr] items-start gap-2">
          <label className="text-sm font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <span>:</span>
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border rounded px-3 py-1 w-full text-sm"
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="grid grid-cols-[160px_10px_1fr] items-start gap-2">
          <label className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <span>:</span>
          <div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-3 py-1 w-full text-sm"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
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
