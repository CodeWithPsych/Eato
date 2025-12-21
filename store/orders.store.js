import { create } from "zustand";

export const useOrdersStore = create((set, get) => ({
  orders: [],

  addOrder: (order) => {
    set({ orders: [...get().orders, order] });
  },
}));
