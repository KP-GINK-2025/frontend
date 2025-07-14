import React from "react";
import { ListChecks, Boxes, Repeat } from "lucide-react"; // Ikon sudah disesuaikan
import Navbar from "../../../components/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import MenuItem from "../../../components/MenuItem";
import useMenuNavigation from "../../../hooks/useMenuNavigation";

const menuItems = [
  { name: "Daftar Mutasi", icon: ListChecks },
  { name: "Item Mutasi", icon: Boxes },
  { name: "Posting Mutasi", icon: Repeat },
];

const MutasiPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Mutasi</h1>
      </div>

      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              name={item.name}
              icon={item.icon}
              onClick={() => handleMenuItemClick(item.name.toString())}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MutasiPage;
