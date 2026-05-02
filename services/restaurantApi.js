const BASE = "http://localhost:3000";

// ── All restaurants (list view — menu stripped for perf) ──────

export function fetchAllRestaurants() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/restaurants`);
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      const data = await res.json();
      // Strip heavy menu arrays so the list loads fast
      const list = data.map(({ menu: _omit, ...rest }) => rest);
      resolve({ data: list });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Single restaurant with full menu ─────────────────────────

export function fetchRestaurantById(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/restaurants/${restaurantId}`);
      if (!res.ok) throw new Error(`Restaurant ${restaurantId} not found`);
      const data = await res.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Create a new restaurant (onboarding flow) ─────────────────

export function createRestaurant(restaurantData) {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = {
        id: `res_${Date.now()}`,
        menu: [],
        categories: [],
        rating: 0,
        ...restaurantData,
      };
      const res = await fetch(`${BASE}/restaurants`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create restaurant");
      const data = await res.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Update restaurant fields ──────────────────────────────────

export function updateRestaurant(restaurantId, updates) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/restaurants/${restaurantId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update restaurant");
      const data = await res.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}