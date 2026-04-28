/**
 * Mock API layer for customer-facing features.
 * Returns { data: ... } to mirror real Axios response shape.
 * Swap Promise+setTimeout with real HTTP calls when backend is ready.
 */
import data from "../constants/data.json";

const getRestaurant = (id = "res_001") =>
  data.restaurants.find((r) => r.id === id) ?? data.restaurants[0];

// ── Menu ──────────────────────────────────────────────────────

export function fetchMenu(restaurantId = "res_001") {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: getRestaurant(restaurantId).menu }), 500);
  });
}

export function fetchMenuByCategory(
  restaurantId = "res_001",
  category = "All",
) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const menu = getRestaurant(restaurantId).menu;
      const filtered =
        category === "All" ? menu : menu.filter((i) => i.category === category);
      resolve({ data: filtered });
    }, 400);
  });
}

// ── Categories ────────────────────────────────────────────────

export function fetchCategories(restaurantId = "res_001") {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ data: getRestaurant(restaurantId).categories }),
      300,
    );
  });
}

// ── Restaurant details (customer view) ───────────────────────

export function fetchRestaurantDetails(restaurantId = "res_001") {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const restaurant = getRestaurant(restaurantId);
      if (!restaurant) return reject({ error: "Restaurant not found" });
      const { menu: _omit, ...details } = restaurant;
      resolve({ data: details });
    }, 300);
  });
}
