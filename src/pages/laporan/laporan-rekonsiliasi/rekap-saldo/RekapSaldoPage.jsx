import React from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { MenuItem } from "@/components/ui";
import useMenuNavigation from "../../../../hooks/useMenuNavigation";

const menuItems = [
  { name: "Rekap Saldo Awal", icon: ArrowUpCircle },
  { name: "Rekap Saldo Akhir", icon: ArrowDownCircle },
];

const RekapSaldoPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Rekap Saldo</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-2 gap-8">
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

export default RekapSaldoPage;
