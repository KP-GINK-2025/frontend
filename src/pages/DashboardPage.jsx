import React from 'react';
import {
  FileText,
  FileStack,
  Wallet,
  ListOrdered,
  RefreshCcw,
  Layers,
  Wrench,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { name: 'Klasifikasi', icon: FileText },
  { name: 'Data Ruang', icon: FileStack },
  { name: 'Saldo Awal', icon: Wallet },
  { name: 'LRA', icon: ListOrdered },
  { name: 'Keuangan', icon: RefreshCcw },
  { name: 'Laporan', icon: Layers },
  { name: 'Setting', icon: Wrench },
];

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header */}
      <div className="bg-[#b00020] text-white flex items-center justify-between px-6 py-3 shadow">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logo-tanggamus.png"
            alt="Logo"
            className="w-12 h-auto"
          />
          <h1 className="text-lg font-semibold">Kabupaten Tanggamus</h1>
        </div>

        <div className="flex items-center gap-4">
          <UserCircle size={35} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm hover:text-gray-200 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <h2 className="text-sm text-gray-700 mb-6">Dashboard</h2>

        <div className="flex flex-col items-center gap-y-6">
            {/* Baris Pertama: 4 item */}
            <div className="grid grid-cols-4 gap-6">
                {menuItems.slice(0, 4).map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                    key={index}
                    className="bg-[#b00020] text-white rounded-xl w-28 h-28 flex flex-col items-center justify-center cursor-pointer shadow-md hover:bg-[#9e001c] transition"
                    >
                    <Icon size={36} />
                    <span className="text-sm font-medium text-center mt-2">{item.name}</span>
                    </div>
                );
                })}
            </div>

            {/* Baris Kedua: 3 item */}
            <div className="grid grid-cols-3 gap-6 mt-2">
                {menuItems.slice(4).map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                    key={index}
                    className="bg-[#b00020] text-white rounded-xl w-28 h-28 flex flex-col items-center justify-center cursor-pointer shadow-md hover:bg-[#9e001c] transition"
                    >
                    <Icon size={36} />
                    <span className="text-sm font-medium text-center mt-2">{item.name}</span>
                    </div>
                );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
