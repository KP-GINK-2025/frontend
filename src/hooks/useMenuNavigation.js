import { useNavigate } from "react-router-dom";

const useMenuNavigation = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (itemName) => {
    switch (itemName) {
      // Klasifikasi Start
      case "Klasifikasi":
        navigate("/klasifikasi");
        break;
      // Klasifikasi Instansi
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
      // Klasifikasi Aset
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
      // Belanja APBD
      case "Belanja APBD":
        navigate("/keuangan/belanja-apbd");
        break;
      case "Daftar Belanja":
        navigate("/keuangan/belanja-apbd/daftar-belanja");
        break;
      case "Item Belanja":
        navigate("/keuangan/belanja-apbd/item-belanja");
        break;
      case "Posting Belanja":
        navigate("/keuangan/belanja-apbd/posting-belanja");
        break;
      // Mutasi
      case "Mutasi":
        navigate("/keuangan/mutasi");
        break;
      case "Daftar Mutasi":
        navigate("/keuangan/mutasi/daftar-mutasi");
        break;
      case "Item Mutasi":
        navigate("/keuangan/mutasi/item-mutasi");
        break;
      case "Posting Mutasi":
        navigate("/keuangan/mutasi/posting-mutasi");
        break;
      // Hibah
      case "Hibah":
        navigate("/keuangan/hibah");
        break;
      case "Daftar Hibah":
        navigate("/keuangan/hibah/daftar-hibah");
        break;
      case "Item Hibah":
        navigate("/keuangan/hibah/item-hibah");
        break;
      case "Posting Hibah":
        navigate("/keuangan/hibah/posting-hibah");
        break;
      // Keuangan End

      // Laporan Start
      case "Laporan":
        navigate("/laporan");
        break;
      // Laporan Rekonsiliasi
      case "Laporan Rekonsiliasi":
        navigate("/laporan/laporan-rekonsiliasi");
        break;
      case "Laporan per UPB":
        navigate("/laporan/laporan-rekonsiliasi/laporan-per-upb");
        break;
      case "Belanja APBD per UPB":
        navigate(
          "/laporan/laporan-rekonsiliasi/laporan-per-upb/belanja-apbd-per-upb"
        );
        break;
      case "Rekap Belanja APBD per UPB":
        navigate(
          "/laporan/laporan-rekonsiliasi/laporan-per-upb/rekap-belanja-apbd-per-upb"
        );
        break;
      case "Mutasi per UPB":
        navigate(
          "/laporan/laporan-rekonsiliasi/laporan-per-upb/mutasi-per-upb"
        );
        break;
      case "Rekap Mutasi per UPB":
        navigate(
          "/laporan/laporan-rekonsiliasi/laporan-per-upb/rekap-mutasi-per-upb"
        );
        break;
      case "Rekap Rekonsiliasi":
        navigate("/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi");
        break;
      case "Rekap Rekonsiliasi UPB":
        navigate(
          "/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi/rekonsiliasi-upb"
        );
        break;
      case "Rekap Seluruh Rekonsiliasi":
        navigate(
          "/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi/seluruh-rekonsiliasi"
        );
        break;
      case "Rekap KIB":
        navigate("/laporan/laporan-rekonsiliasi/rekap-kib");
        break;
      case "Rekap KIB A 47":
        navigate("/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-a-47");
        break;
      case "Rekap KIB B 47":
        navigate("/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-b-47");
        break;
      case "Rekap KIB C 47":
        navigate("/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-c-47");
        break;
      case "Rekap KIB D 47":
        navigate("/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-d-47");
        break;
      case "Rekap KIB E 47":
        navigate("/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-e-47");
        break;
      case "Rekap KIB F 47":
        navigate("/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-f-47");
        break;
      case "Rekap Saldo (awal dan akhir)":
        navigate("/laporan/laporan-rekonsiliasi/rekap-saldo");
        break;
      case "Rekap Saldo Awal":
        navigate("/laporan/laporan-rekonsiliasi/rekap-saldo/saldo-awal");
        break;
      case "Rekap Saldo Akhir":
        navigate("/laporan/laporan-rekonsiliasi/rekap-saldo/saldo-akhir");
        break;
      // Laporan Hibah
      case "Laporan Hibah":
        navigate("/laporan/laporan-hibah");
        break;
      case "Hibah per UPB":
        navigate("/laporan/laporan-hibah/hibah-per-upb");
        break;
      case "Rekapitulasi Hibah":
        navigate("/laporan/laporan-hibah/rekapitulasi-hibah");
        break;
      case "Rekapitulasi Hibah per UPB":
        navigate(
          "/laporan/laporan-hibah/rekapitulasi-hibah/rekapitulasi-hibah-per-upb"
        );
        break;
      case "Rekapitulasi Seluruh Hibah":
        navigate(
          "/laporan/laporan-hibah/rekapitulasi-hibah/rekapitulasi-seluruh-hibah"
        );
        break;
      case "Rincian Hibah":
        navigate("/laporan/laporan-hibah/rincian-hibah");
        break;
      case "Rincian Realisasi Anggaran":
        navigate(
          "/laporan/laporan-hibah/rincian-hibah/rincian-realisasi-anggaran"
        );
        break;
      case "Rincian sudah diadministrasi":
        navigate(
          "/laporan/laporan-hibah/rincian-hibah/rincian-sudah-diadministrasi"
        );
        break;
      case "Rincian belum diadministrasi":
        navigate(
          "/laporan/laporan-hibah/rincian-hibah/rincian-belum-diadministrasi"
        );
        break;
      case "Rekap Hibah":
        navigate("/laporan/laporan-hibah/rekap-hibah");
        break;
      case "Rekap Administrasi Hibah":
        navigate("/laporan/laporan-hibah/rekap-hibah/rekap-administrasi-hibah");
        break;
      case "Rekap Hibah UPB":
        navigate("/laporan/laporan-hibah/rekap-hibah/rekap-hibah-upb");
        break;
      case "Rekap Hibah SKPD":
        navigate("/laporan/laporan-hibah/rekap-hibah/rekap-hibah-skpd");
        break;
      // LRA vs BM
      case "LRA VS BM":
        navigate("/laporan/lra-vs-bm");
        break;
      case "LRA VS BM UPB":
        navigate("/laporan/lra-vs-bm/upb");
        break;
      case "LRA VS BM SKPD":
        navigate("/laporan/lra-vs-bm/skpd");
        break;
      // Laporan End

      // Pengaturan Start
      case "Pengaturan":
        navigate("/pengaturan");
        break;
      case "Group":
        navigate("/pengaturan/group");
        break;
      case "Pengguna":
        navigate("/pengaturan/pengguna");
        break;
      case "Sistem":
        navigate("/pengaturan/sistem");
        break;
      case "Updating Data":
        navigate("/pengaturan/updating-data");
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
