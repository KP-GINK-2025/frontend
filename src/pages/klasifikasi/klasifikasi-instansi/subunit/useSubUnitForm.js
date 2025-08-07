// src/pages/klasifikasi/klasifikasi-instansi/unit/useSubUnitForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getProvinsiOptions,
  getKabupatenByProvinsi,
  getBidangByKabupaten,
  getUnitByBidang,
} from "../../../../api/service/klasifikasiInstansiService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useSubUnitForm = (initialData, isOpen) => {
  const [formState, setFormState] = useState({
    kodeSubUnit: "",
    namaSubUnit: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialProvinsi = useMemo(
    () =>
      initialData
        ? { value: initialData.unit.bidang.kabupaten_kota.provinsi.id }
        : null,
    [initialData]
  );
  const initialKabupaten = useMemo(
    () =>
      initialData ? { value: initialData.unit.bidang.kabupaten_kota.id } : null,
    [initialData]
  );
  const initialBidang = useMemo(
    () => (initialData ? { value: initialData.unit.bidang.id } : null),
    [initialData]
  );
  const initialUnit = useMemo(
    () => (initialData ? { value: initialData.unit.id } : null),
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

  const resetForm = () => {
    setFormState({ kodeSubUnit: "", namaSubUnit: "", kode: "" });
    provinsi.handleChange(null);
    kabupaten.handleChange(null);
    bidang.handleChange(null);
    unit.handleChange(null);
  };

  useEffect(() => {
    // Hanya jalankan jika modal terbuka
    if (isOpen) {
      if (initialData) {
        setFormState({
          kodeSubUnit: initialData.kode_sub_unit || "",
          namaSubUnit: initialData.nama_sub_unit || "",
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
    formState.kodeSubUnit.trim() &&
    formState.namaSubUnit.trim() &&
    formState.kode.trim();

  const dataToSave = {
    unit_id: unit.selectedValue?.value,
    kode_sub_unit: formState.kodeSubUnit,
    nama_sub_unit: formState.namaSubUnit,
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
    isFormValid,
    dataToSave,
  };
};
