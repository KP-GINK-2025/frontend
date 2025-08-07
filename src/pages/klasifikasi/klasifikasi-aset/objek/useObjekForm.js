// src/pages/klasifikasi/klasifikasi-aset/objek/useObjekForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getAkunOptions,
  getKelompokByAkun,
  getJenisByKelompok,
} from "../../../../api/service/klasifikasiAsetService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useObjekForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeObjek: "",
    namaObjek: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialAkun = useMemo(
    () =>
      initialData
        ? { value: initialData.jenis_aset.kelompok_aset.akun_aset.id }
        : null,
    [initialData]
  );
  const initialKelompok = useMemo(
    () =>
      initialData ? { value: initialData.jenis_aset.kelompok_aset.id } : null,
    [initialData]
  );
  const initialJenis = useMemo(
    () => (initialData ? { value: initialData.jenis_aset.id } : null),
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
  const jenis = useHierarchySelector({
    fetcher: getJenisByKelompok,
    initialData: initialJenis,
    parentId: kelompok.selectedValue?.value,
  });

  const resetForm = () => {
    setFormState({ kodeObjek: "", namaObjek: "", kode: "" });
    akun.handleChange(null);
    kelompok.handleChange(null);
    jenis.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeObjek: initialData.kode_objek_aset || "",
          namaObjek: initialData.nama_objek_aset || "",
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
    jenis.selectedValue &&
    formState.kodeObjek.trim() &&
    formState.namaObjek.trim() &&
    formState.kode.trim();

  const dataToSave = {
    jenis_aset_id: jenis.selectedValue?.value,
    kode_objek_aset: formState.kodeObjek,
    nama_objek_aset: formState.namaObjek,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    resetForm,
    akun,
    kelompok,
    jenis,
    isFormValid,
    dataToSave,
  };
};
