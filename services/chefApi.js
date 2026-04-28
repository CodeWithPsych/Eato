import sourceData from "../constants/data.json";

// Shared in-memory order store – exported so orderApi can share the same array
export let liveOrders = JSON.parse(JSON.stringify(sourceData.orders)).map(
  (o) => ({
    ...o,
    id: o.orderId,
    status: o.status ?? "Pending",
    tableNumber: o.tableNumber ?? Math.floor(Math.random() * 15) + 1,
    eta: null,
    time: o.date ?? new Date().toISOString(),
  }),
);

// Fetch all non-delivered orders for the kitchen
export function fetchKitchenOrders(restaurantId = "res_001") {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orders = liveOrders.filter(
        (o) => o.restaurantId === restaurantId && o.status !== "Delivered",
      );
      resolve({ data: orders });
    }, 400);
  });
}

// Accept a pending order and set ETA (minutes)
export function acceptOrder(orderId, eta) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = liveOrders.find((o) => o.id === orderId);
      if (!order) return reject({ error: "Order not found" });
      order.status = "accepted";
      order.eta = eta;
      resolve({ data: { ...order } });
    }, 300);
  });
}

// Reject a pending order
export function rejectOrder(orderId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = liveOrders.find((o) => o.id === orderId);
      if (!order) return reject({ error: "Order not found" });
      order.status = "rejected";
      resolve({ data: { ...order } });
    }, 300);
  });
}

// Update estimated preparation time
export function updatePrepTime(orderId, eta) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = liveOrders.find((o) => o.id === orderId);
      if (!order) return reject({ error: "Order not found" });
      order.eta = eta;
      resolve({ data: { ...order } });
    }, 250);
  });
}

// Mark an accepted order as ready to serve
export function markOrderReady(orderId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = liveOrders.find((o) => o.id === orderId);
      if (!order) return reject({ error: "Order not found" });
      order.status = "ready";
      resolve({ data: { ...order } });
    }, 300);
  });
}
