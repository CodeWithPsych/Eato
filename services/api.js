import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Base URL ──────────────────────────────────────────────────
export const BASE_URL = "https://eato-backend-mb3y.onrender.com/api/v1";

// ── Public client (no auth header) ───────────────────────────
export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Authenticated client ──────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) {
      // AsyncStorage unavailable — token stays absent
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401 → try refresh, then retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh once, and only for 401 errors
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) return Promise.reject(error);

        // Determine which refresh endpoint to use based on stored role
        const role = await AsyncStorage.getItem("userRole"); // "owner" | "chef"
        const endpoint =
          role === "chef"
            ? "/chef/refresh-token"
            : "/owner/auth/refresh-token";

        const { data } = await publicApi.post(endpoint, { refreshToken });

        const newAccess  = data.data?.accessToken;
        const newRefresh = data.data?.refreshToken;

        if (newAccess) {
          await AsyncStorage.setItem("accessToken",  newAccess);
          if (newRefresh) await AsyncStorage.setItem("refreshToken", newRefresh);
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original); // retry original request
        }
      } catch (refreshError) {
        // Refresh failed — clear tokens and let caller handle redirect
        await AsyncStorage.multiRemove(["accessToken", "refreshToken", "userRole"]);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ── Token helpers ─────────────────────────────────────────────

export const saveOwnerTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.multiSet([
    ["accessToken",  accessToken],
    ["refreshToken", refreshToken],
    ["userRole",     "owner"],
  ]);
};

export const saveChefTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.multiSet([
    ["accessToken",  accessToken],
    ["refreshToken", refreshToken],
    ["userRole",     "chef"],
  ]);
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove(["accessToken", "refreshToken", "userRole"]);
};