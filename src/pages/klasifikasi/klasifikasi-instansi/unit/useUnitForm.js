// src/pages/klasifikasi/klasifikasi-instansi/unit/useUnitForm.js
import { useState, useEffect, useMemo } from "react";
import {
  getProvinsi,
  getKabupatenByProvinsi,
  getBidangByKabKot,
} from "../../../../api/klasifikasiInstansiService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";

export const useUnitForm = (initialData) => {
  const [formState, setFormState] = useState({
    kodeUnit: "",
    namaUnit: "",
    kode: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const initialProvinsi = useMemo(
    () =>
      initialData
        ? { value: initialData.bidang.kabupaten_kota.provinsi.id }
        : null,
    [initialData]
  );
  const initialKabupaten = useMemo(
    () =>
      initialData ? { value: initialData.bidang.kabupaten_kota.id } : null,
    [initialData]
  );
  const initialBidang = useMemo(
    () => (initialData ? { value: initialData.bidang.id } : null),
    [initialData]
  );

  const provinsi = useHierarchySelector({
    fetcher: getProvinsi,
    initialData: initialProvinsi,
  });
  const kabupaten = useHierarchySelector({
    fetcher: getKabupatenByProvinsi,
    parentId: provinsi.selectedValue?.value,
    initialData: initialKabupaten,
  });
  const bidang = useHierarchySelector({
    fetcher: getBidangByKabKot,
    parentId: kabupaten.selectedValue?.value,
    initialData: initialBidang,
  });

  const resetForm = () => {
    setFormState({ kodeUnit: "", namaUnit: "", kode: "" });
    provinsi.reset();
    kabupaten.reset();
    bidang.reset();
  };

  useEffect(() => {
    if (initialData) {
      setFormState({
        kodeUnit: initialData.kode_unit || "",
        namaUnit: initialData.nama_unit || "",
        kode: initialData.kode || "",
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const isFormValid =
    provinsi.selectedValue &&
    kabupaten.selectedValue &&
    bidang.selectedValue &&
    formState.kodeUnit.trim() &&
    formState.namaUnit.trim() &&
    formState.kode.trim();

  const dataToSave = {
    bidang_id: bidang.selectedValue?.value,
    kode_unit: formState.kodeUnit,
    nama_unit: formState.namaUnit,
    kode: formState.kode,
  };

  return {
    formState,
    handleInputChange,
    provinsi,
    kabupaten,
    bidang,
    isFormValid,
    dataToSave,
  };
};
