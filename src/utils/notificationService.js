// src/utils/notificationService.js
import Swal from "sweetalert2";

/* ========================== */
/* KONFIGURASI UMUM           */
/* ========================== */
// Konfigurasi umum untuk toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// Konfigurasi umum untuk alert dengan tombol custom
const customButtonAlert = Swal.mixin({
  buttonsStyling: false,
  customClass: {
    actions: "gap-2",
    confirmButton:
      "bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none cursor-pointer",
    cancelButton:
      "bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none mr-2 cursor-pointer",
    popup: "rounded-lg shadow-lg",
  },
});
/* ========================== */
/* KONFIGURASI UMUM           */
/* ========================== */

/**
 * Menampilkan notifikasi toast sukses.
 * @param {string} title - Pesan yang akan ditampilkan.
 */
export const showSuccessToast = (title = "Operasi berhasil") => {
  Toast.fire({
    icon: "success",
    title: title,
  });
};

/**
 * Menampilkan notifikasi toast error.
 * @param {string} title - Pesan yang akan ditampilkan.
 */
export const showErrorToast = (title = "Terjadi kesalahan") => {
  Toast.fire({
    icon: "error",
    title: title,
  });
};

/**
 * Menampilkan alert error dengan tombol custom.
 * @param {string} text - Pesan error yang detail.
 * @param {string} title - Judul alert.
 */
export const showErrorAlert = (text, title = "Gagal") => {
  customButtonAlert.fire({
    icon: "error",
    title: title,
    text: text,
  });
};

/**
 * Menampilkan dialog konfirmasi.
 * @returns {Promise<boolean>} - Resolves true jika user menekan konfirmasi, false jika tidak.
 */
export const showConfirmationDialog = async ({
  title = "Anda yakin?",
  text = "Tindakan ini tidak dapat diurungkan",
  confirmButtonText = "Ya, lanjutkan",
} = {}) => {
  const result = await customButtonAlert.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
};

/**
 * Menampilkan alert info dengan tombol custom.
 * @param {string} text - Pesan info yang detail.
 * @param {string} title - Judul alert.
 */
export const showInfoAlert = (text, title = "Informasi") => {
  customButtonAlert.fire({
    icon: "info",
    title: title,
    text: text,
  });
};
