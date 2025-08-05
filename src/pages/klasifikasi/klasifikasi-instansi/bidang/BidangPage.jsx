import React, { useState, useEffect, useMemo } from "react";
import { Upload, RefreshCw, Plus } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { DataTable } from "@/components/table";
import { Buttons } from "@/components/ui";
import { SearchInput } from "@/components/form";
import { ColumnManager } from "@/components/table";
import AddBidangModal from "./AddBidangModal";
import { useBidangPageLogic } from "./useBidangPageLogic";

const BidangPage = () => {
  const { state, handler } = useBidangPageLogic();
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
            state.bidangData.findIndex((row) => row.id === params.row.id) +
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
          const provinsi = params.row.kabupaten_kota?.provinsi;
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
          const kabKot = params.row.kabupaten_kota;
          return kabKot
            ? `${kabKot.kode_kabupaten_kota} - ${kabKot.nama_kabupaten_kota}`
            : "N/A";
        },
      },

      // Kolom dengan data langsung tetap CUKUP GUNAKAN 'field'
      {
        field: "kode_bidang",
        headerName: "Kode Bidang",
        width: 120,
      },
      {
        field: "nama_bidang",
        headerName: "Nama Bidang",
        flex: 1,
        minWidth: 250,
      },
      {
        field: "kode",
        headerName: "Kode",
        width: 100,
      },
    ],
    [state.bidangData, state.paginationModel, handler]
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
              Daftar Bidang
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
                <Plus size={16} /> Tambah Bidang
              </Buttons>
            </div>
          </div>

          {/* --- TATA LETAK BARU DIMULAI DARI SINI --- */}

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
                placeholder="Cari bidang..."
                value={state.searchTerm}
                onChange={(e) => handler.setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabel */}
          <DataTable
            rows={state.bidangData}
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

      <AddBidangModal
        isOpen={state.isModalOpen}
        onClose={handler.handleCloseModal}
        onSave={handler.handleSaveBidang}
        initialData={state.editingBidang}
      />
    </div>
  );
};

export default BidangPage;
