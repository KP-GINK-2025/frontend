// src/hooks/useHierarchySelector.js
import { useState, useEffect, useRef, useCallback } from "react";

export const useHierarchySelector = ({ fetcher, parentId, initialData }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialDataSet = useRef(false);

  // Mengambil data atau membersihkan state jika parentId tidak ada
  const loadOptions = useCallback(async () => {
    const requiresParent = fetcher.length > 0;
    if (requiresParent && !parentId) {
      setOptions([]);
      setSelectedValue(null);
      return;
    }

    setIsLoading(true);
    try {
      const newOptions = await fetcher(parentId);
      setOptions(newOptions);
    } catch (error) {
      console.error("Gagal memuat options:", error);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [parentId, fetcher]);

  // Effect untuk memanggil loadOptions saat dependensi berubah
  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  // Effect untuk menangani pengisian data awal (mode Edit) atau reset (mode Add)
  useEffect(() => {
    if (!initialData) {
      isInitialDataSet.current = false;
      setSelectedValue(null);
    }

    if (initialData && options.length > 0 && !isInitialDataSet.current) {
      const foundOption = options.find(
        (opt) => opt.value === initialData.value
      );
      if (foundOption) {
        setSelectedValue(foundOption);
        isInitialDataSet.current = true;
      }
    }
  }, [initialData, options]);

  // Menangani interaksi langsung dari pengguna
  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    isInitialDataSet.current = true;
  };

  // Perintah reset eksplisit dari komponen induk
  const reset = () => {
    setSelectedValue(null);
    setOptions([]);
    isInitialDataSet.current = false;

    // Jika ini adalah komponen level atas, panggil ulang fetch data
    const requiresParent = fetcher.length > 0;
    if (!requiresParent) {
      loadOptions();
    }
  };

  return {
    options,
    selectedValue,
    isLoading,
    handleChange,
    reset,
  };
};
