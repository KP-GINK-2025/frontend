import * as XLSX from "xlsx";
import Swal from "sweetalert2";

/**
 * Universal Export Handler
 * @param {Object} config - Configuration object
 * @param {Function} config.fetchDataFunction - Function that returns data to export
 * @param {Array} config.columns - Column configuration for export
 * @param {string} config.filename - Base filename (without extension)
 * @param {string} config.sheetName - Excel sheet name
 * @param {Function} config.setExporting - State setter for loading state
 * @param {Object} config.customFormatters - Optional custom formatters for specific fields
 * @returns {Promise<void>}
 */
export const handleExport = async (config) => {
  const {
    fetchDataFunction,
    columns,
    filename,
    sheetName = "Data Export",
    setExporting,
    customFormatters = {},
  } = config;

  if (!fetchDataFunction || !columns || !filename) {
    console.error("Export Handler: Missing required configuration");
    Swal.fire({
      icon: "error",
      title: "Export Error",
      text: "Konfigurasi export tidak lengkap.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  if (setExporting) setExporting(true);

  try {
    // Fetch all data for export
    const allData = await fetchDataFunction();

    if (!allData || allData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada data untuk diekspor.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    // Format data untuk export
    const exportData = allData.map((item, index) => {
      const formattedRow = {};

      columns.forEach((column) => {
        const { field, headerName, formatter } = column;
        let value = item[field];

        // Apply custom formatter if exists
        if (formatter && typeof formatter === "function") {
          value = formatter(value, item, index);
        } else if (customFormatters[field]) {
          value = customFormatters[field](value, item, index);
        }

        // Handle special cases
        if (field === "no" || field === "index") {
          value = index + 1;
        }

        formattedRow[headerName] = value || "N/A";
      });

      return formattedRow;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    // Set column widths based on content length and header names
    const columnWidths = columns.map((column) => {
      const headerLength = column.headerName.length;
      const maxContentLength = Math.max(
        ...exportData.map((row) => {
          const cellValue = row[column.headerName];
          return cellValue ? cellValue.toString().length : 0;
        })
      );

      // Set minimum width of 10, maximum of 50
      const width = Math.min(
        Math.max(headerLength + 2, maxContentLength + 2, 10),
        50
      );
      return { wch: width };
    });

    worksheet["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, "-");
    const fullFilename = `${filename}-${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fullFilename);

    // Show success notification
    Swal.fire({
      icon: "success",
      title: "Export Berhasil!",
      text: `Data berhasil diekspor ke file ${fullFilename}`,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Export error:", error);
    Swal.fire({
      icon: "error",
      title: "Export Gagal!",
      text: "Terjadi kesalahan saat mengekspor data.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } finally {
    if (setExporting) setExporting(false);
  }
};

/**
 * Common formatters that can be reused across different pages
 */
export const commonFormatters = {
  // Currency formatter for Indonesian Rupiah
  currency: (value) => {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  },

  // Date formatter
  date: (value) => {
    if (!value) return "N/A";
    try {
      const date = new Date(value);
      return date.toLocaleDateString("id-ID");
    } catch (error) {
      return value;
    }
  },

  // Number formatter with thousand separators
  number: (value) => {
    if (!value) return "0";
    return new Intl.NumberFormat("id-ID").format(value);
  },

  // Status badge formatter (removes HTML, keeps text only)
  statusText: (value) => {
    if (!value) return "N/A";
    return value.toString();
  },

  // Nested object formatter (e.g., provinsi.nama_provinsi)
  nestedObject: (path) => (value, item) => {
    if (!item) return "N/A";
    const keys = path.split(".");
    let result = item;
    for (const key of keys) {
      result = result?.[key];
      if (!result) return "N/A";
    }
    return result;
  },

  // Combined formatter (e.g., "kode - nama")
  combined:
    (fields, separator = " - ") =>
    (value, item) => {
      if (!item) return "N/A";
      const values = fields
        .map((field) => {
          const keys = field.split(".");
          let result = item;
          for (const key of keys) {
            result = result?.[key];
            if (!result) return "";
          }
          return result;
        })
        .filter(Boolean);

      return values.length > 0 ? values.join(separator) : "N/A";
    },
};

/**
 * Helper function to create export configuration for common table patterns
 */
export const createExportConfig = ({
  data,
  searchTerm = "",
  filters = {},
  columns,
  filename,
  sheetName,
  setExporting,
  customFilters = {},
}) => {
  const fetchDataFunction = async () => {
    let filteredData = [...data];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter((item) => {
        return columns.some((column) => {
          const value = item[column.field];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
      });
    }

    // Apply dropdown filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter((item) => {
          if (customFilters[key]) {
            return customFilters[key](item, value);
          }
          return item[key] === value;
        });
      }
    });

    return filteredData;
  };

  return {
    fetchDataFunction,
    columns,
    filename,
    sheetName,
    setExporting,
  };
};
