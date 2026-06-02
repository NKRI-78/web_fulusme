import { API_BACKEND } from "@/app/utils/constant";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { logger } from "./logger";
import { clearTokenCache, getToken, rotateToken } from "./tokenCache";

const api = axios.create({
  baseURL: API_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

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

// Auth endpoints that must NOT have a Bearer header
const AUTH_ENDPOINTS = [
  "/api/v1/forgot-password",
  "/api/v1/verify-otp-change-password",
  "/api/v1/change-password",
  "/api/v1/resend-otp-change-password",
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/verify-otp",
  "/api/v1/resend-otp",
];

// 1. Request interceptor — read token from shared cache (backed by httpOnly cookie)
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isAuthEndpoint = AUTH_ENDPOINTS.includes(config.url ?? "");
    if (!isAuthEndpoint) {
      const token = await getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response interceptor — handle 401, coordinate token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    logger.info("originalRequest.url", originalRequest?.url ?? "null");
    const isAuthEndpoint = AUTH_ENDPOINTS.includes(originalRequest?.url ?? "");

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
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
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        logger.log("[AXIOS] Refreshing token via /api/auth/refresh");
        const newToken = await rotateToken();

        if (!newToken) {
          throw new Error("Refresh token tidak tersedia atau kadaluarsa");
        }

        logger.log("[AXIOS] Token refreshed");
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (err) {
        logger.error("[AXIOS] Refresh failed", err);
        clearTokenCache();
        processQueue(err as AxiosError, null);

        if (typeof window !== "undefined") {
          logger.warn("[AXIOS] Logging out user due to refresh failure");
          // window.location.href = "/auth/login";
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
