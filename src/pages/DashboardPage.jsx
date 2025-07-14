import React from "react";
import {
  FileText,
  FileStack,
  Wallet,
  ListOrdered,
  ChartNoAxesCombined,
  Layers,
  Settings,
} from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import MenuItem from "../components/MenuItem";
import Navbar from "../components/Navbar";
import useMenuNavigation from "../hooks/useMenuNavigation";

const menuItems = [
  { name: "Klasifikasi", icon: FileText },
  { name: "Data Ruang", icon: FileStack },
  { name: "Saldo Awal", icon: Wallet },
  { name: "LRA", icon: ListOrdered },
  { name: "Keuangan", icon: ChartNoAxesCombined },
  { name: "Laporan", icon: Layers },
  { name: "Pengaturan", icon: Settings },
];

const DashboardPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();
  return (
    <div className="select-none min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Dashboard</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 mb-6 gap-8">
          {menuItems.slice(0, 7).map((item, index) => (
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

export default DashboardPage;
