import React from "react";
import { Users, User, ServerCog, UploadCloud } from "lucide-react";
import { Navbar, Breadcrumbs } from "@/components/layout";
import { MenuItem } from "@/components/ui";
import useMenuNavigation from "../../hooks/useMenuNavigation";

const menuItems = [
  { name: "Group", icon: Users },
  { name: "Pengguna", icon: User },
  { name: "Sistem", icon: ServerCog },
  { name: "Updating Data", icon: UploadCloud },
];

const PengaturanPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Pengaturan</h1>
      </div>
      <div className="flex flex-col items-center gap-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 mb-6 gap-8">
          {menuItems.slice(0, 4).map((item, index) => (
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

export default PengaturanPage;
