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

// ── Helpers ───────────────────────────────────────────────────
const getId = (o) => o?._id ?? o?.id ?? null;

const mergeOrder = (orders, updated) => {
  if (!updated) return orders;
  const updatedId = getId(updated);
  const exists = orders.some((o) => getId(o) === updatedId);
  if (exists) return orders.map((o) => (getId(o) === updatedId ? updated : o));
  return orders;
};

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

// restaurantId comes from the chef JWT — no param needed on backend
// We accept (and ignore) any arg so callers don't need to change
export const fetchKitchenOrdersAsync = createAsyncThunk(
  "chef/fetchOrders",
  async (_arg, { rejectWithValue }) => {
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
      const exists = state.orders.some((o) => getId(o) === getId(payload));
      if (!exists) state.orders.unshift(payload);
    },
    // Socket.io update: dispatch(socketUpdateOrder(order))
    socketUpdateOrder: (state, { payload }) => {
      state.orders = mergeOrder(state.orders, payload);
      // Remove rejected/cancelled orders from kitchen queue
      const removable = ["rejected", "cancelled", "served"];
      if (removable.includes(payload?.status?.toLowerCase())) {
        state.orders = state.orders.filter(
          (o) => getId(o) !== getId(payload)
        );
      }
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

      .addCase(acceptOrderAsync.pending, (s) => {
        s.status.action = "loading";
      })
      .addCase(acceptOrderAsync.fulfilled, (s, { payload }) => {
        s.status.action = "idle";
        s.orders = mergeOrder(s.orders, payload);
      })
      .addCase(acceptOrderAsync.rejected, (s, { payload }) => {
        s.status.action = "idle";
        s.error = payload;
      })

      .addCase(rejectOrderAsync.pending, (s) => {
        s.status.action = "loading";
      })
      .addCase(rejectOrderAsync.fulfilled, (s, { payload }) => {
        s.status.action = "idle";
        // Remove rejected order from kitchen queue
        if (payload) {
          s.orders = s.orders.filter((o) => getId(o) !== getId(payload));
        }
      })
      .addCase(rejectOrderAsync.rejected, (s, { payload }) => {
        s.status.action = "idle";
        s.error = payload;
      })

      .addCase(updatePrepTimeAsync.fulfilled, (s, { payload }) => {
        s.orders = mergeOrder(s.orders, payload);
      })

      .addCase(markOrderReadyAsync.pending, (s) => {
        s.status.action = "loading";
      })
      .addCase(markOrderReadyAsync.fulfilled, (s, { payload }) => {
        s.status.action = "idle";
        s.orders = mergeOrder(s.orders, payload);
      })
      .addCase(markOrderReadyAsync.rejected, (s, { payload }) => {
        s.status.action = "idle";
        s.error = payload;
      })

      // catch-all rejected
      .addMatcher(
        (action) =>
          action.type.startsWith("chef/") && action.type.endsWith("/rejected"),
        (s, { payload }) => {
          s.error = payload ?? "Something went wrong";
        }
      );
  },
});

export const { clearError, pushIncomingOrder, socketUpdateOrder } =
  chefSlice.actions;

export const selectKitchenOrders = (s) => s.chef.orders;
export const selectPendingOrders = (s) =>
  s.chef.orders.filter((o) =>
    ["pending"].includes((o.status ?? "").toLowerCase())
  );
export const selectAcceptedOrders = (s) =>
  s.chef.orders.filter((o) =>
    ["accepted"].includes((o.status ?? "").toLowerCase())
  );
export const selectReadyOrders = (s) =>
  s.chef.orders.filter((o) =>
    ["ready"].includes((o.status ?? "").toLowerCase())
  );
export const selectChefFetchStatus = (s) => s.chef.status.fetch;
export const selectChefActionStatus = (s) => s.chef.status.action;
export const selectChefAuthStatus = (s) => s.chef.status.auth;
export const selectChefError = (s) => s.chef.error;
export const selectChefIsLoggedIn = (s) => s.chef.isLoggedIn;
export const selectChefRestaurantId = (s) => s.chef.restaurantId;

export default chefSlice.reducer;