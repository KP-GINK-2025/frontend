import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation(); // Hook untuk mendapatkan informasi lokasi URL saat ini
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x.toLowerCase() !== "dashboard");
  // Memecah pathname menjadi bagian-bagian

  // Fungsi untuk mengonversi slug path menjadi teks yang rapi (contoh: "data-ruang" menjadi "Data Ruang")
  const formatBreadcrumbText = (slug) => {
    // Anda bisa menambahkan logika kustom di sini jika ada nama yang sangat berbeda
    switch (slug) {
      case "dashboard":
        return "Dashboard";
      case "klasifikasi":
        return "Klasifikasi";
      case "instansi":
        return "Instansi";
      case "upb":
        return "UPB";
      case "aset":
        return "Aset";

      case "data-ruang":
        return "Data Ruang";
      case "saldo-awal":
        return "Saldo Awal";
      case "lra":
        return "LRA";

      case "keuangan":
        return "Keuangan";
      case "belanja-apbd":
        return "Belanja APBD";

      case "laporan":
        return "Laporan";
      case "laporan-per-upb":
        return "Laporan per UPB";
      case "belanja-apbd-per-upb":
        return "Belanja APBD per UPB";
      case "rekap-belanja-apbd-per-upb":
        return "Rekap Belanja APBD per UPB";
      case "mutasi-per-upb":
        return "Mutasi per UPB";
      case "rekap-mutasi-per-upb":
        return "Rekap Mutasi per UPB";

      case "rekonsiliasi-upb":
        return "Rekonsiliasi UPB";

      case "rekap-kib":
        return "Rekap KIB";
      case "rekap-kib-a-47":
        return "Rekap KIB A 47";
      case "rekap-kib-b-47":
        return "Rekap KIB B 47";
      case "rekap-kib-c-47":
        return "Rekap KIB C 47";
      case "rekap-kib-d-47":
        return "Rekap KIB D 47";
      case "rekap-kib-e-47":
        return "Rekap KIB E 47";
      case "rekap-kib-f-47":
        return "Rekap KIB F 47";

      case "hibah-per-upb":
        return "Hibah per UPB";
      case "rekapitulasi-hibah-per-upb":
        return "Rekapitulasi Hibah per UPB";
      case "rekap-hibah-upb":
        return "Rekap Hibah UPB";
      case "rekap-hibah-skpd":
        return "Rekap Hibah SKPD";

      case "lra-vs-bm":
        return "LRA VS BM";
      case "skpd":
        return "SKPD";

      case "pengaturan":
        return "Pengaturan";
      default:
        // Mengubah "some-page-name" menjadi "Some Page Name"
        return slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  return (
    <nav className="flex flex-wrap select-none" aria-label="Breadcrumb">
      <ol className="inline-flex flex-wrap items-center gap-x-1 gap-y-2 md:gap-x-2">
        {/* Item Home / Root */}
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#B53C3C] dark:text-gray-400 dark:hover:text[#B53C3C]"
          >
            <svg
              className="w-3 h-3 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            Dashboard
          </Link>
        </li>

        {/* Dynamic Breadcrumb Items */}
        {pathnames.length > 0 &&
          pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li key={name} aria-current={isLast ? "page" : undefined}>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  {isLast ? (
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                      {formatBreadcrumbText(name)}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="ms-1 text-sm font-medium text-gray-700 hover:text-[#B53C3C] md:ms-2 dark:text-gray-400 dark:hover:text[#B53C3C]"
                    >
                      {formatBreadcrumbText(name)}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
