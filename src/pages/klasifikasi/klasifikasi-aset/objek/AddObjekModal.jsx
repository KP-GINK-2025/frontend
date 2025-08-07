import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Buttons } from "@/components/ui";
import { InputForm, SelectForm } from "@/components/form";
import { useObjekForm } from "./useObjekForm";
import { showInfoAlert } from "../../../../utils/notificationService";

const AddObjekModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [isSaving, setIsSaving] = useState(false);

  const {
    formState,
    handleInputChange,
    resetForm,
    akun,
    kelompok,
    jenis,
    isFormValid,
    dataToSave,
  } = useObjekForm(initialData, isOpen);

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
                {initialData ? "EDIT OBJEK" : "TAMBAH OBJEK"}
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
                formTitle="Akun"
                id="akun"
                options={akun.options}
                value={akun.selectedValue}
                onChange={akun.handleChange}
                isLoading={akun.isLoading}
                placeholder="Pilih akun..."
                isDisabled={isSaving}
              />
              <SelectForm
                formTitle="Kelompok"
                id="kelompok"
                options={kelompok.options}
                value={kelompok.selectedValue}
                onChange={kelompok.handleChange}
                isLoading={kelompok.isLoading}
                placeholder={
                  akun.selectedValue ? "Pilih kelompok..." : "Pilih akun dahulu"
                }
                isDisabled={!akun.selectedValue || isSaving}
              />
              <SelectForm
                formTitle="Jenis"
                id="jenis"
                options={jenis.options}
                value={jenis.selectedValue}
                onChange={jenis.handleChange}
                isLoading={jenis.isLoading}
                placeholder={
                  kelompok.selectedValue
                    ? "Pilih jenis..."
                    : "Pilih kelompok dahulu"
                }
                isDisabled={!kelompok.selectedValue || isSaving}
              />

              <InputForm
                formTitle="Kode Objek"
                id="kodeObjek"
                type="text"
                value={formState.kodeObjek}
                onChange={handleInputChange}
                min="0"
                disabled={isSaving}
              />

              <InputForm
                formTitle="Nama Objek"
                id="namaObjek"
                type="text"
                value={formState.namaObjek}
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

export default AddObjekModal;
