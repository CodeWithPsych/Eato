import { publicApi } from "./api";

// ── All published restaurants ─────────────────────────────────
export function fetchAllRestaurants() {
  return publicApi.get("/customer/restaurants").then((res) => ({
    // normalise to match what restaurantSlice expects: { data: [...] }
    data: res.data?.data ?? [],
  }));
}

// ── Single restaurant ─────────────────────────────────────────
export function fetchRestaurantById(restaurantId) {
  return publicApi.get(`/customer/restaurants/${restaurantId}`).then((res) => ({
    data: res.data?.data ?? {},
  }));
}

// ── These two are no longer used directly from the frontend ──
// (restaurant creation / update is handled via the setup flow)
// Kept as thin wrappers so existing slice imports don't break.
export function createRestaurant() {
  throw new Error("Use the setup flow (restaurantSetupApi.js) to create a restaurant");
}

export function updateRestaurant() {
  throw new Error("Use the setup flow (restaurantSetupApi.js) to update a restaurant");
}