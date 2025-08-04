import React from "react";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import useMenuNavigation from "../../../../hooks/useMenuNavigation";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { MenuItem } from "@/components/ui";

const menuItems = [
  { name: "Rincian Realisasi Anggaran", icon: FileText },
  { name: "Rincian sudah diadministrasi", icon: CheckCircle2 },
  { name: "Rincian belum diadministrasi", icon: Clock },
];

const RincianHibahPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Rincian Hibah</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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

export default RincianHibahPage;
