import React, { useState, useEffect, useMemo } from "react";
import { Upload, RefreshCw, Plus } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Buttons } from "@/components/ui";
import { SearchInput, FilterDropdown } from "@/components/form";
import { ColumnManager } from "@/components/table";
import AddSubRincianModal from "./AddSubRincianModal";
import { useSubRincianPageLogic } from "./useSubRincianPageLogic";

const SubRincianPage = () => {
  const { state, handler } = useSubRincianPageLogic();
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
                onClick={() => handler.handleDeleteSubRincian(params.row.id)}
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
            state.subRincianData.findIndex((row) => row.id === params.row.id) +
            1 +
            state.paginationModel.page * state.paginationModel.pageSize
          );
        },
      },
      {
        field: "akun_aset",
        headerName: "Akun",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const akun =
            params.row.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset
              .akun_aset;
          return akun
            ? `${akun.kode_akun_aset} - ${akun.nama_akun_aset}`
            : "N/A";
        },
      },
      {
        field: "kelompok_aset",
        headerName: "Kelompok",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const kelompok =
            params.row.rincian_objek_aset.objek_aset.jenis_aset.kelompok_aset;
          return kelompok
            ? `${kelompok.kode_kelompok_aset} - ${kelompok.nama_kelompok_aset}`
            : "N/A";
        },
      },
      {
        field: "jenis_aset",
        headerName: "Jenis",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const jenis = params.row.rincian_objek_aset.objek_aset.jenis_aset;
          return jenis
            ? `${jenis.kode_jenis_aset} - ${jenis.nama_jenis_aset}`
            : "N/A";
        },
      },
      {
        field: "objek_aset",
        headerName: "Objek",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const objek = params.row.rincian_objek_aset.objek_aset;
          return objek
            ? `${objek.kode_objek_aset} - ${objek.nama_objek_aset}`
            : "N/A";
        },
      },
      {
        field: "rincian_objek_aset",
        headerName: "Rincian Objek",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const rincian = params.row.rincian_objek_aset;
          return rincian
            ? `${rincian.kode_rincian_objek_aset} - ${rincian.nama_rincian_objek_aset}`
            : "N/A";
        },
      },

      // Kolom dengan data langsung tetap CUKUP GUNAKAN 'field'
      {
        field: "kode_sub_rincian_aset",
        headerName: "Kode Sub Rincian",
        width: 120,
      },
      {
        field: "nama_sub_rincian_aset",
        headerName: "Nama Sub Rincian",
        flex: 1,
        minWidth: 250,
      },
      {
        field: "kode",
        headerName: "Kode",
        width: 100,
      },
    ],
    [state.subRincianData, state.paginationModel, handler]
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
              Daftar Sub Rincian
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
                <Plus size={16} /> Tambah Sub Rincian
              </Buttons>
            </div>
          </div>

          {/* --- TATA LETAK BARU DIMULAI DARI SINI --- */}
          {/* Baris 1: Filter Utama */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FilterDropdown
              value={state.selectedAkun}
              onChange={(e) => {
                handler.setSelectedAkun(e.target.value);
                handler.setSelectedKelompok("");
                handler.setSelectedJenis("");
                handler.setSelectedObjek("");
                handler.setSelectedRincianObjek("");
              }}
              options={state.akunList}
              placeholder="-- Semua Akun --"
              loading={state.loadingAkun}
            />
            <FilterDropdown
              value={state.selectedKelompok}
              onChange={(e) => {
                handler.setSelectedKelompok(e.target.value);
                handler.setSelectedJenis("");
                handler.setSelectedObjek("");
                handler.setSelectedRincianObjek("");
              }}
              options={state.kelompokList}
              placeholder={
                state.selectedAkun
                  ? "-- Semua Kelompok --"
                  : "Pilih akun dahulu"
              }
              loading={state.loadingKelompok}
              disabled={!state.selectedAkun}
            />
            <FilterDropdown
              value={state.selectedJenis}
              onChange={(e) => {
                handler.setSelectedJenis(e.target.value);
                handler.setSelectedObjek("");
                handler.setSelectedRincianObjek("");
              }}
              options={state.jenisList}
              placeholder={
                state.selectedKelompok
                  ? "-- Semua Jenis --"
                  : "Pilih kelompok dahulu"
              }
              loading={state.loadingJenis}
              disabled={!state.selectedKelompok}
            />
            <FilterDropdown
              value={state.selectedObjek}
              onChange={(e) => {
                handler.setSelectedObjek(e.target.value);
                handler.setSelectedRincianObjek("");
              }}
              options={state.objekList}
              placeholder={
                state.selectedJenis ? "-- Semua Objek --" : "Pilih jenis dahulu"
              }
              loading={state.loadingObjek}
              disabled={!state.selectedJenis}
            />
            <FilterDropdown
              value={state.selectedRincianObjek}
              onChange={(e) => {
                handler.setSelectedRincianObjek(e.target.value);
              }}
              options={state.rincianObjekList}
              placeholder={
                state.selectedObjek
                  ? "-- Semua Rincian Objek --"
                  : "Pilih objek dahulu"
              }
              loading={state.loadingRincianObjek}
              disabled={!state.selectedObjek}
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
                placeholder="Cari sub rincian..."
                value={state.searchTerm}
                onChange={(e) => handler.setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabel */}
          <DataTable
            rows={state.subRincianData}
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

      <AddSubRincianModal
        isOpen={state.isModalOpen}
        onClose={handler.handleCloseModal}
        onSave={handler.handleSaveSubRincian}
        initialData={state.editingSubRincian}
      />
    </div>
  );
};

export default SubRincianPage;
