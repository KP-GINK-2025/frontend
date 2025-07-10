import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

// Klasifikasi Start
import KlasifikasiPage from "./pages/klasifikasi/KlasifikasiPage";
// Klasifikasi Instansi Start
import KlasifikasiInstansiPage from "./pages/klasifikasi/klasifikasi-instansi/KlasifikasiInstansiPage";
import BidangPage from "./pages/klasifikasi/klasifikasi-instansi/bidang/BidangPage";
import UnitPage from "./pages/klasifikasi/klasifikasi-instansi/unit/UnitPage";
import SubUnitPage from "./pages/klasifikasi/klasifikasi-instansi/subunit/SubUnitPage";
import UpbPage from "./pages/klasifikasi/klasifikasi-instansi/upb/UpbPage";

// Klasifikasi Aset Start
import KlasifikasiAsetPage from "./pages/klasifikasi/klasifikasi-aset/KlasifikasiAsetPage";
import AkunPage from "./pages/klasifikasi/klasifikasi-aset/akun/AkunPage";
import KelompokPage from "./pages/klasifikasi/klasifikasi-aset/kelompok/KelompokPage";
import JenisPage from "./pages/klasifikasi/klasifikasi-aset/jenis/JenisPage";
import ObjekPage from "./pages/klasifikasi/klasifikasi-aset/objek/ObjekPage";
import RincianObjekPage from "./pages/klasifikasi/klasifikasi-aset/rincian-objek/RincianObjekPage";
import SubRincianPage from "./pages/klasifikasi/klasifikasi-aset/sub-rincian/SubRincianPage";
import SubSubRincianPage from "./pages/klasifikasi/klasifikasi-aset/sub-sub-rincian/SubSubRincianPage";
// Klasifikasi End

import DataRuangPage from "./pages/data-ruang/DataRuangPage";
import SaldoAwalPage from "./pages/saldo-awal/SaldoAwalPage";
import LraPage from "./pages/lra/LraPage";

// Keuangan Start
import KeuanganPage from "./pages/keuangan/KeuanganPage";
// Keuangan belanja-apbd Start
import BelanjaApbdPage from "./pages/keuangan/belanja-apbd/BelanjaApbdPage";
import DaftarBelanjaPage from "./pages/keuangan/belanja-apbd/daftar-belanja/DaftarBelanjaPage";
import ItemBelanjaPage from "./pages/keuangan/belanja-apbd/item-belanja/ItemBelanjaPage";
import PostingBelanjaPage from "./pages/keuangan/belanja-apbd/posting-belanja/PostingBelanjaPage";
// Keuangan hibah Start
import HibahPage from "./pages/keuangan/hibah/HibahPage";
import DaftarHibahPage from "./pages/keuangan/hibah/daftar-hibah/DaftarHibahPage";
import ItemHibahPage from "./pages/keuangan/hibah/item-hibah/ItemHibahPage";
import PostingHibahPage from "./pages/keuangan/hibah/posting-hibah/PostingHibahPage";
// Keuangan mutasi Start
import MutasiPage from "./pages/keuangan/mutasi/MutasiPage";
import DaftarMutasiPage from "./pages/keuangan/mutasi/daftar-mutasi/DaftarMutasiPage";
import ItemMutasiPage from "./pages/keuangan/mutasi/item-mutasi/ItemMutasiPage";
import PostingMutasiPage from "./pages/keuangan/mutasi/posting-mutasi/PostingMutasiPage";
// Keuangan End

// Laporan Start
import LaporanPage from "./pages/laporan/LaporanPage";

