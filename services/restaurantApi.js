const BASE = 'http://localhost:3000';

export function fetchAllRestaurants() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/restaurants`);
      const data = await res.json();
      // Strip menu to keep the payload light
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
      if (!res.ok) return reject({ error: `Restaurant ${restaurantId} not found` });
      const data = await res.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}