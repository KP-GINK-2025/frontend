// src/api/service/klasifikasiInstansiService.js
import api from "../axios";

/* ========================== */
/* AKUN ASET           */
/* ========================== */
export const getAkunOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-aset/akun-aset", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((akun) => ({
      value: akun.id,
      label: `${akun.kode_akun_aset} - ${akun.nama_akun_aset}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data akun:", error);
    return [];
  }
};

// --- AKUN CRUD ---
export const getAkuns = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-aset/akun-aset", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data akun:", error);
    throw error;
  }
};

export const createAkun = async (data) => {
  try {
    const res = await api.post("/klasifikasi-aset/akun-aset", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat akun:", error);
    throw error;
  }
};

export const updateAkun = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-aset/akun-aset/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui akun ${id}:`, error);
    throw error;
  }
};

export const deleteAkun = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-aset/akun-aset/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus akun ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* KELOMPOK ASET           */
/* ========================== */
export const getKelompokOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-aset/kelompok-aset", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((kelompok) => ({
      value: kelompok.id,
      label: `${kelompok.kode_kelompok_aset} - ${kelompok.nama_kelompok_aset}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data kelompok:", error);
    return [];
  }
};

export const getKelompokByAkun = async (akunId) => {
  try {
    const res = await api.get(
      `/klasifikasi-aset/kelompok-aset/by-akun-aset/${akunId}`
    );
    return res.data.map((kelompok) => ({
      value: kelompok.id,
      label: `${kelompok.kode_kelompok_aset} - ${kelompok.nama_kelompok_aset}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil kelompok dari akun ${akunId}:`, error);
    return [];
  }
};

// --- KELOMPOK CRUD ---
export const getKelompoks = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-aset/kelompok-aset", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data kelompok:", error);
    throw error;
  }
};

export const createKelompok = async (data) => {
  try {
    const res = await api.post("/klasifikasi-aset/kelompok-aset", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat kelompok:", error);
    throw error;
  }
};

export const updateKelompok = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-aset/kelompok-aset/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui kelompok ${id}:`, error);
    throw error;
  }
};

export const deleteKelompok = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-aset/kelompok-aset/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus kelompok ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* JENIS ASET           */
/* ========================== */
export const getJenisOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-aset/jenis-aset", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((jenis) => ({
      value: jenis.id,
      label: `${jenis.kode_jenis_aset} - ${jenis.nama_jenis_aset}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data jenis:", error);
    return [];
  }
};

export const getJenisByKelompok = async (kelompokId) => {
  try {
    const res = await api.get(
      `/klasifikasi-aset/jenis-aset/by-kelompok-aset/${kelompokId}`
    );
    return res.data.map((jenis) => ({
      value: jenis.id,
      label: `${jenis.kode_jenis_aset} - ${jenis.nama_jenis_aset}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil jenis dari kelompok ${kelompokId}:`, error);
    return [];
  }
};

// --- JENIS CRUD ---
export const getJenises = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-aset/jenis-aset", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data jenis:", error);
    throw error;
  }
};

export const createJenis = async (data) => {
  try {
    const res = await api.post("/klasifikasi-aset/jenis-aset", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat jenis:", error);
    throw error;
  }
};

export const updateJenis = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-aset/jenis-aset/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui jenis ${id}:`, error);
    throw error;
  }
};

export const deleteJenis = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-aset/jenis-aset/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus jenis ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* OBJEK ASET           */
/* ========================== */
export const getObjekOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-aset/objek-aset", { params });
    const dataList = res.data.data || res.data;
    return dataList.map((objek) => ({
      value: objek.id,
      label: `${objek.kode_objek_aset} - ${objek.nama_objek_aset}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data objek:", error);
    return [];
  }
};

export const getObjekByJenis = async (jenisId) => {
  try {
    const res = await api.get(
      `/klasifikasi-aset/objek-aset/by-jenis-aset/${jenisId}`
    );
    return res.data.map((objek) => ({
      value: objek.id,
      label: `${objek.kode_objek_aset} - ${objek.nama_objek_aset}`,
    }));
  } catch (error) {
    console.error(`Gagal mengambil objek dari jenis ${jenisId}:`, error);
    return [];
  }
};

// --- OBJEK CRUD ---
export const getObjeks = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-aset/objek-aset", { params });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data objek:", error);
    throw error;
  }
};

export const createObjek = async (data) => {
  try {
    const res = await api.post("/klasifikasi-aset/objek-aset", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat objek:", error);
    throw error;
  }
};

export const updateObjek = async (id, data) => {
  try {
    const res = await api.patch(`/klasifikasi-aset/objek-aset/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui objek ${id}:`, error);
    throw error;
  }
};

export const deleteObjek = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-aset/objek-aset/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus objek ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* RINCIAN OBJEK ASET           */
/* ========================== */
export const getRincianObjekOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-aset/rincian-objek-aset", {
      params,
    });
    const dataList = res.data.data || res.data;
    return dataList.map((rincian) => ({
      value: rincian.id,
      label: `${rincian.kode_rincian_objek_aset} - ${rincian.nama_rincian_objek_aset}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data rincian objek:", error);
    return [];
  }
};

export const getRincianObjekByObjek = async (objekId) => {
  try {
    const res = await api.get(
      `/klasifikasi-aset/rincian-objek-aset/by-objek-aset/${objekId}`
    );
    return res.data.map((rincian) => ({
      value: rincian.id,
      label: `${rincian.kode_rincian_objek_aset} - ${rincian.nama_rincian_objek_aset}`,
    }));
  } catch (error) {
    console.error(
      `Gagal mengambil rincian objek dari objek ${objekId}:`,
      error
    );
    return [];
  }
};

// --- RINCIAN OBJEK CRUD ---
export const getRincianObjeks = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-aset/rincian-objek-aset", {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data rincian objek:", error);
    throw error;
  }
};

