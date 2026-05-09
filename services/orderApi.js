import { api, publicApi } from "./api";

// ── Create order (customer checkout) ─────────────────────────
export function createOrder(orderData) {
  return publicApi.post("/customer/orders", orderData);
}

// ── Customer order history by table ──────────────────────────
export function fetchOrdersByUser(restaurantId, tableNumber) {
  return publicApi.get(
    `/customer/restaurants/${restaurantId}/table/${tableNumber}/orders`
  );
}

// ── Restaurant orders (owner view) ───────────────────────────
export function fetchOrdersByRestaurant(params = {}) {
  // params: { status?, page?, limit? }
  return api.get("/owner/orders", { params });
}

// ── Single order ──────────────────────────────────────────────
export function fetchOrderById(orderId) {
  return publicApi.get(`/customer/orders/${orderId}/status`);
}

// ── Update status (owner override) ───────────────────────────
export function updateOrderStatus(orderId, status) {
  return api.patch(`/owner/orders/${orderId}/status`, { status });
}