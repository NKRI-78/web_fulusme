import { getUser, removeAuthUser, saveAuthUser } from "@/app/lib/auth";
import { API_BACKEND } from "@/app/utils/constant";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { logger } from "./logger";

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
      logger.warn("[AXIOS] 401 detected", {
        url: originalRequest.url,
        method: originalRequest.method,
      });

      if (isRefreshing) {
        logger.log("[AXIOS] Refresh in progress, request queued");

        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            logger.log("[AXIOS] Retry queued request", originalRequest.url);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            return api(originalRequest);
          })
          .catch((err) => {
            logger.error("[AXIOS] Queued request failed", err);
            return Promise.reject(err);
          });
      }

      logger.log("[AXIOS] Starting token refresh");

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const user = getUser();

        if (!user) {
          logger.error("[AXIOS] No refresh token found");
          throw new Error("Refresh token tidak tersedia");
        }

        logger.log("[AXIOS] Requesting refresh token", user);

        const { data } = await axios.post(
          `${API_BACKEND}/api/v1/auth/refresh-token`,
          {
            refresh_token: user.refresh,
          },
        );

        const newAccessToken = data.data.token;
        const newRefreshToken = data.data.refresh;

        logger.log("[AXIOS] Token refreshed successfully");

        saveAuthUser({
          ...user,
          token: newAccessToken,
          refresh: newRefreshToken,
        });

        logger.log("[AXIOS] Processing queued requests");

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        logger.log("[AXIOS] Retrying original request", originalRequest.url);

        return api(originalRequest);
      } catch (err) {
        logger.error("[AXIOS] Refresh token failed", err);

        processQueue(err as AxiosError, null);

        if (typeof window !== "undefined") {
          logger.warn("[AXIOS] Logging out user due to refresh failure");

          //   removeAuthUser();
          //   window.location.href = "/auth/login";
        }

        return Promise.reject(err);
      } finally {
        logger.log("[AXIOS] Refresh process finished");

        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
