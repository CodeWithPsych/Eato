const BASE = 'http://localhost:3000';

// ── Helpers ───────────────────────────────────────────────────

function getRestaurantId() {
  // Default restaurant for the demo; swap for dynamic id when needed
  return 'res_001';
}

// ── Menu ──────────────────────────────────────────────────────

export function fetchMenu(restaurantId = getRestaurantId()) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      const data = await response.json();
      resolve({ data: data.menu ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchMenuByCategory(restaurantId = getRestaurantId(), category = 'All') {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      const data = await response.json();
      const menu = data.menu ?? [];
      const filtered = category === 'All' ? menu : menu.filter((i) => i.category === category);
      resolve({ data: filtered });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Categories ────────────────────────────────────────────────

export function fetchCategories(restaurantId = getRestaurantId()) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      const data = await response.json();
      resolve({ data: data.categories ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Restaurant details (customer view — no menu) ──────────────

export function fetchRestaurantDetails(restaurantId = getRestaurantId()) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      const data = await response.json();
      if (!data || !data.id) return reject({ error: 'Restaurant not found' });
      const { menu: _omit, ...details } = data;
      resolve({ data: details });
    } catch (error) {
      reject(error);
    }
  });
}