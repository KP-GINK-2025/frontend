import React from "react";
import Navbar from "../../../components/Navbar";
import MenuItem from "../../../components/MenuItem";
import useMenuNavigation from "../../../hooks/useMenuNavigation";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Wallet, Layers, Tag, Box, FileText, List, Indent } from "lucide-react";

const menuItems = [
  { name: "Akun", icon: Wallet },
  { name: "Kelompok", icon: Layers },
  { name: "Jenis", icon: Tag },
  { name: "Objek", icon: Box },
  { name: "Rincian Objek", icon: FileText },
  { name: "Sub Rincian", icon: List },
  { name: "Sub Sub Rincian", icon: Indent },
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
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 mb-6 gap-8">
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
