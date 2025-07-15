import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

/**
 * Komponen DataTable generik menggunakan Material-UI DataGrid.
 *
 * @param {object} props - Props komponen.
 * @param {Array} props.rows - Array objek data untuk ditampilkan di tabel. Setiap objek harus memiliki properti 'id' yang unik.
 * @param {Array} props.columns - Definisi kolom untuk DataGrid.
 * @param {number} [props.initialPageSize=5] - Jumlah baris per halaman awal.
 * @param {Array<number>} [props.pageSizeOptions=[5, 10, 25, 50, 100]] - Opsi jumlah baris per halaman.
 * @param {boolean} [props.checkboxSelection=false] - Apakah akan menampilkan kotak centang untuk seleksi baris.
 * @param {number} [props.height=400] - Tinggi kontainer tabel.
 * @param {string} [props.width='100%'] - Lebar kontainer tabel.
 * @param {object} [props.sx] - Objek gaya tambahan untuk kontainer Paper.
 * @param {Function} [props.onRowSelectionModelChange] - Callback ketika seleksi baris berubah.
 * @param {Array} [props.rowSelectionModel] - Array ID baris yang dipilih.
 * @param {string} [props.emptyRowsMessage="No data available"] - Pesan yang ditampilkan jika tidak ada data.
 */
const DataTable = ({
  rows,
  columns,
  initialPageSize = 10, // Default to 10
  pageSizeOptions = [5, 10, 25, 50, 75, 100],
  checkboxSelection = false,
  height = 400,
  width = "100%",
  sx, // Untuk styling tambahan pada Paper
  onRowSelectionModelChange, // Callback untuk seleksi baris
  rowSelectionModel, // State untuk seleksi baris (controlled)
  emptyRowsMessage = "No data available", // Pesan custom untuk data kosong
  ...otherProps // Menerima props DataGrid lainnya
}) => {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: initialPageSize,
  });

  // Jika rows kosong, tampilkan pesan custom di dalam DataGrid
  if (!rows || rows.length === 0) {
    return (
      <Paper
        sx={{
          height: height,
          width: width,
          ...sx,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ color: "text.secondary" }}>{emptyRowsMessage}</Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: height, width: width, ...sx }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              page: paginationModel.page,
              pageSize: paginationModel.pageSize,
            },
          },
        }}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        onPaginationModelChange={setPaginationModel} // Untuk mengontrol pagination
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        sx={{ border: 0 }} // Menghilangkan border default DataGrid
        disableRowSelectionOnClick // Opsional: Mencegah seleksi baris saat klik di luar checkbox
        {...otherProps} // Meneruskan props DataGrid lainnya
      />
    </Paper>
  );
};

export default DataTable;
