import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { logger } from "@shared/lib/logger";
import { clearTokenCache, getToken, rotateToken } from "@shared/lib/tokenCache";

// Endpoints that must NOT have a Bearer header injected.
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

function makeApiClient(
  baseURL: string,
  opts: { authEndpoints?: string[] } = {},
): AxiosInstance {
  const { authEndpoints = [] } = opts;

  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else if (token) prom.resolve(token);
    });
    failedQueue = [];
  };

  // Inject Bearer token — skip auth endpoints so login/register don't send a stale token.
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Allow axios to set Content-Type + boundary automatically for FormData uploads.
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }

      const isAuthEndpoint = authEndpoints.includes(config.url ?? "");
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

  // On 401: coordinate a single refresh and replay the queue.
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      logger.info("[API] request url", originalRequest?.url ?? "null");
      const isAuthEndpoint = authEndpoints.includes(
        originalRequest?.url ?? "",
      );

      if (!originalRequest) return Promise.reject(error);

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthEndpoint
      ) {
        logger.warn("[API] 401 detected", {
          url: originalRequest.url,
          method: originalRequest.method,
        });

        if (isRefreshing) {
          logger.log("[API] refresh in progress, request queued");
          return new Promise<string>(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          logger.log("[API] refreshing token");
          const newToken = await rotateToken();

          if (!newToken) {
            throw new Error("Refresh token tidak tersedia atau kadaluarsa");
          }

          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return instance(originalRequest);
        } catch (err) {
          logger.error("[API] refresh failed", err);
          clearTokenCache();
          processQueue(err as AxiosError, null);

          if (typeof window !== "undefined") {
            logger.warn("[API] logging out due to refresh failure");
          }

          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}

// Pre-configured instances — import these, not the factory.
export const api = makeApiClient(
  process.env.NEXT_PUBLIC_API_BACKEND ?? "",
  { authEndpoints: AUTH_ENDPOINTS },
);

export const apiMedia = makeApiClient(
  process.env.NEXT_PUBLIC_API_BACKEND_MEDIA ?? "",
);
