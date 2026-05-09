import { api, publicApi, saveChefTokens, clearTokens } from "./api";

// ── Login ─────────────────────────────────────────────────────
export async function chefLogin(kitchenId, password) {
  const response = await publicApi.post("/chef/login", { kitchenId, password });
  const { accessToken, refreshToken } = response.data?.data ?? {};
  if (accessToken) await saveChefTokens(accessToken, refreshToken);
  return response;
}

// ── Logout ────────────────────────────────────────────────────
export async function chefLogout() {
  const response = await api.post("/chef/logout");
  await clearTokens();
  return response;
}

// ── Profile ───────────────────────────────────────────────────
export function getChefMe() {
  return api.get("/chef/me");
}

// ── Kitchen orders ────────────────────────────────────────────
// restaurantId is resolved from the JWT — no param needed
export function fetchKitchenOrders() {
  return api.get("/chef/orders");
}

// ── Accept order ──────────────────────────────────────────────
export function acceptOrder(orderId, eta) {
  return api.patch(`/chef/orders/${orderId}/accept`, { eta });
}

// ── Reject order ──────────────────────────────────────────────
export function rejectOrder(orderId) {
  return api.patch(`/chef/orders/${orderId}/reject`);
}

// ── Mark ready ────────────────────────────────────────────────
export function markOrderReady(orderId) {
  return api.patch(`/chef/orders/${orderId}/ready`);
}

// ── Update ETA ────────────────────────────────────────────────
export function updatePrepTime(orderId, eta) {
  return api.patch(`/chef/orders/${orderId}/eta`, { eta });
}