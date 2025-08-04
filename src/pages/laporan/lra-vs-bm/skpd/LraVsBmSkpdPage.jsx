import React from "react";
import { Navbar, Breadcrumbs } from "@/components/layout";

const LraVsBmSkpdPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">LRA VS BM SKPD</h1>

        <div className="flex justify-center mt-8">
          <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
            <h2 className="text-center font-bold text-lg mb-2 uppercase">
              LAPORAN REALISASI ANGGARAN VS BELANJA MODAL (SKPD)
            </h2>
            <p className="text-center text-lg">Kabupaten Tanggamus</p>
            <p className="text-center text-lg mb-6">Tahun Anggaran 2025</p>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="statusVerifikasi"
                  className="text-sm font-medium mb-1"
                >
                  Status Verifikasi
                </label>
                <select
                  id="statusVerifikasi"
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-sm"
                >
                  <option value="">-- Semua Status --</option>
                  <option value="Sudah">Sudah Verifikasi</option>
                  <option value="Belum">Belum Verifikasi</option>
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#b00020] text-white px-6 py-2 rounded hover:bg-[#9e001c] transition cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LraVsBmSkpdPage;
