import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Buttons } from "@/components/ui";
import { InputForm, SelectForm } from "@/components/form";
import { useUnitForm } from "./useUnitForm";
import { showInfoAlert } from "../../../../utils/notificationService";

const AddUnitModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [isSaving, setIsSaving] = useState(false);

  const {
    formState,
    handleInputChange,
    resetForm,
    provinsi,
    kabupaten,
    bidang,
    isFormValid,
    dataToSave,
  } = useUnitForm(initialData, isOpen);

  useEffect(() => {
    if (!isOpen) setIsSaving(false);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      showInfoAlert(
        "Harap lengkapi semua field yang wajib diisi (*)",
        "Form Belum Lengkap"
      );
      return;
    }

    setIsSaving(true);
    try {
      await onSave(
        initialData ? { ...dataToSave, id: initialData.id } : dataToSave
      );
    } catch (error) {
      console.error("Proses penyimpanan gagal di level modal:", error);
    } finally {
      setIsSaving(false);
    }
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
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
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
                type="text"
                value={formState.kodeUnit}
                onChange={handleInputChange}
                min="0"
                disabled={isSaving}
              />
              <InputForm
                formTitle="Nama Unit"
                id="namaUnit"
                type="text"
                value={formState.namaUnit}
                onChange={handleInputChange}
                disabled={isSaving}
              />
              <InputForm
                formTitle="Kode"
                id="kode"
                type="text"
                value={formState.kode}
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </form>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
              <Buttons
                variant="secondary"
                onClick={resetForm}
                disabled={isSaving}
                className="mr-auto"
              >
                Reset
              </Buttons>

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
