import React from "react";
import { Wallet, ClipboardList, Repeat, FileBarChart2 } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { MenuItem } from "@/components/ui";
import useMenuNavigation from "../../../../hooks/useMenuNavigation";

const menuItems = [
  { name: "Belanja APBD per UPB", icon: Wallet },
  { name: "Rekap Belanja APBD per UPB", icon: ClipboardList },
  { name: "Mutasi per UPB", icon: Repeat },
  { name: "Rekap Mutasi per UPB", icon: FileBarChart2 },
];

const LaporanPerUpbPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Laporan per UPB</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 mb-6 gap-8">
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

export default LaporanPerUpbPage;