import LaporanRekonsiliasiPage from "./pages/laporan/laporan-rekonsiliasi/LaporanRekonsiliasiPage";
import LaporanPerUpbPage from "./pages/laporan/laporan-rekonsiliasi/laporan-per-upb/LaporanPerUpbPage";
import BelanjaApbdPerUpbPage from "./pages/laporan/laporan-rekonsiliasi/laporan-per-upb/BelanjaApbdPerUpbPage";
import RekapBelanjaApbdPerUpbPage from "./pages/laporan/laporan-rekonsiliasi/laporan-per-upb/RekapBelanjaApbdPerUpbPage";
import MutasiPerUpbPage from "./pages/laporan/laporan-rekonsiliasi/laporan-per-upb/MutasiPerUpbPage";
import RekapMutasiPerUpbPage from "./pages/laporan/laporan-rekonsiliasi/laporan-per-upb/RekapMutasiPerUpbPage";
import RekapRekonsiliasiPage from "./pages/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi/RekapRekonsiliasiPage";
import RekapRekonsiliasiUpbPage from "./pages/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi/RekapRekonsiliasiUpbPage";
import RekapSeluruhRekonsiliasiPage from "./pages/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi/RekapSeluruhRekonsiliasiPage";
import RekapKibPage from "./pages/laporan/laporan-rekonsiliasi/rekap-kib/RekapKibPage";
import RekapKibA47Page from "./pages/laporan/laporan-rekonsiliasi/rekap-kib/RekapKibA47Page";
import RekapKibB47Page from "./pages/laporan/laporan-rekonsiliasi/rekap-kib/RekapKibB47Page";
import RekapKibC47Page from "./pages/laporan/laporan-rekonsiliasi/rekap-kib/RekapKibC47Page";
import RekapKibD47Page from "./pages/laporan/laporan-rekonsiliasi/rekap-kib/RekapKibD47Page";
import RekapKibE47Page from "./pages/laporan/laporan-rekonsiliasi/rekap-kib/RekapKibE47Page";
import RekapKibF47Page from "./pages/laporan/laporan-rekonsiliasi/rekap-kib/RekapKibF47Page";
import RekapSaldoPage from "./pages/laporan/laporan-rekonsiliasi/rekap-saldo/RekapSaldoPage";
import RekapSaldoAwalPage from "./pages/laporan/laporan-rekonsiliasi/rekap-saldo/RekapSaldoAwalPage";
import RekapSaldoAkhirPage from "./pages/laporan/laporan-rekonsiliasi/rekap-saldo/RekapSaldoAkhirPage";

import LaporanHibahPage from "./pages/laporan/laporan-hibah/LaporanHibahPage";
import HibahPerUpbPage from "./pages/laporan/laporan-hibah/hibah-per-upb/HibahPerUpbPage";

import RekapHibahPage from "./pages/laporan/laporan-hibah/rekap-hibah/RekapHibahPage";
import RekapAdministrasiHibahPage from "./pages/laporan/laporan-hibah/rekap-hibah/administrasi/RekapAdministrasiHibahPage";
import RekapHibahUpbPage from "./pages/laporan/laporan-hibah/rekap-hibah/upb/RekapHibahUpbPage";
import RekapHibahSkpdPage from "./pages/laporan/laporan-hibah/rekap-hibah/skpd/RekapHibahSkpdPage";

import RekapitulasiHibahPage from "./pages/laporan/laporan-hibah/rekapitulasi-hibah/RekapitulasiHibahPage";
import RekapitulasiHibahPerUpbPage from "./pages/laporan/laporan-hibah/rekapitulasi-hibah/rekapitulasi-per-upb/RekapitulasiHibahPerUpbPage";
import RekapitulasiSeluruhHibahPage from "./pages/laporan/laporan-hibah/rekapitulasi-hibah/rekapitulasi-seluruh/RekapitulasiSeluruhHibahPage";

import RincianHibahPage from "./pages/laporan/laporan-hibah/rincian-hibah/RincianHibahPage";
import RincianRealisasiAnggaranPage from "./pages/laporan/laporan-hibah/rincian-hibah/realisasi-anggaran/RincianRealisasiAnggaranPage";
import RincianSudahDiadministrasiPage from "./pages/laporan/laporan-hibah/rincian-hibah/sudah-administrasi/RincianSudahDiadministrasiPage";
import RincianBelumDiadministrasiPage from "./pages/laporan/laporan-hibah/rincian-hibah/belum-administrasi/RincianBelumDiadministrasiPage";
// LaporanHibah End

