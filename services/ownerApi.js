const BASE = 'http://localhost:3000';

// ── Helpers ───────────────────────────────────────────────────

async function getRestaurant(restaurantId) {
  const res = await fetch(`${BASE}/restaurants/${restaurantId}`);
  if (!res.ok) throw new Error(`Restaurant ${restaurantId} not found`);
  return res.json();
}

async function patchRestaurant(restaurantId, body) {
  const res = await fetch(`${BASE}/restaurants/${restaurantId}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update restaurant');
  return res.json();
}

const uid = () => `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ── Dashboard stats ───────────────────────────────────────────

export function fetchDashboardStats(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/orders?restaurantId=${restaurantId}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const orders = await res.json();

      const totalOrders   = orders.length;
      const totalRevenue  = orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0);
      const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
      const servedOrders  = orders.filter((o) => o.status === 'Delivered').length;

      // Build top-items from order history
      const itemMap = {};
      orders.forEach((order) =>
        (order.items ?? []).forEach(({ name, quantity, price }) => {
          if (!itemMap[name]) itemMap[name] = { name, sold: 0, revenue: 0 };
          itemMap[name].sold    += quantity;
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

export function fetchOwnerMenu(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      resolve({ data: restaurant.menu ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

export function addMenuItem(restaurantId, item) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const newItem = { id: uid(), isAvailable: true, rating: 0, reviews: 0, ...item };
      const updatedMenu = [...(restaurant.menu ?? []), newItem];
      await patchRestaurant(restaurantId, { menu: updatedMenu });
      resolve({ data: newItem });
    } catch (error) {
      reject(error);
    }
  });
}

export function editMenuItem(restaurantId, itemId, updates) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const menu = [...(restaurant.menu ?? [])];
      const idx = menu.findIndex((i) => i.id === itemId);
      if (idx === -1) return reject(new Error('Menu item not found'));
      menu[idx] = { ...menu[idx], ...updates };
      await patchRestaurant(restaurantId, { menu });
      resolve({ data: menu[idx] });
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteMenuItem(restaurantId, itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const updatedMenu = (restaurant.menu ?? []).filter((i) => i.id !== itemId);
      await patchRestaurant(restaurantId, { menu: updatedMenu });
      resolve({ data: { deletedId: itemId } });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Category management ───────────────────────────────────────

export function fetchOwnerCategories(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      resolve({ data: restaurant.categories ?? [] });
    } catch (error) {
      reject(error);
    }
  });
}

export function addCategory(restaurantId, categoryName) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const categories = restaurant.categories ?? [];
      if (categories.includes(categoryName))
        return reject(new Error('Category already exists'));
      const updated = [...categories, categoryName];
      await patchRestaurant(restaurantId, { categories: updated });
      resolve({ data: updated });
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteCategory(restaurantId, categoryName) {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await getRestaurant(restaurantId);
      const updated = (restaurant.categories ?? []).filter((c) => c !== categoryName);
      await patchRestaurant(restaurantId, { categories: updated });
      resolve({ data: updated });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Chef accounts (in-memory — swap for real endpoint) ──────── 

let _chefs = [
  { id: 'chef_001', name: 'Chef Ahmed',  username: 'chef001', restaurantId: 'res_001', createdAt: '2024-01-15' },
  { id: 'chef_002', name: 'Chef Bilal',  username: 'chef002', restaurantId: 'res_001', createdAt: '2024-02-10' },
];

export function fetchChefs(restaurantId) {
  return new Promise((resolve) =>
    setTimeout(() =>
      resolve({ data: _chefs.filter((c) => c.restaurantId === restaurantId) }), 300)
  );
}

export function addChef(chefData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (_chefs.find((c) => c.username === chefData.username))
        return reject(new Error('Username already taken'));
      const newChef = {
        id: `chef_${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        ...chefData,
      };
      _chefs.push(newChef);
      resolve({ data: newChef });
    }, 350);
  });
}

export function deleteChef(chefId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const before = _chefs.length;
      _chefs = _chefs.filter((c) => c.id !== chefId);
      if (_chefs.length === before) return reject(new Error('Chef not found'));
      resolve({ data: { deletedId: chefId } });
    }, 300);
  });
}