// Shares the same liveOrders array as chefApi – status updates are visible everywhere
import { liveOrders } from "./chefApi";

const uid = () => `ord_${Date.now()}`;

// Create a new order (customer checkout)
export function createOrder(orderData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder = {
        id: uid(),
        orderId: uid(),
        status: "Pending",
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString(),
        eta: null,
        ...orderData,
      };
      liveOrders.unshift(newOrder);
      resolve({ data: newOrder });
    }, 400);
  });
}

// Customer order history
export function fetchOrdersByUser(userId) {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ data: liveOrders.filter((o) => o.userId === userId) }),
      400,
    );
  });
}

// All orders for a restaurant (owner / chef view)
export function fetchOrdersByRestaurant(restaurantId) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: liveOrders.filter((o) => o.restaurantId === restaurantId),
        }),
      400,
    );
  });
}

// Single order detail
export function fetchOrderById(orderId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = liveOrders.find(
        (o) => o.id === orderId || o.orderId === orderId,
      );
      if (!order) return reject({ error: "Order not found" });
      resolve({ data: order });
    }, 300);
  });
}

// Generic status update (owner override / socket event)
export function updateOrderStatus(orderId, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = liveOrders.find(
        (o) => o.id === orderId || o.orderId === orderId,
      );
      if (!order) return reject({ error: "Order not found" });
      order.status = status;
      resolve({ data: { ...order } });
    }, 300);
  });
}
