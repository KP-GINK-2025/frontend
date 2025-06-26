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
        <h1 className="text-2xl font-bold mb-4 mt-4">Klasifikasi Aset</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-7 gap-8">
          {menuItems.slice(0, 7).map((item, index) => (
            <MenuItem
              key={index}
              name={item.name}
              icon={item.icon}
              onClick={() => handleMenuItemClick(item.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KlasifikasiAsetPage;
