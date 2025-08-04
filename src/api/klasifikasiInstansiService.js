// src/api/klasifikasiInstansiService.js
import api from "./axios";

/* ========================== */
/* PROVINSI          */
/* ========================== */
export const getProvinsiOptions = async () => {
  try {
    // Endpoint ini diasumsikan mengembalikan semua data tanpa paginasi
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

/* ========================== */
/* KABUPATEN/KOTA      */
/* ========================== */
export const getKabupatenOptions = async () => {
  try {
    const res = await api.get("/klasifikasi-instansi/kabupaten-kota/all");
    return res.data.map((kab) => ({
      value: kab.id,
      label: `${kab.kode_kabupaten_kota} - ${kab.nama_kabupaten_kota}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data kabupaten/kota:", error);
    return [];
  }
};

export const getKabupatenByProvinsi = async (provId) => {
  try {
    const res = await api.get(
      `/klasifikasi-instansi/kabupaten-kota/by-provinsi/${provId}`
    );
    return res.data.map((kab) => ({
      value: kab.id,
      label: `${kab.kode_kabupaten_kota} - ${kab.nama_kabupaten_kota}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil kabupaten dari provinsi ${provId}:`, error);
    return [];
  }
};

/* ========================== */
/* BIDANG           */
/* ========================== */
export const getBidangOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-instansi/bidang", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((bid) => ({
      value: bid.id,
      label: `${bid.kode_bidang} - ${bid.nama_bidang}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data bidang:", error);
    return [];
  }
};

export const getBidangByKabupaten = async (kabId) => {
  try {
    const res = await api.get(
      `/klasifikasi-instansi/bidang/by-kabupaten-kota/${kabId}`
    );
    return res.data.map((bid) => ({
      value: bid.id,
      label: `${bid.kode_bidang} - ${bid.nama_bidang}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil bidang dari kabupaten ${kabId}:`, error);
    return [];
  }
};

// --- BIDANG CRUD ---
export const getBidangs = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-instansi/bidang", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data bidang:", error);
    throw error;
  }
};

export const createBidang = async (data) => {
  try {
    const res = await api.post("/klasifikasi-instansi/bidang", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat bidang:", error);
    throw error;
  }
};

export const updateBidang = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-instansi/bidang/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui bidang ${id}:`, error);
    throw error;
  }
};

export const deleteBidang = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-instansi/bidang/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus bidang ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* UNIT            */
/* ========================== */
export const getUnitOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-instansi/unit", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((unit) => ({
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
    console.error(`Gagal mengambil unit dari bidang ${bidangId}:`, error);
    return [];
  }
};

// --- UNIT CRUD ---
export const getUnits = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-instansi/unit", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data unit:", error);
    throw error;
  }
};

export const createUnit = async (data) => {
  try {
    const res = await api.post("/klasifikasi-instansi/unit", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat unit:", error);
    throw error;
  }
};

export const updateUnit = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-instansi/unit/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui unit ${id}:`, error);
    throw error;
  }
};

export const deleteUnit = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-instansi/unit/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus unit ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* SUB UNIT          */
/* ========================== */
export const getSubUnitOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-instansi/subunit", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((sub) => ({
      value: sub.id,
      label: `${sub.kode_sub_unit} - ${sub.nama_sub_unit}`,
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
    return res.data.map((sub) => ({
      value: sub.id,
      label: `${sub.kode_sub_unit} - ${sub.nama_sub_unit}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil subunit dari unit ${unitId}:`, error);
    return [];
  }
};

// --- SUB UNIT CRUD ---
export const getSubUnits = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-instansi/subunit", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data subunit:", error);
    throw error;
  }
};

export const createSubUnit = async (data) => {
  try {
    const res = await api.post("/klasifikasi-instansi/subunit", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat subunit:", error);
    throw error;
  }
};

export const updateSubUnit = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-instansi/subunit/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui subunit ${id}:`, error);
    throw error;
  }
};

export const deleteSubUnit = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-instansi/subunit/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus subunit ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* UPB            */
/* ========================== */
export const getUpbOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-instansi/upb", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((upb) => ({
      value: upb.id,
      label: `${upb.kode_upb} - ${upb.nama_upb}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data UPB:", error);
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
    console.error(`Gagal mengambil UPB dari subunit ${subUnitId}:`, error);
    return [];
  }
};

// --- UPB CRUD ---
export const getUpbs = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-instansi/upb", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data upb:", error);
    throw error;
  }
};

export const createUpb = async (data) => {
  try {
    const res = await api.post("/klasifikasi-instansi/upb", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat upb:", error);
    throw error;
  }
};

export const updateUpb = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-instansi/upb/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui upb ${id}:`, error);
    throw error;
  }
};

export const deleteUpb = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-instansi/upb/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus upb ${id}:`, error);
    throw error;
  }
};
