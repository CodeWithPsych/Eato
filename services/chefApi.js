const BASE = 'http://localhost:3000';
 
// Shared in-memory mirror — updated after every server fetch/mutation.
// orderApi imports this so both slices stay in sync without a real websocket.
export let liveOrders = [];
 
// ── Helpers ───────────────────────────────────────────────────
 
async function patchOrder(orderId, body) {
  const res = await fetch(`${BASE}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw { error: 'Failed to update order' };
  return res.json();
}
 
function syncLocal(updated) {
  const idx = liveOrders.findIndex((o) => o.id === updated.id || o.orderId === updated.id);
  if (idx !== -1) liveOrders[idx] = { ...liveOrders[idx], ...updated };
  else liveOrders.unshift(updated);
}
 
// ── Fetch all non-Delivered orders for the kitchen ────────────
 
export function fetchKitchenOrders(restaurantId = 'res_001') {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/orders?restaurantId=${restaurantId}`);
      const orders = await res.json();
      // Normalise shape (add tableNumber / id fields if missing)
      const normalised = orders
        .filter((o) => o.status !== 'Delivered')
        .map((o) => ({
          ...o,
          id: o.orderId ?? o.id,
          status: o.status ?? 'Pending',
          tableNumber: o.tableNumber ?? Math.floor(Math.random() * 15) + 1,
          eta: o.eta ?? null,
          time: o.date ?? new Date().toISOString(),
        }));
      liveOrders = normalised;
      resolve({ data: normalised });
    } catch (error) {
      reject(error);
    }
  });
}
 
// ── Accept a pending order ────────────────────────────────────
 
export function acceptOrder(orderId, eta) {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await patchOrder(orderId, { status: 'accepted', eta });
      syncLocal(updated);
      resolve({ data: updated });
    } catch (error) {
      reject(error);
    }
  });
}
 
// ── Reject a pending order ────────────────────────────────────
 
export function rejectOrder(orderId) {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await patchOrder(orderId, { status: 'rejected' });
      syncLocal(updated);
      resolve({ data: updated });
    } catch (error) {
      reject(error);
    }
  });
}
 
// ── Update estimated preparation time ────────────────────────
 
export function updatePrepTime(orderId, eta) {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await patchOrder(orderId, { eta });
      syncLocal(updated);
      resolve({ data: updated });
    } catch (error) {
      reject(error);
    }
  });
}
 
// ── Mark an accepted order as ready ──────────────────────────
 
export function markOrderReady(orderId) {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await patchOrder(orderId, { status: 'ready' });
      syncLocal(updated);
      resolve({ data: updated });
    } catch (error) {
      reject(error);
    }
  });
}