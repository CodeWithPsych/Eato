import { create } from "zustand";

export const useOrdersStore = create((set, get) => ({
  orders: [],

  addOrder: (order) => {
    set({ orders: [...get().orders, order] });
  },

  acceptOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: "accepted" } : o
      ),
    })),

  rejectOrder: (id) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: "rejected" } : o
      ),
    })),

  markOrderReady: (id) => {
    // Update status to ready
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status: "ready" } : o
      ),
    }));

    // Remove order after 30 seconds
  //   setTimeout(() => {
  //     set((state) => ({
  //       orders: state.orders.filter((o) => o.id !== id),
  //     }));
  //   }, 30000); // 30 seconds
  },

  clearOrders: () => set({ orders: [] }),
}));
