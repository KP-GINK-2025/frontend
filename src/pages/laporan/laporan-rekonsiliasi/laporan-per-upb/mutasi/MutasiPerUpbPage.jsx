import React from "react";
import Navbar from "../../../../../components/Navbar";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

const MutasiPerUpbPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Mutasi per UPB</h1>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-center font-bold text-base mb-2 uppercase leading-relaxed">
          DATA MUTASI AKTIVA TETAP KABUPATEN TANGGAMUS DARI DROPING PUSAT/{" "}
          <br />
          DROPING PEMDA/ MUTASI SKPD LAIN/ PENGHAPUSAN/ USULAN PENGHAPUSAN{" "}
          <br />
          TAHUN ANGGARAN 2025
        </h2>

        <form className="space-y-4">
          {[
            "Unit",
            "Sub Unit",
            "UPB",
            "Semester",
            "Status Verifikasi",
            "Nama Pimpinan",
            "NIP Pimpinan",
            "Jabatan Pimpinan",
            "Nama Bendahara",
            "NIP Bendahara",
            "Jabatan Bendahara",
            "Nama Pengurus",
            "NIP Pengurus",
            "Jabatan Pengurus",
            "Nama Penyimpan",
            "NIP Penyimpan",
            "Jabatan Penyimpan",
          ].map((label, i) => (
            <div key={i} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-sm">
                <option value="">-- Pilih {label} --</option>
              </select>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-[#b00020] text-white px-6 py-2 rounded hover:bg-[#9e001c] transition cursor-pointer"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MutasiPerUpbPage;
