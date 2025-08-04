import React, { useMemo } from "react";
import { Upload, RefreshCw, Plus } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Buttons } from "@/components/ui";
import { SearchInput, FilterDropdown } from "@/components/form";
import AddUnitModal from "./AddUnitModal";
import { useUnitPageLogic } from "./useUnitPageLogic";

const UnitPage = () => {
  const { state, handler } = useUnitPageLogic();

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
                onClick={() => handler.handleDeleteUnit(params.row.id)}
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
            state.unitData.findIndex((row) => row.id === params.row.id) +
            1 +
            state.paginationModel.page * state.paginationModel.pageSize
          );
        },
      },

      // --- MENERAPKAN POLA DARI SUBUNITPAGE ---
      {
        field: "provinsi",
        headerName: "Provinsi",
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          const provinsi = params.row.bidang?.kabupaten_kota?.provinsi;
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
          const kabKot = params.row.bidang?.kabupaten_kota;
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
          const bidang = params.row.bidang;
          return bidang
            ? `${bidang.kode_bidang} - ${bidang.nama_bidang}`
            : "N/A";
        },
      },

      // Kolom dengan data langsung tetap CUKUP GUNAKAN 'field'
      {
        field: "kode_unit",
        headerName: "Kode Unit",
        width: 120,
      },
      {
        field: "nama_unit",
        headerName: "Nama Unit",
        flex: 1,
        minWidth: 250,
      },
      {
        field: "kode",
        headerName: "Kode",
        width: 100,
      },
    ],
    [state.unitData, state.paginationModel, handler]
  );

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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mr-2">
              Daftar Unit
            </h1>
            <div className="flex gap-2">
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
                <Plus size={16} /> Tambah Unit
              </Buttons>
            </div>
          </div>

          {/* Filter dan Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            {/* BAGIAN KIRI: Kumpulan Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Dropdown "Show entries" */}
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

              {/* Filter Bidang */}
              <FilterDropdown
                value={state.selectedBidang}
                onChange={(e) => {
                  handler.setSelectedBidang(e.target.value);
                  handler.setSelectedUnit("");
                  handler.setSelectedSubUnit("");
                }}
                options={state.bidangList}
                placeholder="-- Semua Bidang --"
                loading={state.loadingBidang}
              />
            </div>

            {/* BAGIAN KANAN: Search */}
            <div className="relative w-full md:w-64">
              <SearchInput
                placeholder="Cari unit..."
                value={state.searchTerm}
                onChange={(e) => handler.setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabel */}
          <DataTable
            rows={state.unitData}
            columns={columns}
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

      <AddUnitModal
        isOpen={state.isModalOpen}
        onClose={handler.handleCloseModal}
        onSave={handler.handleSaveUnit}
        initialData={state.editingUnit}
      />
    </div>
  );
};

export default UnitPage;
