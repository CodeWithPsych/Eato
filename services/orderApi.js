import { liveOrders } from './chefApi';

const BASE = 'http://localhost:3000';
const uid = () => `ord_${Date.now()}`;

// ── Create a new order (customer checkout) ────────────────────

export function createOrder(orderData) {
  return new Promise(async (resolve, reject) => {
    try {
      const newOrder = {
        id: uid(),
        orderId: uid(),
        status: 'Pending',
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString(),
        eta: null,
        ...orderData,
      };
      const res = await fetch(`${BASE}/orders`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      const data = await res.json();
      liveOrders.unshift(data);
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Customer order history ────────────────────────────────────

export function fetchOrdersByUser(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/orders?userId=${userId}`);
      const data = await res.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

// ── All orders for a restaurant (owner / chef view) ───────────

export function fetchOrdersByRestaurant(restaurantId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/orders?restaurantId=${restaurantId}`);
      const data = await res.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Single order detail ───────────────────────────────────────

export function fetchOrderById(orderId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/orders/${orderId}`);
      if (!res.ok) return reject({ error: 'Order not found' });
      const data = await res.json();
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}

// ── Generic status update (owner override / socket event) ─────

export function updateOrderStatus(orderId, status) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BASE}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return reject({ error: 'Order not found' });
      const data = await res.json();
      // Keep liveOrders mirror in sync
      const idx = liveOrders.findIndex((o) => o.id === orderId || o.orderId === orderId);
      if (idx !== -1) liveOrders[idx] = { ...liveOrders[idx], status };
      resolve({ data });
    } catch (error) {
      reject(error);
    }
  });
}