import LraVsBmPage from "./pages/laporan/lra-vs-bm/LraVsBmPage";
import LraVsBmSkpdPage from "./pages/laporan/lra-vs-bm/skpd/LraVsBmSkpdPage";
import LraVsBmUpbPage from "./pages/laporan/lra-vs-bm/upb/LraVsBmUpbPage";
// Laporan End

// Pengaturan Start
import PengaturanPage from "./pages/pengaturan/PengaturanPage";
import GroupPage from "./pages/pengaturan/group/GroupPage";
import PenggunaPage from "./pages/pengaturan/pengguna/PenggunaPage";
import UpdatingDataPage from "./pages/pengaturan/updating-data/UpdatingDataPage";
import SistemPage from "./pages/pengaturan/sistem/SistemPage";
// Pengaturan End

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Klasifikasi Start */}
        <Route path="/klasifikasi" element={<KlasifikasiPage />} />
        {/* Klasifikasi Instansi */}
        <Route
          path="/klasifikasi/instansi"
          element={<KlasifikasiInstansiPage />}
        />
        <Route path="/klasifikasi/instansi/bidang" element={<BidangPage />} />
        <Route path="/klasifikasi/instansi/unit" element={<UnitPage />} />
        <Route
          path="/klasifikasi/instansi/sub-unit"
          element={<SubUnitPage />}
        />
        <Route path="/klasifikasi/instansi/upb" element={<UpbPage />} />
        {/* Klasifikasi Aset */}
        <Route path="/klasifikasi/aset" element={<KlasifikasiAsetPage />} />
        <Route path="/klasifikasi/aset/akun" element={<AkunPage />} />
        <Route path="/klasifikasi/aset/kelompok" element={<KelompokPage />} />
        <Route path="/klasifikasi/aset/jenis" element={<JenisPage />} />
        <Route path="/klasifikasi/aset/objek" element={<ObjekPage />} />
        <Route
          path="/klasifikasi/aset/rincian-objek"
          element={<RincianObjekPage />}
        />
        <Route
          path="/klasifikasi/aset/sub-rincian"
          element={<SubRincianPage />}
        />
        <Route
          path="/klasifikasi/aset/sub-sub-rincian"
          element={<SubSubRincianPage />}
        />
        {/* Klasifikasi End */}

        {/* Data Ruang */}
        <Route path="/data-ruang" element={<DataRuangPage />} />
        {/* Saldo Awal */}
        <Route path="/saldo-awal" element={<SaldoAwalPage />} />
        {/* LRA */}
        <Route path="/lra" element={<LraPage />} />

        {/* Keuangan Start */}
        <Route path="/keuangan" element={<KeuanganPage />} />
        {/* Belanja APBD */}
        <Route path="/keuangan/belanja-apbd" element={<BelanjaApbdPage />} />
        <Route
          path="/keuangan/belanja-apbd/daftar-belanja"
          element={<DaftarBelanjaPage />}
        />
        <Route
          path="/keuangan/belanja-apbd/item-belanja"
          element={<ItemBelanjaPage />}
        />
        <Route
          path="/keuangan/belanja-apbd/posting-belanja"
          element={<PostingBelanjaPage />}
        />
        {/* Mutasi */}
        <Route path="/keuangan/mutasi" element={<MutasiPage />} />
        <Route
          path="/keuangan/mutasi/daftar-mutasi"
          element={<DaftarMutasiPage />}
        />
        <Route
          path="/keuangan/mutasi/item-mutasi"
          element={<ItemMutasiPage />}
        />
        <Route
          path="/keuangan/mutasi/posting-mutasi"
          element={<PostingMutasiPage />}
        />
        {/* Hibah */}
        <Route path="/keuangan/hibah" element={<HibahPage />} />
        <Route
          path="/keuangan/hibah/daftar-hibah"
          element={<DaftarHibahPage />}
        />
        <Route path="/keuangan/hibah/item-hibah" element={<ItemHibahPage />} />
        <Route
          path="/keuangan/hibah/posting-hibah"
          element={<PostingHibahPage />}
        />
        {/* Keuangan End */}

        {/* Laporan Start */}
        <Route path="/laporan" element={<LaporanPage />} />
        {/* Laporan Rekonsiliasi */}

        <Route
          path="/laporan/laporan-rekonsiliasi"
          element={<LaporanRekonsiliasiPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/laporan-per-upb"
          element={<LaporanPerUpbPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/laporan-per-upb/belanja-apbd-per-upb"
          element={<BelanjaApbdPerUpbPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/laporan-per-upb/rekap-belanja-apbd-per-upb"
          element={<RekapBelanjaApbdPerUpbPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/laporan-per-upb/mutasi-per-upb"
          element={<MutasiPerUpbPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/laporan-per-upb/rekap-mutasi-per-upb"
          element={<RekapMutasiPerUpbPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi"
          element={<RekapRekonsiliasiPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi/rekonsiliasi-upb"
          element={<RekapRekonsiliasiUpbPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-rekonsiliasi/seluruh-rekonsiliasi"
          element={<RekapSeluruhRekonsiliasiPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-kib"
          element={<RekapKibPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-a-47"
          element={<RekapKibA47Page />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-b-47"
          element={<RekapKibB47Page />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-c-47"
          element={<RekapKibC47Page />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-d-47"
          element={<RekapKibD47Page />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-e-47"
          element={<RekapKibE47Page />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-kib/rekap-kib-f-47"
          element={<RekapKibF47Page />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-saldo"
          element={<RekapSaldoPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-saldo/saldo-awal"
          element={<RekapSaldoAwalPage />}
        />
        <Route
          path="/laporan/laporan-rekonsiliasi/rekap-saldo/saldo-akhir"
          element={<RekapSaldoAkhirPage />}
        />

        {/* Laporan Hibah */}
        <Route path="/laporan/laporan-hibah" element={<LaporanHibahPage />} />
        <Route
          path="/laporan/laporan-hibah/hibah-per-upb"
          element={<HibahPerUpbPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rekapitulasi-hibah"
          element={<RekapitulasiHibahPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rekapitulasi-hibah/rekapitulasi-hibah-per-upb"
          element={<RekapitulasiHibahPerUpbPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rekapitulasi-hibah/rekapitulasi-seluruh-hibah"
          element={<RekapitulasiSeluruhHibahPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rincian-hibah"
          element={<RincianHibahPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rincian-hibah/rincian-realisasi-anggaran"
          element={<RincianRealisasiAnggaranPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rincian-hibah/rincian-sudah-diadministrasi"
          element={<RincianSudahDiadministrasiPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rincian-hibah/rincian-belum-diadministrasi"
          element={<RincianBelumDiadministrasiPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rekap-hibah"
          element={<RekapHibahPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rekap-hibah/rekap-administrasi-hibah"
          element={<RekapAdministrasiHibahPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rekap-hibah/rekap-hibah-upb"
          element={<RekapHibahUpbPage />}
        />
        <Route
          path="/laporan/laporan-hibah/rekap-hibah/rekap-hibah-skpd"
          element={<RekapHibahSkpdPage />}
        />
        {/* Laporan LRA vs BM */}
        <Route path="/laporan/lra-vs-bm" element={<LraVsBmPage />} />
        <Route path="/laporan/lra-vs-bm/upb" element={<LraVsBmUpbPage />} />
        <Route path="/laporan/lra-vs-bm/skpd" element={<LraVsBmSkpdPage />} />
        {/* Laporan End */}

        {/* Pengaturan Start */}
        <Route path="/pengaturan" element={<PengaturanPage />} />
        <Route path="/pengaturan/group" element={<GroupPage />} />
        <Route path="/pengaturan/pengguna" element={<PenggunaPage />} />
        <Route path="/pengaturan/updating-data" element={<UpdatingDataPage />} />
        <Route path="/pengaturan/sistem" element={<SistemPage />} />
        {/* Pengaturan End */}
      </Routes>
    </Router>
  );
}

export default App;
