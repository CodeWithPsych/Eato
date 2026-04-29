const BASE = 'http://localhost:3000';
const uid = () => `item_${Date.now()}`;

// ── Helpers ───────────────────────────────────────────────────

async function getRestaurant(restaurantId = 'res_001') {
  const res = await fetch(`${BASE}/restaurants/${restaurantId}`);
  if (!res.ok) throw { error: `Restaurant ${restaurantId} not found` };
  return res.json();
}

async function patchRestaurant(restaurantId, body) {
  const res = await fetch(`${BASE}/restaurants/${restaurantId}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw { error: 'Failed to update restaurant' };
  return res.json();
}

// ── Dashboard stats ───────────────────────────────────────────

export function fetchDashboardStats(restaurantId = 'res_001') {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/orders?restaurantId=${restaurantId}`);
      const orders = await res.json();

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0);
      const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
      const servedOrders = orders.filter((o) => o.status === 'Delivered').length;

      const itemMap = {};
      orders.forEach((order) =>
        (order.items ?? []).forEach(({ name, quantity, price }) => {
          if (!itemMap[name]) itemMap[name] = { name, sold: 0, revenue: 0 };
          itemMap[name].sold += quantity;
          itemMap[name].revenue += quantity * price;
        })
      );
      const topItems = Object.values(itemMap).sort((a, b) => b.sold - a.sold);

      resolve({ data: { totalOrders, totalRevenue, pendingOrders, servedOrders, topItems } });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Menu CRUD ─────────────────────────────────────────────────

export function fetchOwnerMenu(restaurantId = 'res_001') {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      resolve({ data: restaurant.menu ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

export function addMenuItem(restaurantId = 'res_001', item) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const newItem = { id: uid(), isAvailable: true, rating: 0, ...item };
      const updatedMenu = [...(restaurant.menu ?? []), newItem];
      await patchRestaurant(restaurantId, { menu: updatedMenu });
      resolve({ data: newItem });
    } catch (error) {
      reject(error);
    }
  });
}

export function editMenuItem(restaurantId = 'res_001', itemId, updates) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const menu = restaurant.menu ?? [];
      const idx = menu.findIndex((i) => i.id === itemId);
      if (idx === -1) return reject({ error: 'Menu item not found' });
      menu[idx] = { ...menu[idx], ...updates };
      await patchRestaurant(restaurantId, { menu });
      resolve({ data: menu[idx] });
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteMenuItem(restaurantId = 'res_001', itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const before = (restaurant.menu ?? []).length;
      const updatedMenu = (restaurant.menu ?? []).filter((i) => i.id !== itemId);
      if (updatedMenu.length === before) return reject({ error: 'Item not found' });
      await patchRestaurant(restaurantId, { menu: updatedMenu });
      resolve({ data: { deletedId: itemId } });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Category management ───────────────────────────────────────

export function fetchOwnerCategories(restaurantId = 'res_001') {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      resolve({ data: restaurant.categories ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

export function addCategory(restaurantId = 'res_001', categoryName) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const categories = restaurant.categories ?? [];
      if (categories.includes(categoryName)) return reject({ error: 'Category already exists' });
      const updatedCategories = [...categories, categoryName];
      await patchRestaurant(restaurantId, { categories: updatedCategories });
      resolve({ data: updatedCategories });
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteCategory(restaurantId = 'res_001', categoryName) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const updatedCategories = (restaurant.categories ?? []).filter((c) => c !== categoryName);
      await patchRestaurant(restaurantId, { categories: updatedCategories });
      resolve({ data: updatedCategories });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Chef accounts (in-memory — no /chefs endpoint in data.json) ──

let chefs = [
  {
    id: 'chef_001',
    name: 'Chef Ahmed',
    username: 'chef001',
    restaurantId: 'res_001',
    createdAt: '2024-01-15',
  },
  {
    id: 'chef_002',
    name: 'Chef Bilal',
    username: 'chef002',
    restaurantId: 'res_001',
    createdAt: '2024-02-10',
  },
];

export function fetchChefs(restaurantId = 'res_001') {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ data: chefs.filter((c) => c.restaurantId === restaurantId) }),
      300
    );
  });
}

export function addChef(chefData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (chefs.find((c) => c.username === chefData.username))
        return reject({ error: 'Username already taken' });
      const newChef = {
        id: `chef_${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        ...chefData,
      };
      chefs.push(newChef);
      resolve({ data: newChef });
    }, 350);
  });
}

export function deleteChef(chefId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const before = chefs.length;
      chefs = chefs.filter((c) => c.id !== chefId);
      if (chefs.length === before) return reject({ error: 'Chef not found' });
      resolve({ data: { deletedId: chefId } });
    }, 300);
  });
}