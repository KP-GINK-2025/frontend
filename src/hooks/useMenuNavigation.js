import { useNavigate } from "react-router-dom";

const useMenuNavigation = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (itemName) => {
    switch (itemName) {
      case "Klasifikasi":
        navigate("/klasifikasi");
        break;
      case "Data Ruang":
        navigate("/data-ruang");
        break;
      case "Saldo Awal":
        navigate("/saldo-awal");
        break;
      case "LRA":
        navigate("/lra");
        break;
      case "Keuangan":
        navigate("/keuangan");
        break;
      case "Laporan":
        navigate("/laporan");
        break;
      case "Pengaturan":
        navigate("/pengaturan");
        break;
      case "Klasifikasi Instansi":
        navigate("/klasifikasi/instansi");
        break;
      case "Bidang":
        navigate("/klasifikasi/instansi/bidang");
        break;
      case "Unit":
        navigate("/klasifikasi/instansi/unit");
        break;
      case "Sub Unit":
        navigate("/klasifikasi/instansi/sub-unit");
        break;
      case "UPB":
        navigate("/klasifikasi/instansi/upb");
        break;
      case "Klasifikasi Aset":
        navigate("/klasifikasi/aset");
        break;
      case "Akun":
        navigate("/klasifikasi/aset/akun");
        break;
      case "Kelompok":
        navigate("/klasifikasi/aset/kelompok");
        break;
      case "Jenis":
        navigate("/klasifikasi/aset/jenis");
        break;
      case "Objek":
        navigate("/klasifikasi/aset/objek");
        break;
      case "Rincian Objek":
        navigate("/klasifikasi/aset/rincian-objek");
        break;
      case "Sub Rincian":
        navigate("/klasifikasi/aset/sub-rincian");
        break;
      case "Sub Sub Rincian":
        navigate("/klasifikasi/aset/sub-sub-rincian");
        break;
      default:
        console.log("Menu clicked: ", { itemName });
        break;
    }
  };

  return { handleMenuItemClick };
};

export default useMenuNavigation;
