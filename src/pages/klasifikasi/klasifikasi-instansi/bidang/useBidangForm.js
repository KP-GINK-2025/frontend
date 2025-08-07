// src/pages/klasifikasi/klasifikasi-instansi/bidang/useBidangForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getProvinsiOptions,
  getKabupatenByProvinsi,
} from "../../../../api/service/klasifikasiInstansiService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useBidangForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeBidang: "",
    namaBidang: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialProvinsi = useMemo(
    () =>
      initialData ? { value: initialData.kabupaten_kota.provinsi.id } : null,
    [initialData]
  );
  const initialKabupaten = useMemo(
    () => (initialData ? { value: initialData.kabupaten_kota.id } : null),
    [initialData]
  );

  const provinsi = useHierarchySelector({
    fetcher: getProvinsiOptions,
    initialData: initialProvinsi,
  });
  const kabupaten = useHierarchySelector({
    fetcher: getKabupatenByProvinsi,
    parentId: provinsi.selectedValue?.value,
    initialData: initialKabupaten,
  });

  const resetForm = () => {
    setFormState({ kodeBidang: "", namaBidang: "", kode: "" });
    provinsi.handleChange(null);
    kabupaten.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeBidang: initialData.kode_bidang || "",
          namaBidang: initialData.nama_bidang || "",
          kode: initialData.kode || "",
        });
      } else {
        // Jika tidak ada initialData (mode Tambah), selalu reset form
        resetForm();
      }
    }
  }, [initialData, isOpen]);

  const isFormValid =
    provinsi.selectedValue &&
    kabupaten.selectedValue &&
    formState.kodeBidang.trim() &&
    formState.namaBidang.trim() &&
    formState.kode.trim();

  const dataToSave = {
    kabupaten_kota_id: kabupaten.selectedValue?.value,
    kode_bidang: formState.kodeBidang,
    nama_bidang: formState.namaBidang,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    resetForm,
    provinsi,
    kabupaten,
    isFormValid,
    dataToSave,
  };
};
