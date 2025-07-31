// src/api/klasifikasiInstansiService.js
import api from "./axios";

// KLASIFIKASI INSTANSI
export const getProvinsi = async () => {
  try {
    const res = await api.get("/klasifikasi-instansi/provinsi/all");
    return res.data.map((prov) => ({
      value: prov.id,
      label: `${prov.kode_provinsi} - ${prov.nama_provinsi}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data provinsi:", error);
    return [];
  }
};

export const getKabupaten = async () => {
  try {
    const res = await api.get("/klasifikasi-instansi/kabupaten-kota/all");
    return res.data.map((kab) => ({
      value: kab.id,
      label: `${kab.kode_kabupaten_kota} - ${kab.nama_kabupaten_kota}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data kabkot:", error);
    return [];
  }
};

export const getKabupatenByProvinsi = async (provinsiId) => {
  try {
    const res = await api.get(
      `/klasifikasi-instansi/kabupaten-kota/by-provinsi/${provinsiId}`
    );
    return res.data.map((kab) => ({
      value: kab.id,
      label: `${kab.kode_kabupaten_kota} - ${kab.nama_kabupaten_kota}`,
    }));
  } catch (error) {
    console.error(
      `Gagal mengambil data kabkot dari provinsi ${provinsiId}:`,
      error
    );
    return [];
  }
};

export const getBidang = async () => {
  try {
    const res = await api.get("/klasifikasi-instansi/bidang");
    return res.data.data.map((bidang) => ({
      value: bidang.id,
      label: `${bidang.kode_bidang} - ${bidang.nama_bidang}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data bidang:", error);
    return [];
  }
};

export const getBidangByKabKot = async (kabKotId) => {
  try {
    const res = await api.get(
      `/klasifikasi-instansi/bidang/by-kabupaten-kota/${kabKotId}`
    );
    return res.data.map((bidang) => ({
      value: bidang.id,
      label: `${bidang.kode_bidang} - ${bidang.nama_bidang}`,
    }));
  } catch (error) {
    console.error(
      `Gagal mengambil data bidang dari kabkot ${kabKotId}:`,
      error
    );
    return [];
  }
};

export const getUnit = async () => {
  try {
    const res = await api.get("/klasifikasi-instansi/unit");
    return res.data.data.map((unit) => ({
      value: unit.id,
      label: `${unit.kode_unit} - ${unit.nama_unit}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data unit:", error);
    return [];
  }
};

export const getUnitByBidang = async (bidangId) => {
  try {
    const res = await api.get(
      `/klasifikasi-instansi/unit/by-bidang/${bidangId}`
    );
    return res.data.map((unit) => ({
      value: unit.id,
      label: `${unit.kode_unit} - ${unit.nama_unit}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil data unit dari bidang ${bidangId}:`, error);
    return [];
  }
};

export const getSubUnit = async () => {
  try {
    const res = await api.get("/klasifikasi-instansi/subunit");
    return res.data.data.map((subUnit) => ({
      value: subUnit.id,
      label: `${subUnit.kode_sub_unit} - ${subUnit.nama_sub_unit}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data subunit:", error);
    return [];
  }
};

export const getSubUnitByUnit = async (unitId) => {
  try {
    const res = await api.get(
      `/klasifikasi-instansi/subunit/by-unit/${unitId}`
    );
    return res.data.map((subUnit) => ({
      value: subUnit.id,
      label: `${subUnit.kode_sub_unit} - ${subUnit.nama_sub_unit}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil data subunit dari unit ${unitId}:`, error);
    return [];
  }
};

export const getUpb = async () => {
  try {
    const res = await api.get("/klasifikasi-instansi/upb");
    return res.data.data.map((upb) => ({
      value: upb.id,
      label: `${upb.kode_upb} - ${upb.nama_upb}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data upb:", error);
    return [];
  }
};

export const getUpbBySubUnit = async (subUnitId) => {
  try {
    const res = await api.get(
      `/klasifikasi-instansi/upb/by-sub-unit/${subUnitId}`
    );
    return res.data.map((upb) => ({
      value: upb.id,
      label: `${upb.kode_upb} - ${upb.nama_upb}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil data upb dari subunit ${subUnitId}:`, error);
    return [];
  }
};
// KLASIFIKASI INSTANSI
