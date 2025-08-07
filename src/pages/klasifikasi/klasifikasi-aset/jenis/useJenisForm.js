// src/pages/klasifikasi/klasifikasi-aset/jenis/useJenisForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getAkunOptions,
  getKelompokByAkun,
} from "../../../../api/service/klasifikasiAsetService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useJenisForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeJenis: "",
    namaJenis: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialAkun = useMemo(
    () =>
      initialData ? { value: initialData.kelompok_aset.akun_aset.id } : null,
    [initialData]
  );
  const initialKelompok = useMemo(
    () => (initialData ? { value: initialData.kelompok_aset.id } : null),
    [initialData]
  );

  const akun = useHierarchySelector({
    fetcher: getAkunOptions,
    initialData: initialAkun,
  });
  const kelompok = useHierarchySelector({
    fetcher: getKelompokByAkun,
    initialData: initialKelompok,
    parentId: akun.selectedValue?.value,
  });

  const resetForm = () => {
    setFormState({ kodeJenis: "", namaJenis: "", kode: "" });
    akun.handleChange(null);
    kelompok.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeJenis: initialData.kode_jenis_aset || "",
          namaJenis: initialData.nama_jenis_aset || "",
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
    kelompok.selectedValue &&
    formState.kodeJenis.trim() &&
    formState.namaJenis.trim() &&
    formState.kode.trim();

  const dataToSave = {
    kelompok_aset_id: kelompok.selectedValue?.value,
    kode_jenis_aset: formState.kodeJenis,
    nama_jenis_aset: formState.namaJenis,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    resetForm,
    akun,
    kelompok,
    isFormValid,
    dataToSave,
  };
};
