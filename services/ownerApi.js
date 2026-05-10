import { api } from "./api";

// ── Dashboard stats ───────────────────────────────────────────
export function fetchDashboardStats() {
  return api.get("/owner/stats");
}

// ── Menu ──────────────────────────────────────────────────────
export function fetchOwnerMenu(category) {
  const params = category && category !== "All" ? { category } : {};
  return api.get("/owner/menu", { params });
}

export function addMenuItem(item) {
  // item may include an image File or an emoji
  if (item.imageFile) {
    const form = new FormData();
    form.append("name",        item.name);
    form.append("category",    item.category);
    form.append("description", item.description ?? "");
    form.append("price",       String(item.price));
    form.append("emoji",       item.emoji ?? "");
    form.append("image",       item.imageFile);
    return api.post("/owner/menu", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post("/owner/menu", {
    name:        item.name,
    category:    item.category,
    description: item.description ?? "",
    price:       item.price,
    emoji:       item.emoji ?? "",
  });
}

export function editMenuItem(itemId, updates) {
  if (updates.imageFile) {
    const form = new FormData();
    Object.entries(updates).forEach(([k, v]) => {
      if (k !== "imageFile") form.append(k, String(v ?? ""));
    });
    form.append("image", updates.imageFile);
    return api.patch(`/owner/menu/${itemId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.patch(`/owner/menu/${itemId}`, updates);
}

export function deleteMenuItem(itemId) {
  return api.delete(`/owner/menu/${itemId}`);
}

// ── Categories ────────────────────────────────────────────────
export function fetchOwnerCategories() {
  return api.get("/owner/categories");
}

export function addCategory(name, emoji = "🍽️", imageFile) {
  if (imageFile) {
    const form = new FormData();
    form.append("name",  name);
    form.append("emoji", emoji);
    form.append("image", imageFile);
    return api.post("/owner/categories", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post("/owner/categories", { name, emoji });
}

export function deleteCategory(categoryId) {
  return api.delete(`/owner/categories/${categoryId}`);
}

// ── Chefs ─────────────────────────────────────────────────────
export function fetchChefs() {
  return api.get("/owner/chefs");
}

export function addChef(chefData) {
  return api.post("/owner/chefs", chefData);
}

export function updateChef(chefId, updates) {
  return api.patch(`/owner/chefs/${chefId}`, updates);
}

export function deleteChef(chefId) {
  return api.delete(`/owner/chefs/${chefId}`);
}

// ── Orders ────────────────────────────────────────────────────
export function fetchOrdersByRestaurant(params = {}) {
  return api.get("/owner/orders", { params });
}

export function updateOrderStatus(orderId, status) {
  return api.patch(`/owner/orders/${orderId}/status`, { status });
}