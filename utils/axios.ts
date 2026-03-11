import { getUser, removeAuthUser, saveAuthUser } from "@/app/lib/auth";
import { API_BACKEND } from "@/app/utils/constant";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// config axios
const api = axios.create({
  baseURL: API_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

// variabel untuk menangani antrean saat proses refresh token berlangsung
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

// fungsi untuk memproses antrean request yang tertahan
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Menyisipkan Access Token ke setiap request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ambil token dari localStorage / Cookies (sesuaikan dengan penyimpanan Anda)
    const token = getUser()?.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response Interceptor: Menangani error 401 dan melakukan Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Jika error 401 (Unauthorized) dan request belum pernah di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang refresh, masukkan request ke antrean
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => { 
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mulai proses refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const user = getUser();

        if (!user) {
          throw new Error("Refresh token tidak tersedia");
        }

        // Panggil endpoint refresh token (JANGAN gunakan instance 'api' agar tidak infinite loop)
        const { data } = await axios.post(
          `${API_BACKEND}/api/v1/auth/refresh-token`,
          {
            refresh_token: user.refresh,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const newAccessToken = data.data.token;
        const newRefreshToken = data.refresh_token;

        // Simpan token baru
        saveAuthUser({
          ...user,
          token: newAccessToken,
          refresh: newRefreshToken,
        });

        // Jalankan ulang request yang antre dengan token baru
        processQueue(null, newAccessToken);

        // Ulangi original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        // Jika refresh token juga gagal (misal sudah expired juga), paksa user logout
        processQueue(err as AxiosError, null);
        if (typeof window !== "undefined") {
          removeAuthUser();
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
