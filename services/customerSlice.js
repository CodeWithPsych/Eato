import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchMenu,
  fetchMenuByCategory,
  fetchCategories,
  fetchRestaurantDetails,
  scanQr,
} from "./customerApi";

const msg = (err) =>
  err?.response?.data?.message ?? err?.message ?? "Something went wrong";

// ── Thunks ────────────────────────────────────────────────────
export const scanQrAsync = createAsyncThunk(
  "customer/scanQr",
  async (qrPayload, { rejectWithValue }) => {
    try {
      const res = await scanQr(qrPayload);
      return res.data?.data;   // { wifi, restaurant, session }
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const fetchMenuAsync = createAsyncThunk(
  "customer/fetchMenu",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const res = await fetchMenu(restaurantId);
      return res.data?.data ?? [];
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const fetchMenuByCategoryAsync = createAsyncThunk(
  "customer/fetchMenuByCategory",
  async (arg, { rejectWithValue }) => {
    try {
      const restaurantId = typeof arg === "object" ? arg.restaurantId : null;
      const category     = typeof arg === "object" ? (arg.category ?? "All") : (arg ?? "All");
      if (!restaurantId) return rejectWithValue("restaurantId is required");
      const res = await fetchMenuByCategory(restaurantId, category);
      return res.data?.data ?? [];
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const fetchCategoriesAsync = createAsyncThunk(
  "customer/fetchCategories",
  async (restaurantId, { rejectWithValue }) => {
    try {
      if (!restaurantId) return rejectWithValue("restaurantId is required");
      const res = await fetchCategories(restaurantId);
      return res.data?.data ?? [];
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const fetchRestaurantDetailsAsync = createAsyncThunk(
  "customer/fetchRestaurantDetails",
  async (restaurantId, { rejectWithValue }) => {
    try {
      if (!restaurantId) return rejectWithValue("restaurantId is required");
      const res = await fetchRestaurantDetails(restaurantId);
      return res.data?.data ?? {};
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// ── Initial State ─────────────────────────────────────────────
const initialState = {
  menu: [],
  categories: [],
  selectedCategory: "All",
  restaurantDetails: null,
  // QR scan result
  session: null,        // { customerId, sessionTag, tableNumber }
  wifi: null,           // { ssid, password, type, connectionString }
  status: {
    menu: "idle",
    categories: "idle",
    restaurant: "idle",
    scan: "idle",
  },
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCategory: (state, action) => { state.selectedCategory = action.payload; },
    clearError:  (state) => { state.error = null; },
    resetCustomer: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // scan QR
      .addCase(scanQrAsync.pending,   (s) => { s.status.scan = "loading"; })
      .addCase(scanQrAsync.fulfilled, (s, { payload }) => {
        s.status.scan       = "succeeded";
        s.wifi              = payload?.wifi ?? null;
        s.restaurantDetails = payload?.restaurant ?? null;
        s.menu              = payload?.restaurant?.menu ?? [];
        s.categories        = ["All", ...(payload?.restaurant?.categories?.map((c) => c.name) ?? [])];
        s.session           = payload?.session ?? null;
      })
      .addCase(scanQrAsync.rejected,  (s, { payload }) => { s.status.scan = "failed"; s.error = payload; })

      // fetchMenu
      .addCase(fetchMenuAsync.pending,   (s) => { s.status.menu = "loading"; })
      .addCase(fetchMenuAsync.fulfilled,  (s, { payload }) => { s.status.menu = "succeeded"; s.menu = payload; })
      .addCase(fetchMenuAsync.rejected,   (s, { payload }) => { s.status.menu = "failed"; s.error = payload; })

      // fetchMenuByCategory
      .addCase(fetchMenuByCategoryAsync.pending,   (s) => { s.status.menu = "loading"; })
      .addCase(fetchMenuByCategoryAsync.fulfilled,  (s, { payload }) => { s.status.menu = "succeeded"; s.menu = payload; })
      .addCase(fetchMenuByCategoryAsync.rejected,   (s, { payload }) => { s.status.menu = "failed"; s.error = payload; })

      // fetchCategories
      .addCase(fetchCategoriesAsync.pending,   (s) => { s.status.categories = "loading"; })
      .addCase(fetchCategoriesAsync.fulfilled,  (s, { payload }) => {
        s.status.categories = "succeeded";
        s.categories = ["All", ...payload];
      })
      .addCase(fetchCategoriesAsync.rejected,   (s, { payload }) => { s.status.categories = "failed"; s.error = payload; })

      // fetchRestaurantDetails
      .addCase(fetchRestaurantDetailsAsync.pending,   (s) => { s.status.restaurant = "loading"; })
      .addCase(fetchRestaurantDetailsAsync.fulfilled,  (s, { payload }) => { s.status.restaurant = "succeeded"; s.restaurantDetails = payload; })
      .addCase(fetchRestaurantDetailsAsync.rejected,   (s, { payload }) => { s.status.restaurant = "failed"; s.error = payload; });
  },
});

export const { setCategory, clearError, resetCustomer } = customerSlice.actions;

export const selectMenu              = (s) => s.customer.menu;
export const selectCategories        = (s) => s.customer.categories;
export const selectSelectedCategory  = (s) => s.customer.selectedCategory;
export const selectRestaurantDetails = (s) => s.customer.restaurantDetails;
export const selectSession           = (s) => s.customer.session;
export const selectWifi              = (s) => s.customer.wifi;
export const selectMenuStatus        = (s) => s.customer.status.menu;
export const selectCategoriesStatus  = (s) => s.customer.status.categories;
export const selectRestaurantStatus  = (s) => s.customer.status.restaurant;
export const selectScanStatus        = (s) => s.customer.status.scan;
export const selectCustomerError     = (s) => s.customer.error;

export default customerSlice.reducer;