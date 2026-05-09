import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  fetchOrdersByRestaurant,
  fetchOrderById,
  updateOrderStatus,
  fetchOrdersByUser,
} from "./orderApi";

const msg = (err) =>
  err?.response?.data?.message ?? err?.message ?? "Something went wrong";

// ── Thunks ────────────────────────────────────────────────────
export const createOrderAsync = createAsyncThunk(
  "orders/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createOrder(data);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// For customer table order history: pass { restaurantId, tableNumber }
export const fetchOrdersByUserAsync = createAsyncThunk(
  "orders/fetchByUser",
  async ({ restaurantId, tableNumber }, { rejectWithValue }) => {
    try {
      const res = await fetchOrdersByUser(restaurantId, tableNumber);
      return res.data?.data ?? [];
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// For owner order list: pass optional { status, page, limit }
export const fetchOrdersByRestaurantAsync = createAsyncThunk(
  "orders/fetchByRestaurant",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await fetchOrdersByRestaurant(params);
      return res.data?.data?.orders ?? res.data?.data ?? [];
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const fetchOrderByIdAsync = createAsyncThunk(
  "orders/fetchById",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await fetchOrderById(orderId);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const updateOrderStatusAsync = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await updateOrderStatus(orderId, status);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// ── Helper ────────────────────────────────────────────────────
const mergeOrder = (orders, updated) =>
  orders.map((o) => (o._id === updated._id ? updated : o));

// ── Initial State ─────────────────────────────────────────────
const initialState = {
  userOrders: [],
  restaurantOrders: [],
  selectedOrder: null,
  lastPlacedOrder: null,
  status: {
    create:     "idle",
    userOrders: "idle",
    restOrders: "idle",
    detail:     "idle",
    update:     "idle",
  },
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError:          (s) => { s.error = null; },
    clearLastPlacedOrder:(s) => { s.lastPlacedOrder = null; },
    clearSelectedOrder:  (s) => { s.selectedOrder = null; },
    // Socket.io hook: socket.on('order:updated', (o) => dispatch(syncOrderStatus(o)))
    syncOrderStatus: (s, { payload }) => {
      s.userOrders       = mergeOrder(s.userOrders, payload);
      s.restaurantOrders = mergeOrder(s.restaurantOrders, payload);
      if (s.selectedOrder?._id === payload._id) s.selectedOrder = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending,   (s) => { s.status.create = "loading"; })
      .addCase(createOrderAsync.fulfilled, (s, { payload }) => {
        s.status.create  = "succeeded";
        s.lastPlacedOrder = payload;
        s.userOrders.unshift(payload);
      })
      .addCase(createOrderAsync.rejected,  (s, { payload }) => { s.status.create = "failed"; s.error = payload; })

      .addCase(fetchOrdersByUserAsync.pending,   (s) => { s.status.userOrders = "loading"; })
      .addCase(fetchOrdersByUserAsync.fulfilled,  (s, { payload }) => { s.status.userOrders = "succeeded"; s.userOrders = payload; })
      .addCase(fetchOrdersByUserAsync.rejected,   (s, { payload }) => { s.status.userOrders = "failed"; s.error = payload; })

      .addCase(fetchOrdersByRestaurantAsync.pending,   (s) => { s.status.restOrders = "loading"; })
      .addCase(fetchOrdersByRestaurantAsync.fulfilled,  (s, { payload }) => { s.status.restOrders = "succeeded"; s.restaurantOrders = payload; })
      .addCase(fetchOrdersByRestaurantAsync.rejected,   (s, { payload }) => { s.status.restOrders = "failed"; s.error = payload; })

      .addCase(fetchOrderByIdAsync.pending,   (s) => { s.status.detail = "loading"; })
      .addCase(fetchOrderByIdAsync.fulfilled,  (s, { payload }) => { s.status.detail = "succeeded"; s.selectedOrder = payload; })
      .addCase(fetchOrderByIdAsync.rejected,   (s, { payload }) => { s.status.detail = "failed"; s.error = payload; })

      .addCase(updateOrderStatusAsync.pending,   (s) => { s.status.update = "loading"; })
      .addCase(updateOrderStatusAsync.fulfilled,  (s, { payload }) => {
        s.status.update    = "succeeded";
        s.userOrders       = mergeOrder(s.userOrders, payload);
        s.restaurantOrders = mergeOrder(s.restaurantOrders, payload);
        if (s.selectedOrder?._id === payload._id) s.selectedOrder = payload;
      })
      .addCase(updateOrderStatusAsync.rejected,   (s, { payload }) => { s.status.update = "failed"; s.error = payload; });
  },
});

export const {
  clearError, clearLastPlacedOrder, clearSelectedOrder, syncOrderStatus,
} = orderSlice.actions;

export const selectUserOrders        = (s) => s.orders.userOrders;
export const selectRestaurantOrders  = (s) => s.orders.restaurantOrders;
export const selectSelectedOrder     = (s) => s.orders.selectedOrder;
export const selectLastPlacedOrder   = (s) => s.orders.lastPlacedOrder;
export const selectCreateStatus      = (s) => s.orders.status.create;
export const selectUserOrdersStatus  = (s) => s.orders.status.userOrders;
export const selectRestOrdersStatus  = (s) => s.orders.status.restOrders;
export const selectOrderDetailStatus = (s) => s.orders.status.detail;
export const selectOrderUpdateStatus = (s) => s.orders.status.update;
export const selectOrderError        = (s) => s.orders.error;

export default orderSlice.reducer;