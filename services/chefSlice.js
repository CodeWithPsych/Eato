import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    acceptOrder,
    fetchKitchenOrders,
    markOrderReady,
    rejectOrder,
    updatePrepTime,
} from "./chefApi";

// ── Thunks ────────────────────────────────────────────────────

export const fetchKitchenOrdersAsync = createAsyncThunk(
  "chef/fetchOrders",
  async (rid, { rejectWithValue }) => {
    try {
      return (await fetchKitchenOrders(rid)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const acceptOrderAsync = createAsyncThunk(
  "chef/acceptOrder",
  async ({ orderId, eta }, { rejectWithValue }) => {
    try {
      return (await acceptOrder(orderId, eta)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const rejectOrderAsync = createAsyncThunk(
  "chef/rejectOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return (await rejectOrder(orderId)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const updatePrepTimeAsync = createAsyncThunk(
  "chef/updatePrepTime",
  async ({ orderId, eta }, { rejectWithValue }) => {
    try {
      return (await updatePrepTime(orderId, eta)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const markOrderReadyAsync = createAsyncThunk(
  "chef/markReady",
  async (orderId, { rejectWithValue }) => {
    try {
      return (await markOrderReady(orderId)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

// ── Helpers ───────────────────────────────────────────────────

const mergeOrder = (orders, updated) =>
  orders.map((o) => (o.id === updated.id ? updated : o));

// ── Initial State ─────────────────────────────────────────────

const initialState = {
  orders: [],
  status: { fetch: "idle", action: "idle" },
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────

const chefSlice = createSlice({
  name: "chef",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Socket.io hook: dispatch(pushIncomingOrder(order)) when a new order arrives
    pushIncomingOrder: (state, { payload }) => {
      if (!state.orders.find((o) => o.id === payload.id))
        state.orders.unshift(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKitchenOrdersAsync.pending, (s) => {
        s.status.fetch = "loading";
      })
      .addCase(fetchKitchenOrdersAsync.fulfilled, (s, { payload }) => {
        s.status.fetch = "succeeded";
        s.orders = payload;
      })
      .addCase(fetchKitchenOrdersAsync.rejected, (s, { payload }) => {
        s.status.fetch = "failed";
        s.error = payload;
      })

      .addCase(acceptOrderAsync.fulfilled, (s, { payload }) => {
        s.orders = mergeOrder(s.orders, payload);
      })
      .addCase(rejectOrderAsync.fulfilled, (s, { payload }) => {
        s.orders = mergeOrder(s.orders, payload);
      })
      .addCase(updatePrepTimeAsync.fulfilled, (s, { payload }) => {
        s.orders = mergeOrder(s.orders, payload);
      })
      .addCase(markOrderReadyAsync.fulfilled, (s, { payload }) => {
        s.orders = mergeOrder(s.orders, payload);
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("chef/") && action.type.endsWith("/rejected"),
        (s, { payload }) => {
          s.error = payload ?? "Something went wrong";
        },
      );
  },
});

export const { clearError, pushIncomingOrder } = chefSlice.actions;

export const selectKitchenOrders = (s) => s.chef.orders;
export const selectPendingOrders = (s) =>
  s.chef.orders.filter((o) => o.status === "Pending");
export const selectAcceptedOrders = (s) =>
  s.chef.orders.filter((o) => o.status === "accepted");
export const selectReadyOrders = (s) =>
  s.chef.orders.filter((o) => o.status === "ready");
export const selectChefFetchStatus = (s) => s.chef.status.fetch;
export const selectChefActionStatus = (s) => s.chef.status.action;
export const selectChefError = (s) => s.chef.error;

export default chefSlice.reducer;
