import React from "react";
import { Building2, BarChartBig } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import MenuItem from "../../../../components/MenuItem";
import useMenuNavigation from "../../../../hooks/useMenuNavigation";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const menuItems = [
  { name: "Rekapitulasi Hibah per UPB", icon: Building2 },
  { name: "Rekapitulasi Seluruh Hibah", icon: BarChartBig },
];

const RekapitulasiHibahPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Rekapitulasi Hibah</h1>
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

export default RekapitulasiHibahPage;
