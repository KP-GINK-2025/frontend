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
      </div>
    </div>
  );
};

export default DashboardPage;
