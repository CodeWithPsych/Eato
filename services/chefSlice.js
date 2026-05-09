import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  chefLogin,
  chefLogout,
  fetchKitchenOrders,
  acceptOrder,
  rejectOrder,
  markOrderReady,
  updatePrepTime,
} from "./chefApi";

const msg = (err) =>
  err?.response?.data?.message ?? err?.message ?? "Something went wrong";

// ── Thunks ────────────────────────────────────────────────────
export const chefLoginAsync = createAsyncThunk(
  "chef/login",
  async ({ kitchenId, password }, { rejectWithValue }) => {
    try {
      const res = await chefLogin(kitchenId, password);
      return res.data?.data;
    } catch (e) {
      return rejectWithValue(msg(e));
    }
  }
);

export const chefLogoutAsync = createAsyncThunk(
  "chef/logout",
  async (_, { rejectWithValue }) => {
    try {
      await chefLogout();
    } catch (e) {
      return rejectWithValue(msg(e));
    }
  }
);

// restaurantId comes from the chef JWT — no param needed
export const fetchKitchenOrdersAsync = createAsyncThunk(
  "chef/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchKitchenOrders();
      return res.data?.data ?? [];
    } catch (e) {
      return rejectWithValue(msg(e));
    }
  }
);

export const acceptOrderAsync = createAsyncThunk(
  "chef/acceptOrder",
  async ({ orderId, eta }, { rejectWithValue }) => {
    try {
      const res = await acceptOrder(orderId, eta);
      return res.data?.data;
    } catch (e) {
      return rejectWithValue(msg(e));
    }
  }
);

export const rejectOrderAsync = createAsyncThunk(
  "chef/rejectOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await rejectOrder(orderId);
      return res.data?.data;
    } catch (e) {
      return rejectWithValue(msg(e));
    }
  }
);

export const updatePrepTimeAsync = createAsyncThunk(
  "chef/updatePrepTime",
  async ({ orderId, eta }, { rejectWithValue }) => {
    try {
      const res = await updatePrepTime(orderId, eta);
      return res.data?.data;
    } catch (e) {
      return rejectWithValue(msg(e));
    }
  }
);

export const markOrderReadyAsync = createAsyncThunk(
  "chef/markReady",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await markOrderReady(orderId);
      return res.data?.data;
    } catch (e) {
      return rejectWithValue(msg(e));
    }
  }
);

// ── Helper ────────────────────────────────────────────────────
const mergeOrder = (orders, updated) => {
  if (!updated) return orders;
  const exists = orders.find((o) => o._id === updated._id);
  if (exists) return orders.map((o) => (o._id === updated._id ? updated : o));
  return orders;
};

// ── Initial State ─────────────────────────────────────────────
const initialState = {
  chefId: null,
  chefName: null,
  kitchenId: null,
  restaurantId: null,
  isLoggedIn: false,

  orders: [],
  status: { auth: "idle", fetch: "idle", action: "idle" },
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
    // Socket.io push: dispatch(pushIncomingOrder(order))
    pushIncomingOrder: (state, { payload }) => {
      if (!state.orders.find((o) => o._id === payload._id))
        state.orders.unshift(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Auth ──────────────────────────────────────────────────
      .addCase(chefLoginAsync.pending, (s) => {
        s.status.auth = "loading";
        s.error = null;
      })
      .addCase(chefLoginAsync.fulfilled, (s, { payload }) => {
        s.status.auth = "succeeded";
        s.isLoggedIn = true;
        s.chefId = payload?.chefId;
        s.chefName = payload?.name;
        s.kitchenId = payload?.kitchenId;
        s.restaurantId = payload?.restaurantId;
      })
      .addCase(chefLoginAsync.rejected, (s, { payload }) => {
        s.status.auth = "failed";
        s.error = payload;
      })
      .addCase(chefLogoutAsync.fulfilled, () => ({ ...initialState }))

      // ── Orders ────────────────────────────────────────────────
      .addCase(fetchKitchenOrdersAsync.pending, (s) => {
        s.status.fetch = "loading";
        s.error = null;
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
        // Remove rejected orders from the kitchen queue
        if (payload?._id) {
          s.orders = s.orders.filter((o) => o._id !== payload._id);
        }
      })
      .addCase(updatePrepTimeAsync.fulfilled, (s, { payload }) => {
        s.orders = mergeOrder(s.orders, payload);
      })
      .addCase(markOrderReadyAsync.fulfilled, (s, { payload }) => {
        s.orders = mergeOrder(s.orders, payload);
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("chef/") &&
          action.type.endsWith("/rejected"),
        (s, { payload }) => {
          s.error = payload ?? "Something went wrong";
        }
      );
  },
});

export const { clearError, pushIncomingOrder } = chefSlice.actions;

export const selectKitchenOrders = (s) => s.chef.orders;
export const selectPendingOrders = (s) =>
  s.chef.orders.filter((o) => o.status === "pending");
export const selectAcceptedOrders = (s) =>
  s.chef.orders.filter((o) => o.status === "accepted");
export const selectReadyOrders = (s) =>
  s.chef.orders.filter((o) => o.status === "ready");
export const selectChefFetchStatus = (s) => s.chef.status.fetch;
export const selectChefAuthStatus = (s) => s.chef.status.auth;
export const selectChefError = (s) => s.chef.error;
export const selectChefIsLoggedIn = (s) => s.chef.isLoggedIn;

export default chefSlice.reducer;