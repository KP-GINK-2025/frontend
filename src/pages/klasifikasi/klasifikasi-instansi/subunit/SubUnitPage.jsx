import React, { useState, useEffect, useMemo } from "react";
import { Upload, RefreshCw, Plus } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Buttons } from "@/components/ui";
import { SearchInput, FilterDropdown } from "@/components/form";
import { ColumnManager } from "@/components/table";
import AddSubUnitModal from "./AddSubUnitModal";
import { useSubUnitPageLogic } from "./useSubUnitPageLogic";

const SubUnitPage = () => {
  const { state, handler } = useSubUnitPageLogic();
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    const initialVisibility = {};
    columns.forEach((col) => {
      initialVisibility[col.field] = true;
    });
    setColumnVisibility(initialVisibility);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "action",
        headerName: "Action",
        width: 120,
        sortable: false,
        renderCell: (params) => {
          if (!params.row) return null;
          return (
            <div className="flex gap-2 items-center h-full">
              <button
                onClick={() => handler.handleOpenModal(params.row)}
                className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handler.handleDeleteSubUnit(params.row.id)}
                className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          );
        },
      },
      {
        field: "no",
        headerName: "No",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          if (!params.row) return null;
          return (
            state.subUnitData.findIndex((row) => row.id === params.row.id) +
            1 +
            state.paginationModel.page * state.paginationModel.pageSize
          );
        },
      },
      {
        field: "provinsi",
        headerName: "Provinsi",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const provinsi = params.row.unit?.bidang?.kabupaten_kota?.provinsi;
          return provinsi
            ? `${provinsi.kode_provinsi} - ${provinsi.nama_provinsi}`
            : "N/A";
        },
      },
      {
        field: "kabupaten_kota",
        headerName: "Kabupaten/Kota",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const kabKot = params.row.unit?.bidang?.kabupaten_kota;
          return kabKot
            ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
            : "N/A";
        },
      },
      {
        field: "bidang",
        headerName: "Bidang",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const bidang = params.row.unit?.bidang;
          return bidang
            ? `${bidang.kode_bidang} - ${bidang.nama_bidang}`
            : "N/A";
        },
      },
      {
        field: "unit",
        headerName: "Unit",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const unit = params.row.unit;
          return unit ? `${unit.kode_unit} - ${unit.nama_unit}` : "N/A";
        },
      },

      // Kolom dengan data langsung tetap CUKUP GUNAKAN 'field'
      {
        field: "kode_sub_unit",
        headerName: "Kode Sub Unit",
        width: 120,
      },
      {
        field: "nama_sub_unit",
        headerName: "Nama Sub Unit",
        flex: 1,
        minWidth: 250,
      },
      {
        field: "kode",
        headerName: "Kode",
        width: 100,
      },
    ],
    [state.subUnitData, state.paginationModel, handler]
  );

  const handleColumnVisibilityChange = (newVisibility) => {
    setColumnVisibility(newVisibility);
  };

  // Filter visible columns
  const visibleColumns = columns.filter((col) => {
    return columnVisibility[col.field] !== false;
  });

  const paginationOptions = [5, 10, 25, 50, 75, 100, 200];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="p-8">
        <Breadcrumbs />

        {/* Tombol Export */}
        <div className="flex justify-end mt-4 mb-2">
          <Buttons
            variant="danger"
            onClick={handler.handleExport}
            disabled={state.exporting}
          >
            <Upload
              size={16}
              className={state.exporting ? "animate-pulse" : ""}
            />
            {state.exporting ? "Mengekspor..." : "Ekspor"}
          </Buttons>
        </div>

        {/* Kontainer utama */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {/* Judul + Tombol Aksi */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mr-2">
              Daftar Sub Unit
            </h1>
            <div className="flex w-full sm:w-auto md:justify-end gap-2">
              <Buttons
                variant="info"
                onClick={handler.handleRefresh}
                disabled={state.refreshing}
              >
                <RefreshCw
                  size={16}
                  className={state.refreshing ? "animate-spin" : ""}
                />
                Refresh
              </Buttons>
              <Buttons
                variant="success"
                onClick={() => handler.handleOpenModal()}
              >
                <Plus size={16} /> Tambah Sub Unit
              </Buttons>
            </div>
          </div>

          {/* --- TATA LETAK BARU DIMULAI DARI SINI --- */}

          {/* Baris 1: Filter Utama */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FilterDropdown
              value={state.selectedBidang}
              onChange={(e) => {
                handler.setSelectedBidang(e.target.value);
                handler.setSelectedUnit("");
              }}
              options={state.bidangList}
              placeholder="-- Semua Bidang --"
              loading={state.loadingBidang}
            />
            <FilterDropdown
              value={state.selectedUnit}
              onChange={(e) => {
                handler.setSelectedUnit(e.target.value);
              }}
              options={state.unitList}
              placeholder={
                state.selectedBidang
                  ? "-- Semua Unit --"
                  : "Pilih bidang dahulu"
              }
              loading={state.loadingUnit}
              disabled={!state.selectedBidang}
            />
          </div>

          {/* Baris 2: Kontrol Tabel (Show Entries, Column Manager, Search) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {/* Grup Kiri: Show Entries & Column Manager */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={state.paginationModel.pageSize}
                  onChange={(e) =>
                    handler.setPaginationModel({
                      page: 0,
                      pageSize: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 hover:border-gray-500 rounded-md px-3 py-1 text-sm cursor-pointer focus:outline-none focus:border-2 focus:border-[#B53C3C]"
                >
                  {paginationOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              <ColumnManager
                columns={columns}
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={handleColumnVisibilityChange}
              />
            </div>

            {/* Grup Kanan: Search */}
            <div className="w-full md:w-auto">
              <SearchInput
                placeholder="Cari sub unit..."
                value={state.searchTerm}
                onChange={(e) => handler.setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabel */}
          <DataTable
            rows={state.subUnitData}
            columns={visibleColumns}
            rowCount={state.totalRows}
            loading={state.loading}
            paginationMode="server"
            pageSizeOptions={paginationOptions}
            paginationModel={state.paginationModel}
            onPaginationModelChange={handler.setPaginationModel}
            height={500}
            emptyRowsMessage="Tidak ada data tersedia"
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
          />
        </div>
      </div>

      <AddSubUnitModal
        isOpen={state.isModalOpen}
        onClose={handler.handleCloseModal}
        onSave={handler.handleSaveSubUnit}
        initialData={state.editingSubUnit}
      />
    </div>
  );
};

export default SubUnitPage;
