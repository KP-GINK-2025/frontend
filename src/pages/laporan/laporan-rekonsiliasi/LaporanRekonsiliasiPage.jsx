import React from "react";
import {
  Building2,
  FileBarChart2,
  LayoutGrid,
  CircleDollarSign,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import MenuItem from "../../../components/MenuItem";
import useMenuNavigation from "../../../hooks/useMenuNavigation";
import Breadcrumbs from "../../../components/Breadcrumbs";

const menuItems = [
  { name: "Laporan per UPB", icon: Building2 },
  { name: "Rekap Rekonsiliasi", icon: FileBarChart2 },
  { name: "Rekap KIB", icon: LayoutGrid },
  { name: "Rekap Saldo (awal dan akhir)", icon: CircleDollarSign },
];

const LaporanRekonsiliasiPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Laporan Rekonsiliasi</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {menuItems.map((item, index) => (
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

export default LaporanRekonsiliasiPage;
