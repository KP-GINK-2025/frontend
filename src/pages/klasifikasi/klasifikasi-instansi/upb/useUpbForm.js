// src/pages/klasifikasi/klasifikasi-instansi/unit/useUpbForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getProvinsiOptions,
  getKabupatenByProvinsi,
  getBidangByKabupaten,
  getUnitByBidang,
  getSubUnitByUnit,
} from "../../../../api/service/klasifikasiInstansiService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useUpbForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeUpb: "",
    namaUpb: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialProvinsi = useMemo(
    () =>
      initialData
        ? { value: initialData.sub_unit.unit.bidang.kabupaten_kota.provinsi.id }
        : null,
    [initialData]
  );
  const initialKabupaten = useMemo(
    () =>
      initialData
        ? { value: initialData.sub_unit.unit.bidang.kabupaten_kota.id }
        : null,
    [initialData]
  );
  const initialBidang = useMemo(
    () => (initialData ? { value: initialData.sub_unit.unit.bidang.id } : null),
    [initialData]
  );
  const initialUnit = useMemo(
    () => (initialData ? { value: initialData.sub_unit.unit.id } : null),
    [initialData]
  );
  const initialSubUnit = useMemo(
    () => (initialData ? { value: initialData.sub_unit.id } : null),
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
  const bidang = useHierarchySelector({
    fetcher: getBidangByKabupaten,
    parentId: kabupaten.selectedValue?.value,
    initialData: initialBidang,
  });
  const unit = useHierarchySelector({
    fetcher: getUnitByBidang,
    parentId: bidang.selectedValue?.value,
    initialData: initialUnit,
  });
  const subUnit = useHierarchySelector({
    fetcher: getSubUnitByUnit,
    parentId: unit.selectedValue?.value,
    initialData: initialSubUnit,
  });

  const resetForm = () => {
    setFormState({ kodeUpb: "", namaUpb: "", kode: "" });
    provinsi.handleChange(null);
    kabupaten.handleChange(null);
    bidang.handleChange(null);
    unit.handleChange(null);
    subUnit.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeUpb: initialData.kode_upb || "",
          namaUpb: initialData.nama_upb || "",
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
    bidang.selectedValue &&
    unit.selectedValue &&
    subUnit.selectedValue &&
    formState.kodeUpb.trim() &&
    formState.namaUpb.trim() &&
    formState.kode.trim();

  const dataToSave = {
    sub_unit_id: subUnit.selectedValue?.value,
    kode_upb: formState.kodeUpb,
    nama_upb: formState.namaUpb,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    resetForm,
    provinsi,
    kabupaten,
    bidang,
    unit,
    subUnit,
    isFormValid,
    dataToSave,
  };
};
