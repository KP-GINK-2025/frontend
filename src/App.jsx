import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import KlasifikasiPage from "./pages/klasifikasi/KlasifikasiPage";
import KlasifikasiInstansiPage from "./pages/klasifikasi/klasifikasi-instansi/KlasifikasiInstansiPage";
import BidangPage from "./pages/klasifikasi/klasifikasi-instansi/BidangPage";
import UnitPage from "./pages/klasifikasi/klasifikasi-instansi/UnitPage";
import SubUnitPage from "./pages/klasifikasi/klasifikasi-instansi/SubUnitPage";
import UpbPage from "./pages/klasifikasi/klasifikasi-instansi/UpbPage";
import KlasifikasiAsetPage from "./pages/klasifikasi/klasifikasi-aset/KlasifikasiAsetPage";
import AkunPage from "./pages/klasifikasi/klasifikasi-aset/AkunPage";
import KelompokPage from "./pages/klasifikasi/klasifikasi-aset/KelompokPage";
import JenisPage from "./pages/klasifikasi/klasifikasi-aset/JenisPage";
import ObjekPage from "./pages/klasifikasi/klasifikasi-aset/ObjekPage";
import RincianObjekPage from "./pages/klasifikasi/klasifikasi-aset/RincianObjekPage";
import SubRincianPage from "./pages/klasifikasi/klasifikasi-aset/SubRincianPage";
import SubSubRincianPage from "./pages/klasifikasi/klasifikasi-aset/SubSubRincianPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/klasifikasi" element={<KlasifikasiPage />} />

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
      </Routes>
    </Router>
  );
}

export default App;
