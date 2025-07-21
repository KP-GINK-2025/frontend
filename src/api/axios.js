import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - tambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle expired token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika response adalah 401 (Unauthorized) atau 403 (Forbidden)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear semua data autentikasi dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("savedUsername");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("rememberMe");

      // Cek jika tidak sedang di halaman login untuk avoid loop
      if (window.location.pathname !== "/") {
        // Redirect ke login page
        window.location.href = "/";

        // Optional: Tampilkan notifikasi menggunakan alert browser
        setTimeout(() => {
          alert("Sesi telah berakhir. Silakan login kembali.");
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
