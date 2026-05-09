import { api, publicApi, saveOwnerTokens, clearTokens } from "./api";

// ── Register (send OTP) ───────────────────────────────────────
export function registerOwner(data) {
  // data: { name, email, phone, password, confirmPassword }
  return publicApi.post("/owner/auth/register", data);
}

// ── Resend OTP ────────────────────────────────────────────────
export function resendOtp(email) {
  return publicApi.post("/owner/auth/resend-otp", { email });
}

// ── Verify OTP → receives tokens ─────────────────────────────
export async function verifyOtp(email, code) {
  const response = await publicApi.post("/owner/auth/verify-otp", { email, code });
  const { accessToken, refreshToken } = response.data?.data ?? {};
  if (accessToken) await saveOwnerTokens(accessToken, refreshToken);
  return response;
}

// ── Login ─────────────────────────────────────────────────────
export async function loginOwner(email, password) {
  const response = await publicApi.post("/owner/auth/login", { email, password });
  const { accessToken, refreshToken } = response.data?.data ?? {};
  if (accessToken) await saveOwnerTokens(accessToken, refreshToken);
  return response;
}

// ── Logout ────────────────────────────────────────────────────
export async function logoutOwner() {
  const response = await api.post("/owner/auth/logout");
  await clearTokens();
  return response;
}

// ── Get current owner profile ─────────────────────────────────
export function getOwnerMe() {
  return api.get("/owner/auth/me");
}