import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const DataTable = ({
  rows,
  columns,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  checkboxSelection = false,
  height = 400,
  width = "100%",
  sx,
  onRowSelectionModelChange,
  rowSelectionModel,
  emptyRowsMessage = "No data available",
  ...otherProps
}) => {
  if (!rows || rows.length === 0) {
    return (
      <Paper
        sx={{
          height,
          width,
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
    <Paper sx={{ height, width, ...sx }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        sx={{ border: 0 }}
        disableRowSelectionOnClick
        {...otherProps}
      />
    </Paper>
  );
};

export default DataTable;
