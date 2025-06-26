import { useNavigate } from "react-router-dom";

const useMenuNavigation = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (itemName) => {
    switch (itemName) {
      // Klasifikasi Start
      case "Klasifikasi":
        navigate("/klasifikasi");
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
      // Klasifikasi End

      // Data Ruang Start
      case "Data Ruang":
        navigate("/data-ruang");
        break;
      // Data Ruang End

      // Saldo Awal Start
      case "Saldo Awal":
        navigate("/saldo-awal");
        break;
      // Saldo Awal End

      // LRA Start
      case "LRA":
        navigate("/lra");
        break;
      // LRA End

      // Keuangan Start
      case "Keuangan":
        navigate("/keuangan");
        break;
      // Keuangan End

      // Laporan Start
      case "Laporan":
        navigate("/laporan");
        break;
      // Laporan End

      // Pengaturan Start
      case "Pengaturan":
        navigate("/pengaturan");
        break;
      // Pengaturan End

      default:
        console.log("Menu clicked: ", { itemName });
        break;
    }
  };

  return { handleMenuItemClick };
};

export default useMenuNavigation;
