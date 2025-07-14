import React from "react";
import Navbar from "../../../../../components/Navbar";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

const RekapKibB47Page = () => {
  const fields = [
    { label: "Provinsi", type: "input", value: "LAMPUNG" },
    { label: "Bidang", type: "select", placeholder: "-- Pilih Bidang --" },
    { label: "Unit", type: "select", placeholder: "-- Pilih Unit --" },
    { label: "Sub Unit", type: "select", placeholder: "-- Pilih Sub Unit --" },
    { label: "UPB", type: "select", placeholder: "-- Pilih UPB --" },
    { label: "Semester", type: "select", placeholder: "-- Pilih Semester --" },
    {
      label: "Sumber Data",
      type: "select",
      placeholder: "Berdasarkan Status Verifikasi",
    },
    {
      label: "Status Verifikasi",
      type: "select",
      placeholder: "-- Semua Status --",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Rekap KIB B 47</h1>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-center font-bold text-base mb-6 uppercase leading-relaxed">
          LAPORAN PERALATAN DAN MESIN V.47 KABUPATEN TANGGAMUS <br />
          TAHUN ANGGARAN 2025
        </h2>

        <form className="space-y-4">
          {fields.map((field, i) => (
            <div key={i} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{field.label}</label>
              {field.type === "input" ? (
                <input
                  type="text"
                  value={field.value}
                  disabled
                  className="border rounded-md px-3 py-2 bg-gray-100 text-sm"
                />
              ) : (
                <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-sm">
                  <option value="">{field.placeholder}</option>
                  {field.label === "Status Verifikasi" && (
                    <>
                      <option value="sudah">Sudah Verifikasi</option>
                      <option value="belum">Belum Verifikasi</option>
                    </>
                  )}
                </select>
              )}
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

export default RekapKibB47Page;
