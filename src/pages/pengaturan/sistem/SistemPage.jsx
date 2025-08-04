import React, { useState, useEffect } from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { Check, X } from "lucide-react";
import Swal from "sweetalert2";

const SistemPage = () => {
  const [form, setForm] = useState({
    siteTitle: "",
    siteName: "",
    siteAddress: "",
    contentRight: "",
    metaKeywords: "",
    metaDescription: "",
    siteOffline: "",
    mulaiTahunAnggaran: "",
    trackFailedAttempts: "",
    maxFailedAttempts: "",
    failedAttemptsTime: "",
    sessionTimeout: "",
    allowConcurrentLogin: "",
    overrideSessionLogin: "",
    enableAuditTrail: "",
    enableRecordLocking: "",
    enableResetPassword: "",
    userMustChangePassword: "",
    enableChangePassword: "",
    passwordExpired: "",
    passwordExpiredReminder: "",
    countSaveOldPassword: "",
    emailProtocol: "",
    smtpServer: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    emailFrom: "",
    emailConfirmNewUser: "",
    emailChangePassword: "",
    emailInfoLogin: "",
    emailBlockUser: "",
    emailUnblockUser: "",
    emailForgotPassword: "",
    emailInfoNewUser: "",
  });

  useEffect(() => {
    const savedForm = localStorage.getItem("formSistemConfig");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const renderInput = (
    label,
    name,
    isSelect = false,
    options = [],
    suffix = ""
  ) => (
    <div className="grid grid-cols-12 items-center gap-2 mb-4">
      <label className="col-span-3 font-medium text-sm text-gray-700">
        {label}
      </label>
      <div className="col-span-1 text-right">:</div>
      <div className="col-span-8 flex items-center gap-2">
        {isSelect ? (
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">-- Pilih --</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={name === "sessionTimeout" ? "number" : "text"}
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        )}
        {suffix && <span className="text-sm text-gray-600">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans">
      <Navbar />
      <div className="px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumbs path={["Dashboard", "Pengaturan", "Sistem"]} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase">
            Edit Global Konfigurasi
          </h1>

          <div className="max-w-3xl mx-auto">
            {renderInput("Site Title", "siteTitle")}
            {renderInput("Site Name", "siteName")}
            {renderInput("Site Address", "siteAddress")}
            {renderInput("Content Right", "contentRight")}
            {renderInput("Meta Key Words", "metaKeywords")}
            {renderInput("Meta Description", "metaDescription")}
            {renderInput("Site Offline", "siteOffline")}
            {renderInput("Mulai Tahun Anggaran", "mulaiTahunAnggaran")}

            {renderInput("Track Failed Attempts", "trackFailedAttempts", true, [
              "Ya",
              "Tidak",
            ])}
            {renderInput("Maximum Failed Attempts", "maxFailedAttempts", true, [
              "1",
              "3",
              "5",
            ])}
            {renderInput("Failed Attempts Time", "failedAttemptsTime", true, [
              "5 Menit",
              "10 Menit",
              "15 Menit",
            ])}
            {renderInput(
              "Session Time Out",
              "sessionTimeout",
              false,
              [],
              "Menit"
            )}
            {renderInput(
              "Allow Concurrent Login",
              "allowConcurrentLogin",
              true,
              ["1 Session", "2 Session", "3 Session", "Unlimited"]
            )}
            {renderInput(
              "Override Session Login",
              "overrideSessionLogin",
              true,
              [
                "No",
                "Confirm Override Session Login",
                "Direct Override Session Login",
              ]
            )}
            {renderInput("Enable Audit Trail", "enableAuditTrail", true, [
              "Ya",
              "Tidak",
            ])}
            {renderInput("Enable Record Locking", "enableRecordLocking", true, [
              "Ya",
              "Tidak",
            ])}
            {renderInput("Enable Reset Password", "enableResetPassword", true, [
              "Ya",
              "Tidak",
            ])}
            {renderInput(
              "User Must Change Password",
              "userMustChangePassword",
              true,
              ["Ya", "Tidak"]
            )}
            {renderInput(
              "Enable Change Password",
              "enableChangePassword",
              true,
              ["Ya", "Tidak"]
            )}
            {renderInput("Password Expired", "passwordExpired", true, [
              "Ya",
              "Tidak",
            ])}
            {renderInput(
              "Password Expired Reminder",
              "passwordExpiredReminder",
              true,
              ["Ya", "Tidak"]
            )}
            {renderInput(
              "Count Save Old Password",
              "countSaveOldPassword",
              true,
              [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
              ]
            )}
            {renderInput("EMAIL Protocol", "emailProtocol", true, [
              "sendmail",
              "smtp",
            ])}
            {renderInput("SMTP Server", "smtpServer")}
            {renderInput("SMTP Port", "smtpPort")}
            {renderInput("SMTP User", "smtpUser")}
            {renderInput("SMTP Password", "smtpPassword")}
            {renderInput("Email From", "emailFrom")}

            {/* Email Confirm New User */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">
                Email Confirm New User
              </label>
              <textarea
                name="emailConfirmNewUser"
                value={form.emailConfirmNewUser || ""}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Isi template email untuk user baru..."
              />
            </div>

            {/* Email Change Password */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">
                Email Change Password
              </label>
              <textarea
                name="emailChangePassword"
                value={form.emailChangePassword || ""}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Isi template email untuk perubahan password..."
              />
            </div>

            {/* Email Info Login */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">
                Email Info Login
              </label>
              <textarea
                name="emailInfoLogin"
                value={form.emailInfoLogin || ""}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Isi template email untuk info login..."
              />
            </div>

            {/* Email Block User */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">
                Email Block User
              </label>
              <textarea
                name="emailBlockUser"
                value={form.emailBlockUser || ""}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Isi template email untuk blokir user..."
              />
            </div>

            {/* Email Unblock User */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">
                Email Unblock User
              </label>
              <textarea
                name="emailUnblockUser"
                value={form.emailUnblockUser || ""}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Isi template email untuk unblock user..."
              />
            </div>

            {/* Email Forget Password */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">
                Email Forget Password
              </label>
              <textarea
                name="emailForgetPassword"
                value={form.emailForgetPassword || ""}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Isi template email untuk lupa password..."
              />
            </div>

            {/* Email Info New User */}
            <div className="mb-4">
              <label className="block font-medium text-sm text-gray-700 mb-2">
                Email Info New User
              </label>
              <textarea
                name="emailInfoNewUser"
                value={form.emailInfoNewUser || ""}
                onChange={handleChange}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Isi template email untuk info user baru..."
              />
            </div>

            {/* Tombol Simpan & Batal */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  localStorage.setItem(
                    "formSistemConfig",
                    JSON.stringify(form)
                  );
                  Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Perubahan konfigurasi berhasil disimpan.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                  });
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <Check size={16} className="text-white" />
                Simpan
              </button>

              <button
                onClick={() => {
                  const savedForm = localStorage.getItem("formSistemConfig");
                  if (savedForm) {
                    setForm(JSON.parse(savedForm));
                  } else {
                    setForm({ ...defaultForm });
                  }
                  Swal.fire({
                    icon: "info",
                    title: "Dibatalkan",
                    text: "Perubahan konfigurasi dibatalkan.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                  });
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <X size={16} className="text-white" />
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SistemPage;
