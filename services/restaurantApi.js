import data from "../constants/data.json";

// ── All restaurants (no menus – lighter payload) ──────────────

export function fetchAllRestaurants() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const list = data.restaurants.map(({ menu: _omit, ...rest }) => rest);
      resolve({ data: list });
    }, 400);
  });
}

// ── Single restaurant with full menu ─────────────────────────

export function fetchRestaurantById(restaurantId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const r = data.restaurants.find((r) => r.id === restaurantId);
      if (!r) return reject({ error: `Restaurant ${restaurantId} not found` });
      resolve({ data: r });
    }, 350);
  });
}
