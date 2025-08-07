// src/pages/klasifikasi/klasifikasi-aset/kelompok/useKelompokForm.js
import { useState, useEffect, useMemo } from "react";
import { getAkunOptions } from "../../../../api/service/klasifikasiAsetService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useKelompokForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeKelompok: "",
    namaKelompok: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialAkun = useMemo(
    () => (initialData ? { value: initialData.akun_aset.id } : null),
    [initialData]
  );

  const akun = useHierarchySelector({
    fetcher: getAkunOptions,
    initialData: initialAkun,
  });

  const resetForm = () => {
    setFormState({ kodeKelompok: "", namaKelompok: "", kode: "" });
    akun.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeKelompok: initialData.kode_kelompok_aset || "",
          namaKelompok: initialData.nama_kelompok_aset || "",
          kode: initialData.kode || "",
        });
      } else {
        // Jika tidak ada initialData (mode Tambah), selalu reset form
        resetForm();
      }
    }
  }, [initialData, isOpen]);

  const isFormValid =
    akun.selectedValue &&
    formState.kodeKelompok.trim() &&
    formState.namaKelompok.trim() &&
    formState.kode.trim();

  const dataToSave = {
    akun_aset_id: akun.selectedValue?.value,
    kode_kelompok_aset: formState.kodeKelompok,
    nama_kelompok_aset: formState.namaKelompok,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    resetForm,
    akun,
    isFormValid,
    dataToSave,
  };
};