export const createRincianObjek = async (data) => {
  try {
    const res = await api.post("/klasifikasi-aset/rincian-objek-aset", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat rincian objek:", error);
    throw error;
  }
};

export const updateRincianObjek = async (id, data) => {
  try {
    const res = await api.patch(
      `/klasifikasi-aset/rincian-objek-aset/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui rincian objek ${id}:`, error);
    throw error;
  }
};

export const deleteRincianObjek = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-aset/rincian-objek-aset/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus rincian objek ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* SUB RINCIAN ASET           */
/* ========================== */
export const getSubRincianOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-aset/sub-rincian-aset", {
      params,
    });
    const dataList = res.data.data || res.data;
    return dataList.map((sub) => ({
      value: sub.id,
      label: `${sub.kode_sub_rincian_aset} - ${sub.nama_sub_rincian_aset}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data sub rincian:", error);
    return [];
  }
};

export const getSubRincianByRincianObjek = async (rincianObjekId) => {
  try {
    const res = await api.get(
      `/klasifikasi-aset/sub-rincian-aset/by-rincian-objek-aset/${rincianObjekId}`
    );
    return res.data.map((sub) => ({
      value: sub.id,
      label: `${sub.kode_sub_rincian_aset} - ${sub.nama_sub_rincian_aset}`,
    }));
  } catch (error) {
    console.error(
      `Gagal mengambil sub rincian dari rincian objek ${rincianObjekId}:`,
      error
    );
    return [];
  }
};

// --- SUB RINCIAN CRUD ---
export const getSubRincians = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-aset/sub-rincian-aset", {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data sub rincian:", error);
    throw error;
  }
};

export const createSubRincian = async (data) => {
  try {
    const res = await api.post("/klasifikasi-aset/sub-rincian-aset", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat sub rincian:", error);
    throw error;
  }
};

export const updateSubRincian = async (id, data) => {
  try {
    const res = await api.patch(
      `/klasifikasi-aset/sub-rincian-aset/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui sub rincian ${id}:`, error);
    throw error;
  }
};

export const deleteSubRincian = async (id) => {
  try {
    const res = await api.delete(`/klasifikasi-aset/sub-rincian-aset/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus sub rincian ${id}:`, error);
    throw error;
  }
};

/* ========================== */
/* SUB SUB RINCIAN ASET           */
/* ========================== */
export const getSubSubRincianOptions = async (customParams = {}) => {
  const params = { per_page: 1000, ...customParams };
  try {
    const res = await api.get("/klasifikasi-aset/sub-sub-rincian-aset", {
      params,
    });
    const dataList = res.data.data || res.data;
    return dataList.map((subSub) => ({
      value: subSub.id,
      label: `${subSub.kode_sub_sub_rincian_aset} - ${subSub.nama_sub_sub_rincian_aset}`,
    }));
  } catch (error) {
    console.error("Gagal mengambil data sub sub rincian:", error);
    return [];
  }
};

export const getSubSubRincianBySubRincian = async (subRincianId) => {
  try {
    const res = await api.get(
      `/klasifikasi-aset/sub-sub-rincian-aset/by-sub-rincian-aset/${subRincianId}`
    );
    return res.data.map((subSub) => ({
      value: subSub.id,
      label: `${subSub.kode_sub_sub_rincian_aset} - ${subSub.nama_sub_sub_rincian_aset}`,
    }));
  } catch (error) {
    console.error(
      `Gagal mengambil sub sub rincian dari sub rincian ${subRincianId}:`,
      error
    );
    return [];
  }
};

// --- SUB RINCIAN CRUD ---
export const getSubSubRincians = async (params = {}) => {
  try {
    const res = await api.get("/klasifikasi-aset/sub-sub-rincian-aset", {
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil data sub sub rincian:", error);
    throw error;
  }
};

export const createSubSubRincian = async (data) => {
  try {
    const res = await api.post("/klasifikasi-aset/sub-sub-rincian-aset", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat sub sub rincian:", error);
    throw error;
  }
};

export const updateSubSubRincian = async (id, data) => {
  try {
    const res = await api.patch(
      `/klasifikasi-aset/sub-sub-rincian-aset/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(`Gagal memperbarui sub sub rincian ${id}:`, error);
    throw error;
  }
};

export const deleteSubSubRincian = async (id) => {
  try {
    const res = await api.delete(
      `/klasifikasi-aset/sub-sub-rincian-aset/${id}`
    );
    return res.data;
  } catch (error) {
    console.error(`Gagal menghapus sub sub rincian ${id}:`, error);
    throw error;
  }
};
