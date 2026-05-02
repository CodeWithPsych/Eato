const BASE = 'http://localhost:3000';

// ── Menu ──────────────────────────────────────────────────────

export function fetchMenu(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error(`Restaurant ${restaurantId} not found`);
      const data = await response.json();
      resolve({ data: data.menu ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchMenuByCategory(restaurantId, category = 'All') {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error(`Restaurant ${restaurantId} not found`);
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

export function fetchCategories(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error(`Restaurant ${restaurantId} not found`);
      const data = await response.json();
      resolve({ data: data.categories ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Restaurant details ────────────────────────────────────────

export function fetchRestaurantDetails(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE}/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error(`Restaurant ${restaurantId} not found`);
      const data = await response.json();
      const { menu: _omit, ...details } = data;
      resolve({ data: details });
    } catch (error) {
      reject(error);
    }
  });
}