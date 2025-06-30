import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import KlasifikasiPage from "./pages/klasifikasi/KlasifikasiPage";
import KlasifikasiInstansiPage from "./pages/klasifikasi/klasifikasi-instansi/KlasifikasiInstansiPage";
import BidangPage from "./pages/klasifikasi/klasifikasi-instansi/bidang/BidangPage";
import UnitPage from "./pages/klasifikasi/klasifikasi-instansi/unit/UnitPage";
import SubUnitPage from "./pages/klasifikasi/klasifikasi-instansi/subunit/SubUnitPage";
import UpbPage from "./pages/klasifikasi/klasifikasi-instansi/upb/UpbPage";
import KlasifikasiAsetPage from "./pages/klasifikasi/klasifikasi-aset/KlasifikasiAsetPage";
import AkunPage from "./pages/klasifikasi/klasifikasi-aset/akun/AkunPage";
import KelompokPage from "./pages/klasifikasi/klasifikasi-aset/kelompok/KelompokPage";
import JenisPage from "./pages/klasifikasi/klasifikasi-aset/jenis/JenisPage";
import ObjekPage from "./pages/klasifikasi/klasifikasi-aset/objek/ObjekPage";
import RincianObjekPage from "./pages/klasifikasi/klasifikasi-aset/rincian-objek/RincianObjekPage";
import SubRincianPage from "./pages/klasifikasi/klasifikasi-aset/sub-rincian/SubRincianPage";
import SubSubRincianPage from "./pages/klasifikasi/klasifikasi-aset/sub-sub-rincian/SubSubRincianPage";
import DataRuangPage from "./pages/data-ruang/DataRuangPage";
import SaldoAwalPage from "./pages/saldo-awal/SaldoAwalPage";
import LraPage from "./pages/lra/LraPage";
import KeuanganPage from "./pages/keuangan/KeuanganPage";
import LaporanPage from "./pages/laporan/LaporanPage";
import PengaturanPage from "./pages/pengaturan/PengaturanPage";

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
        {/* Keuangan End */}

        {/* Laporan Start */}
        <Route path="/laporan" element={<LaporanPage />} />
        {/* Laporan End */}

        {/* Pengaturan Start */}
        <Route path="/pengaturan" element={<PengaturanPage />} />
        {/* Pengaturan End */}
      </Routes>
    </Router>
  );
}

export default App;
