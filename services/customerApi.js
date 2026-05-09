import { publicApi } from "./api";

// ── QR scan → session + restaurant + menu in one call ─────────
export function scanQr(qrPayload) {
  return publicApi.post("/customer/scan", { qrPayload });
}

// ── All published restaurants ─────────────────────────────────
export function fetchAllRestaurants() {
  return publicApi.get("/customer/restaurants");
}

// ── Single restaurant details ─────────────────────────────────
export function fetchRestaurantDetails(restaurantId) {
  return publicApi.get(`/customer/restaurants/${restaurantId}`);
}

// ── Full menu ─────────────────────────────────────────────────
export function fetchMenu(restaurantId) {
  return publicApi.get(`/customer/restaurants/${restaurantId}/menu`);
}

// ── Menu filtered by category ─────────────────────────────────
export function fetchMenuByCategory(restaurantId, category = "All") {
  const params = category !== "All" ? { category } : {};
  return publicApi.get(`/customer/restaurants/${restaurantId}/menu`, { params });
}

// ── Categories ────────────────────────────────────────────────
export function fetchCategories(restaurantId) {
  return publicApi.get(`/customer/restaurants/${restaurantId}/categories`);
}

// ── Place order ───────────────────────────────────────────────
export function placeOrder(orderData) {
  /*
    orderData: {
      restaurantId, tableNumber,
      items: [{ itemId, quantity, customizations? }],
      customerId?,  sessionTag?,
      notes?
    }
  */
  return publicApi.post("/customer/orders", orderData);
}

// ── Orders for a table ────────────────────────────────────────
export function fetchCustomerOrders(restaurantId, tableNumber) {
  return publicApi.get(
    `/customer/restaurants/${restaurantId}/table/${tableNumber}/orders`
  );
}

// ── Single order status ───────────────────────────────────────
export function fetchOrderStatus(orderId) {
  return publicApi.get(`/customer/orders/${orderId}/status`);
}