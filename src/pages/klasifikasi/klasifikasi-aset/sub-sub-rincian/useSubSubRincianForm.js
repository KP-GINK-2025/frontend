// src/pages/klasifikasi/klasifikasi-aset/sub-sub-rincian/useSubSubRincianForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getAkunOptions,
  getKelompokByAkun,
  getJenisByKelompok,
  getObjekByJenis,
  getRincianObjekByObjek,
  getSubRincianByRincianObjek,
} from "../../../../api/service/klasifikasiAsetService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useSubSubRincianForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeSubSubRincian: "",
    namaSubSubRincian: "",
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
            value:
              initialData.sub_rincian_aset.rincian_objek_aset.objek_aset
                .jenis_aset.kelompok_aset.akun_aset.id,
          }
        : null,
    [initialData]
  );
  const initialKelompok = useMemo(
    () =>
      initialData
        ? {
            value:
              initialData.sub_rincian_aset.rincian_objek_aset.objek_aset
                .jenis_aset.kelompok_aset.id,
          }
        : null,
    [initialData]
  );
  const initialJenis = useMemo(
    () =>
      initialData
        ? {
            value:
              initialData.sub_rincian_aset.rincian_objek_aset.objek_aset
                .jenis_aset.id,
          }
        : null,
    [initialData]
  );
  const initialObjek = useMemo(
    () =>
      initialData
        ? {
            value:
              initialData.sub_rincian_aset.rincian_objek_aset.objek_aset.id,
          }
        : null,
    [initialData]
  );
  const initialRincianObjek = useMemo(
    () =>
      initialData
        ? { value: initialData.sub_rincian_aset.rincian_objek_aset.id }
        : null,
    [initialData]
  );
  const initialSubRincian = useMemo(
    () => (initialData ? { value: initialData.sub_rincian_aset.id } : null),
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
  const rincianObjek = useHierarchySelector({
    fetcher: getRincianObjekByObjek,
    initialData: initialRincianObjek,
    parentId: objek.selectedValue?.value,
  });
  const subRincian = useHierarchySelector({
    fetcher: getSubRincianByRincianObjek,
    initialData: initialSubRincian,
    parentId: rincianObjek.selectedValue?.value,
  });

  const resetForm = () => {
    setFormState({ kodeSubSubRincian: "", namaSubSubRincian: "", kode: "" });
    akun.handleChange(null);
    kelompok.handleChange(null);
    jenis.handleChange(null);
    objek.handleChange(null);
    rincianObjek.handleChange(null);
    subRincian.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeSubSubRincian: initialData.kode_sub_sub_rincian_aset || "",
          namaSubSubRincian: initialData.nama_sub_sub_rincian_aset || "",
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
    rincianObjek.selectedValue &&
    subRincian.selectedValue &&
    formState.kodeSubSubRincian.trim() &&
    formState.namaSubSubRincian.trim() &&
    formState.kode.trim();

  const dataToSave = {
    sub_rincian_aset_id: subRincian.selectedValue?.value,
    kode_sub_sub_rincian_aset: formState.kodeSubSubRincian,
    nama_sub_sub_rincian_aset: formState.namaSubSubRincian,
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
    rincianObjek,
    subRincian,
    isFormValid,
    dataToSave,
  };
};
