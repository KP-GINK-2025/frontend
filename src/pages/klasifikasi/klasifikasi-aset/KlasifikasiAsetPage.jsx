import React from "react";
import Navbar from "../../../components/Navbar";
import MenuItem from "../../../components/MenuItem";
import useMenuNavigation from "../../../hooks/useMenuNavigation";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { PieChart } from "lucide-react";

const menuItems = [
  { name: "Akun", icon: PieChart },
  { name: "Kelompok", icon: PieChart },
  { name: "Jenis", icon: PieChart },
  { name: "Objek", icon: PieChart },
  { name: "Rincian Objek", icon: PieChart },
  { name: "Sub Rincian", icon: PieChart },
  { name: "Sub Sub Rincian", icon: PieChart },
];

const KlasifikasiAsetPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content Area */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        {/* Tambahkan h1 atau h2 di sini jika Anda mau judul halaman */}
        <h1 className="text-2xl font-bold mb-4 mt-4">Klasifikasi Aset</h1>
        {/* Pembungkus Utama untuk Semua Baris Item Menu */}
        <div className="flex flex-col items-center gap-y-6 mt-8">
          {" "}
          {/* Tambahkan margin top untuk pemisah dari judul */}
          {/* Baris Pertama: 3 item */}
          <div className="grid grid-cols-3 gap-6">
            {menuItems.slice(0, 3).map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                icon={item.icon}
                onClick={() => handleMenuItemClick(item.name)}
              />
            ))}
          </div>
          {/* Baris Kedua: 3 item */}
          <div className="grid grid-cols-3 gap-6 mt-2">
            {menuItems.slice(3, 6).map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                icon={item.icon}
                onClick={() => handleMenuItemClick(item.name)}
              />
            ))}
          </div>
          {/* Baris Ketiga: 1 item di tengah */}
          <div className="grid grid-cols-3 gap-6 mt-2">
            {menuItems.slice(6, 7).map(
              (
                item,
                index // Hanya ambil 1 item terakhir
              ) => (
                <div key={index} className="col-start-2">
                  {" "}
                  {/* Gunakan col-start-2 untuk menempatkan di tengah */}
                  <MenuItem
                    name={item.name}
                    icon={item.icon}
                    onClick={() => handleMenuItemClick(item.name)}
                  />
                </div>
              )
            )}
          </div>
        </div>{" "}
        {/* Akhir dari pembungkus utama item menu */}
      </div>
    </div>
  );
};

export default KlasifikasiAsetPage;
