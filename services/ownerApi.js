import sourceData from "../constants/data.json";

// Deep-clone so we never mutate the imported JSON module
let db = JSON.parse(JSON.stringify(sourceData));
const getR = (id = "res_001") =>
  db.restaurants.find((r) => r.id === id) ?? db.restaurants[0];
const uid = () => `item_${Date.now()}`;

// ── Dashboard stats ───────────────────────────────────────────

export function fetchDashboardStats(restaurantId = "res_001") {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = db.orders.filter((o) => o.restaurantId === restaurantId);
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
      const pendingOrders = orders.filter((o) => o.status === "Pending").length;
      const servedOrders = orders.filter(
        (o) => o.status === "Delivered",
      ).length;

      const itemMap = {};
      orders.forEach((order) =>
        order.items.forEach(({ name, quantity, price }) => {
          if (!itemMap[name]) itemMap[name] = { name, sold: 0, revenue: 0 };
          itemMap[name].sold += quantity;
          itemMap[name].revenue += quantity * price;
        }),
      );
      const topItems = Object.values(itemMap).sort((a, b) => b.sold - a.sold);

      resolve({
        data: {
          totalOrders,
          totalRevenue,
          pendingOrders,
          servedOrders,
          topItems,
        },
      });
    }, 400);
  });
}

// ── Menu CRUD ─────────────────────────────────────────────────

export function fetchOwnerMenu(restaurantId = "res_001") {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: getR(restaurantId).menu }), 400);
  });
}

export function addMenuItem(restaurantId = "res_001", item) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const r = getR(restaurantId);
      if (!r) return reject({ error: "Restaurant not found" });
      const newItem = { id: uid(), isAvailable: true, rating: 0, ...item };
      r.menu.push(newItem);
      resolve({ data: newItem });
    }, 350);
  });
}

export function editMenuItem(restaurantId = "res_001", itemId, updates) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const r = getR(restaurantId);
      const idx = r.menu.findIndex((i) => i.id === itemId);
      if (idx === -1) return reject({ error: "Menu item not found" });
      r.menu[idx] = { ...r.menu[idx], ...updates };
      resolve({ data: r.menu[idx] });
    }, 350);
  });
}

export function deleteMenuItem(restaurantId = "res_001", itemId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const r = getR(restaurantId);
      const before = r.menu.length;
      r.menu = r.menu.filter((i) => i.id !== itemId);
      if (r.menu.length === before) return reject({ error: "Item not found" });
      resolve({ data: { deletedId: itemId } });
    }, 300);
  });
}

// ── Category management ───────────────────────────────────────

export function fetchOwnerCategories(restaurantId = "res_001") {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: getR(restaurantId).categories }), 300);
  });
}

export function addCategory(restaurantId = "res_001", categoryName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const r = getR(restaurantId);
      if (r.categories.includes(categoryName))
        return reject({ error: "Category already exists" });
      r.categories.push(categoryName);
      resolve({ data: r.categories });
    }, 300);
  });
}

export function deleteCategory(restaurantId = "res_001", categoryName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const r = getR(restaurantId);
      r.categories = r.categories.filter((c) => c !== categoryName);
      resolve({ data: r.categories });
    }, 300);
  });
}

// ── Chef accounts ─────────────────────────────────────────────

let chefs = [
  {
    id: "chef_001",
    name: "Chef Ahmed",
    username: "chef001",
    restaurantId: "res_001",
    createdAt: "2024-01-15",
  },
  {
    id: "chef_002",
    name: "Chef Bilal",
    username: "chef002",
    restaurantId: "res_001",
    createdAt: "2024-02-10",
  },
];

export function fetchChefs(restaurantId = "res_001") {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({ data: chefs.filter((c) => c.restaurantId === restaurantId) }),
      300,
    );
  });
}

export function addChef(chefData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (chefs.find((c) => c.username === chefData.username))
        return reject({ error: "Username already taken" });
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
      if (chefs.length === before) return reject({ error: "Chef not found" });
      resolve({ data: { deletedId: chefId } });
    }, 300);
  });
}
