// src/pages/klasifikasi/klasifikasi-aset/rincian-objek/useRincianObjekForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getAkunOptions,
  getKelompokByAkun,
  getJenisByKelompok,
  getObjekByJenis,
} from "../../../../api/service/klasifikasiAsetService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useRincianObjekForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeRincianObjek: "",
    namaRincianObjek: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialAkun = useMemo(
    () =>
      initialData
        ? {
            value: initialData.objek_aset.jenis_aset.kelompok_aset.akun_aset.id,
          }
        : null,
    [initialData]
  );
  const initialKelompok = useMemo(
    () =>
      initialData
        ? { value: initialData.objek_aset.jenis_aset.kelompok_aset.id }
        : null,
    [initialData]
  );
  const initialJenis = useMemo(
    () =>
      initialData ? { value: initialData.objek_aset.jenis_aset.id } : null,
    [initialData]
  );
  const initialObjek = useMemo(
    () => (initialData ? { value: initialData.objek_aset.id } : null),
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
  const objek = useHierarchySelector({
    fetcher: getObjekByJenis,
    initialData: initialObjek,
    parentId: jenis.selectedValue?.value,
  });

  const resetForm = () => {
    setFormState({ kodeRincianObjek: "", namaRincianObjek: "", kode: "" });
    akun.handleChange(null);
    kelompok.handleChange(null);
    jenis.handleChange(null);
    objek.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeRincianObjek: initialData.kode_rincian_objek_aset || "",
          namaRincianObjek: initialData.nama_rincian_objek_aset || "",
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
    objek.selectedValue &&
    formState.kodeRincianObjek.trim() &&
    formState.namaRincianObjek.trim() &&
    formState.kode.trim();

  const dataToSave = {
    objek_aset_id: objek.selectedValue?.value,
    kode_rincian_objek_aset: formState.kodeRincianObjek,
    nama_rincian_objek_aset: formState.namaRincianObjek,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    resetForm,
    akun,
    kelompok,
    jenis,
    objek,
    isFormValid,
    dataToSave,
  };
};
