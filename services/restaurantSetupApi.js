import { api } from "./api";

// ── GET setup progress ────────────────────────────────────────
export function getSetupProgress() {
  return api.get("/owner/setup/progress");
}

// ── Step 1 — name, location, WiFi ────────────────────────────
export function setupStep1(data) {
  // data: { name, location?, wifiSsid?, wifiPassword?, wifiType? }
  return api.post("/owner/setup/step-1", data);
}

// ── Step 2 — categories (with optional images) ───────────────
export function setupStep2(categories) {
  // categories: [{ name, emoji, imageFile? }]
  const form = new FormData();
  const cleanCats = [];

  categories.forEach((cat, idx) => {
    cleanCats.push({ name: cat.name, emoji: cat.emoji ?? "🍽️" });
    if (cat.imageFile) {
      form.append(`categoryImage_${idx}`, cat.imageFile);
    }
  });

  form.append("categories", JSON.stringify(cleanCats));
  return api.post("/owner/setup/step-2", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// ── Step 3 — menu items (with optional images) ───────────────
export function setupStep3(menuItems) {
  // menuItems: [{ name, category, description?, price, isAvailable?, imageFile? }]
  const form = new FormData();
  const cleanItems = [];

  menuItems.forEach((item, idx) => {
    cleanItems.push({
      name:        item.name,
      category:    item.category,
      description: item.description ?? "",
      price:       item.price,
      isAvailable: item.isAvailable ?? true,
    });
    if (item.imageFile) {
      form.append(`menuImage_${idx}`, item.imageFile);
    }
  });

  form.append("menu", JSON.stringify(cleanItems));
  return api.post("/owner/setup/step-3", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// ── Step 4 — tables & QR generation ──────────────────────────
export function setupStep4(tableCount) {
  return api.post("/owner/setup/step-4", { tableCount });
}

// ── Complete setup ────────────────────────────────────────────
export function completeSetup() {
  return api.post("/owner/setup/complete");
}

// ── Regenerate QR for a single table ─────────────────────────
export function regenerateTableQr(tableNumber) {
  return api.patch(`/owner/setup/tables/${tableNumber}/regenerate-qr`);
}