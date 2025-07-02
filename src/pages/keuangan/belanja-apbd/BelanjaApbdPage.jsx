import React from "react";
import { Wallet } from "lucide-react"; // kamu bisa ganti ikon jika perlu
import Navbar from "../../../components/Navbar";
import Breadcrumbs from "../../../components/Breadcrumbs";
import MenuItem from "../../../components/MenuItem";
import useMenuNavigation from "../../../hooks/useMenuNavigation";

const menuItems = [
  { name: "Daftar Belanja", icon: Wallet },
  { name: "Item Belanja", icon: Wallet },
  { name: "Posting Belanja", icon: Wallet },
];

const BelanjaApbdPage = () => {
  const { handleMenuItemClick } = useMenuNavigation();

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <Navbar />

      {/* Content */}
      <div className="px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold mb-4 mt-4">Belanja APBD</h1>
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

export default BelanjaApbdPage;
