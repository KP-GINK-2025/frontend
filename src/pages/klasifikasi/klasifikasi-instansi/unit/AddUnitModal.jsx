import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import Buttons from "../../../../components/Buttons";
import {
  getProvinsi,
  getKabupatenByProvinsi,
  getBidangByKabKot,
} from "../../../../api/klasifikasiInstansiService";
import { useHierarchySelector } from "../../../../hooks/useHierarchySelector";
import SelectForm from "../../../../components/form/SelectForm";
import InputForm from "../../../../components/form/InputForm";

const AddUnitModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [kodeUnit, setKodeUnit] = useState("");
  const [namaUnit, setNamaUnit] = useState("");
  const [kode, setKode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Mode Edit
        setKodeUnit(initialData.kode_unit || "");
        setNamaUnit(initialData.nama_unit || "");
        setKode(initialData.kode || "");
      } else {
        // Mode Add
        setKodeUnit("");
        setNamaUnit("");
        setKode("");
        provinsi.reset();
        kabupaten.reset();
        bidang.reset();
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !provinsi.selectedValue ||
      !kabupaten.selectedValue ||
      !bidang.selectedValue ||
      !kodeUnit.trim() ||
      !namaUnit.trim() ||
      !kode.trim()
    ) {
      Swal.fire({ text: "Harap lengkapi semua field wajib (*)", icon: "info" });
      return;
    }

    const dataToSave = {
      bidang_id: bidang.selectedValue.value,
      kode_unit: kodeUnit,
      nama_unit: namaUnit,
      kode,
    };

    setIsSaving(true);
    await onSave(
      initialData ? { ...dataToSave, id: initialData.id } : dataToSave
    );
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-lg"
          >
            {/* --- Modal Content Mulai dari sini --- */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {initialData ? "EDIT UNIT" : "TAMBAH UNIT"}
              </h2>
              <button
                onClick={onClose}
                disabled={isSaving}
                className={`text-2xl cursor-pointer ${
                  isSaving
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-red-700"
                }`}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100vh-220px)] overflow-y-auto pr-2 pb-4"
            >
              {/* --- Isi Form --- */}
              <SelectForm
                formTitle="Provinsi"
                id="provinsi"
                options={provinsi.options}
                value={provinsi.selectedValue}
                onChange={provinsi.handleChange}
                isLoading={provinsi.isLoading}
                placeholder="Pilih provinsi..."
                isDisabled={isSaving}
              />
              <SelectForm
                formTitle="Kabupaten/Kota"
                id="kabKot"
                options={kabupaten.options}
                value={kabupaten.selectedValue}
                onChange={kabupaten.handleChange}
                isLoading={kabupaten.isLoading}
                placeholder={
                  provinsi.selectedValue
                    ? "Pilih kabupaten/kota..."
                    : "Pilih provinsi dahulu"
                }
                isDisabled={!provinsi.selectedValue || isSaving}
              />
              <SelectForm
                formTitle="Bidang"
                id="bidang"
                options={bidang.options}
                value={bidang.selectedValue}
                onChange={bidang.handleChange}
                isLoading={bidang.isLoading}
                placeholder={
                  kabupaten.selectedValue
                    ? "Pilih bidang..."
                    : "Pilih kabupaten/kota dahulu"
                }
                isDisabled={!kabupaten.selectedValue || isSaving}
              />

              <InputForm
                formTitle="Kode Unit"
                id="kodeUnit"
                type="number"
                value={kodeUnit}
                onChange={(e) => setKodeUnit(e.target.value)}
                min="0"
              />

              <InputForm
                formTitle="Nama Unit"
                id="namaUnit"
                type="text"
                value={namaUnit}
                onChange={(e) => setNamaUnit(e.target.value)}
              />

              <InputForm
                formTitle="Kode"
                id="kode"
                type="text"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
              />
            </form>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
              <Buttons
                variant="secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                Batal
              </Buttons>

              <Buttons
                type="submit"
                variant="danger"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving
                  ? initialData
                    ? "Menyimpan Perubahan..."
                    : "Menyimpan..."
                  : initialData
                  ? "Simpan Perubahan"
                  : "Simpan"}
              </Buttons>
            </div>
            {/* --- Modal Content Selesai --- */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddUnitModal;
