// src/pages/klasifikasi/klasifikasi-aset/akun/useAkunForm.js
import { useState, useEffect } from "react";

export const useAkunForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeAkun: "",
    namaAkun: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const resetForm = () => {
    setFormState({ kodeAkun: "", namaAkun: "", kode: "" });
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeAkun: initialData.kode_akun_aset || "",
          namaAkun: initialData.nama_akun_aset || "",
          kode: initialData.kode || "",
        });
      } else {
        // Jika tidak ada initialData (mode Tambah), selalu reset form
        resetForm();
      }
    }
  }, [initialData, isOpen]);

  const isFormValid =
    formState.kodeAkun.trim() &&
    formState.namaAkun.trim() &&
    formState.kode.trim();

  const dataToSave = {
    kode_akun_aset: formState.kodeAkun,
    nama_akun_aset: formState.namaAkun,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    resetForm,
    isFormValid,
    dataToSave,
  };
};
