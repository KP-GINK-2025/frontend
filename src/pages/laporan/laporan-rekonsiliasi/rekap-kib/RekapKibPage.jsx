import React from "react";
import { Layers } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import MenuItem from "../../../../components/MenuItem";
import useMenuNavigation from "../../../../hooks/useMenuNavigation";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const menuItems = [
  { name: "Rekap KIB A 47", icon: Layers },
  { name: "Rekap KIB B 47", icon: Layers },
  { name: "Rekap KIB C 47", icon: Layers },
  { name: "Rekap KIB D 47", icon: Layers },
  { name: "Rekap KIB E 47", icon: Layers },
  { name: "Rekap KIB F 47", icon: Layers },
];

const LaporanKibPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Rekap KIB</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="w-full flex flex-wrap justify-center gap-6">
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

export default LaporanKibPage;
