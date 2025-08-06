import React, { useState, useRef, useEffect } from "react";
import { X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

const AddNeracaAsetModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setUploadProgress(0);
      setUploading(false);
    }
  }, [isOpen]);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (
        !validTypes.includes(file.type) &&
        !file.name.match(/\.(xlsx?|csv)$/i)
      ) {
        Swal.fire({
          title: "File Tidak Valid",
          text: "Harap pilih file Excel (.xlsx, .xls) atau CSV (.csv)",
          icon: "error",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: "File Terlalu Besar",
          text: "Ukuran file maksimal 10MB",
          icon: "error",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  // Handle file upload/import
  const handleImport = async () => {
    if (!selectedFile) {
      Swal.fire({
        title: "File Belum Dipilih",
        text: "Silakan pilih file Excel terlebih dahulu",
        icon: "warning",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await api.post("/saldo-awal/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success message
      await Swal.fire({
        title: "Import Berhasil!",
        text: `Data saldo awal berhasil diimport. ${
          response.data?.imported_count || 0
        } record berhasil ditambahkan.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Close modal and refresh data
      onClose();
      if (onSave) {
        onSave(); // This will trigger refresh in parent component
      }
    } catch (error) {
      console.error("Import error:", error);

      let errorMessage = "Terjadi kesalahan saat mengimport data.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errorDetails = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
        errorMessage = `Validasi gagal:\n${errorDetails}`;
      }

      await Swal.fire({
        title: "Import Gagal",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const event = { target: { files: [files[0]] } };
      handleFileChange(event);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Petunjuk Import
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={uploading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Instructions */}
          <div className="mb-6">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>
                Download saldo awal melalui link simaset audited pada menu
                laporan rekapitulasi buku inventaris.
              </li>
              <li>
                Pilih kualifikasi nya (intra, ekstra, aset lain-lain, klik
                excel).
              </li>
              <li>
                Buka file blok kolom f sampai u pilih format number dan atur 2
                angka di belakang koma.
              </li>
              <li>Simpan dalam Excel 2003.</li>
              <li>
                Lalu pilih file dengan tombol (Choose File) di bawah ini
                kemudian klik Import.
              </li>
            </ol>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Excel
            </label>

            {/* File Input Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                selectedFile
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="text-green-500 mb-2" size={48} />
                  <p className="text-sm font-medium text-green-700 mb-1">
                    File dipilih:
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={handleFileInputClick}
                    disabled={uploading}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 cursor-pointer"
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FileText className="text-gray-400 mb-2" size={48} />
                  <button
                    onClick={handleFileInputClick}
                    disabled={uploading}
                    className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Choose File
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Atau drag & drop file Excel di sini
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Format: .xlsx, .xls, .csv (Maksimal 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Mengupload file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertCircle
                className="text-yellow-400 flex-shrink-0 mr-2"
                size={20}
              />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  File hanya dapat digunakan sekali saja jika ada perubahan
                  gunakan ikon pensil atau hubungi admin!!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Import
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNeracaAsetModal;
