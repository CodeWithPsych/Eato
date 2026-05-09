import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardStats,
  fetchOwnerMenu,
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  fetchOwnerCategories,
  addCategory,
  deleteCategory,
  fetchChefs,
  addChef,
  updateChef,
  deleteChef,
  fetchOrdersByRestaurant,
  updateOrderStatus,
} from "./ownerApi";
import { loginOwner, logoutOwner, getOwnerMe } from "./ownerAuthApi";

// ── Error normaliser ──────────────────────────────────────────
const msg = (err) =>
  err?.response?.data?.message ?? err?.message ?? "Something went wrong";

// ── Auth thunks ───────────────────────────────────────────────
export const loginOwnerAsync = createAsyncThunk(
  "owner/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await loginOwner(email, password);
      return res.data?.data;          // { ownerId, name, email, restaurantId, accessToken }
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const logoutOwnerAsync = createAsyncThunk(
  "owner/logout",
  async (_, { rejectWithValue }) => {
    try { await logoutOwner(); }
    catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const getOwnerMeAsync = createAsyncThunk(
  "owner/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOwnerMe();
      return res.data?.data;          // { ownerId, name, email, restaurantId, isVerified }
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// ── Dashboard ─────────────────────────────────────────────────
export const fetchDashboardStatsAsync = createAsyncThunk(
  "owner/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchDashboardStats();
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// ── Menu ──────────────────────────────────────────────────────
export const fetchOwnerMenuAsync = createAsyncThunk(
  "owner/fetchMenu",
  async (category, { rejectWithValue }) => {
    try {
      const res = await fetchOwnerMenu(category);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const addMenuItemAsync = createAsyncThunk(
  "owner/addMenuItem",
  async ({ item }, { rejectWithValue }) => {
    try {
      const res = await addMenuItem(item);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const editMenuItemAsync = createAsyncThunk(
  "owner/editMenuItem",
  async ({ itemId, updates }, { rejectWithValue }) => {
    try {
      const res = await editMenuItem(itemId, updates);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const deleteMenuItemAsync = createAsyncThunk(
  "owner/deleteMenuItem",
  async ({ itemId }, { rejectWithValue }) => {
    try {
      const res = await deleteMenuItem(itemId);
      return res.data?.data;          // { deletedId }
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// ── Categories ────────────────────────────────────────────────
export const fetchOwnerCategoriesAsync = createAsyncThunk(
  "owner/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchOwnerCategories();
      return res.data?.data;          // [{ _id, name, emoji, image }]
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const addCategoryAsync = createAsyncThunk(
  "owner/addCategory",
  async ({ name, emoji, imageFile }, { rejectWithValue }) => {
    try {
      const res = await addCategory(name, emoji, imageFile);
      return res.data?.data;          // full categories array
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "owner/deleteCategory",
  async ({ categoryId }, { rejectWithValue }) => {
    try {
      const res = await deleteCategory(categoryId);
      return res.data?.data;          // full categories array after deletion
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// ── Chefs ─────────────────────────────────────────────────────
export const fetchChefsAsync = createAsyncThunk(
  "owner/fetchChefs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchChefs();
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const addChefAsync = createAsyncThunk(
  "owner/addChef",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addChef(data);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const updateChefAsync = createAsyncThunk(
  "owner/updateChef",
  async ({ chefId, updates }, { rejectWithValue }) => {
    try {
      const res = await updateChef(chefId, updates);
      return res.data?.data;
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

export const deleteChefAsync = createAsyncThunk(
  "owner/deleteChef",
  async (chefId, { rejectWithValue }) => {
    try {
      const res = await deleteChef(chefId);
      return res.data?.data;          // { deletedId }
    } catch (e) { return rejectWithValue(msg(e)); }
  }
);

// ── Initial State ─────────────────────────────────────────────
const initialState = {
  // auth
  ownerId: null,
  ownerName: null,
  ownerEmail: null,
  restaurantId: null,
  isLoggedIn: false,

  // data
  menu: [],
  categories: [],
  chefs: [],
  stats: null,

  status: {
    auth: "idle",
    stats: "idle",
    menu: "idle",
    categories: "idle",
    chefs: "idle",
  },
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────
const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setOwnerRestaurantId: (state, { payload }) => { state.restaurantId = payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // ── Auth ────────────────────────────────────────────────
      .addCase(loginOwnerAsync.pending,   (s) => { s.status.auth = "loading"; s.error = null; })
      .addCase(loginOwnerAsync.fulfilled, (s, { payload }) => {
        s.status.auth   = "succeeded";
        s.isLoggedIn    = true;
        s.ownerId       = payload?.ownerId;
        s.ownerName     = payload?.name;
        s.ownerEmail    = payload?.email;
        s.restaurantId  = payload?.restaurantId ?? null;
      })
      .addCase(loginOwnerAsync.rejected,  (s, { payload }) => {
        s.status.auth = "failed"; s.error = payload;
      })

      .addCase(logoutOwnerAsync.fulfilled, (s) => { Object.assign(s, initialState); })

      .addCase(getOwnerMeAsync.fulfilled, (s, { payload }) => {
        s.ownerId      = payload?.ownerId;
        s.ownerName    = payload?.name;
        s.ownerEmail   = payload?.email;
        s.restaurantId = payload?.restaurantId?._id ?? payload?.restaurantId ?? null;
        s.isLoggedIn   = true;
      })

      // ── Stats ───────────────────────────────────────────────
      .addCase(fetchDashboardStatsAsync.pending,   (s) => { s.status.stats = "loading"; })
      .addCase(fetchDashboardStatsAsync.fulfilled,  (s, { payload }) => { s.status.stats = "succeeded"; s.stats = payload; })
      .addCase(fetchDashboardStatsAsync.rejected,   (s, { payload }) => { s.status.stats = "failed"; s.error = payload; })

      // ── Menu ────────────────────────────────────────────────
      .addCase(fetchOwnerMenuAsync.pending,   (s) => { s.status.menu = "loading"; })
      .addCase(fetchOwnerMenuAsync.fulfilled,  (s, { payload }) => { s.status.menu = "succeeded"; s.menu = payload ?? []; })
      .addCase(fetchOwnerMenuAsync.rejected,   (s, { payload }) => { s.status.menu = "failed"; s.error = payload; })
      .addCase(addMenuItemAsync.fulfilled,    (s, { payload }) => { s.menu.push(payload); })
      .addCase(editMenuItemAsync.fulfilled,   (s, { payload }) => {
        const i = s.menu.findIndex((m) => m._id === payload._id);
        if (i !== -1) s.menu[i] = payload;
      })
      .addCase(deleteMenuItemAsync.fulfilled, (s, { payload }) => {
        s.menu = s.menu.filter((m) => m._id !== payload.deletedId);
      })

      // ── Categories ──────────────────────────────────────────
      .addCase(fetchOwnerCategoriesAsync.pending,   (s) => { s.status.categories = "loading"; })
      .addCase(fetchOwnerCategoriesAsync.fulfilled,  (s, { payload }) => { s.status.categories = "succeeded"; s.categories = payload ?? []; })
      .addCase(addCategoryAsync.fulfilled,           (s, { payload }) => { s.categories = payload ?? []; })
      .addCase(deleteCategoryAsync.fulfilled,        (s, { payload }) => { s.categories = payload ?? []; })

      // ── Chefs ───────────────────────────────────────────────
      .addCase(fetchChefsAsync.pending,   (s) => { s.status.chefs = "loading"; })
      .addCase(fetchChefsAsync.fulfilled,  (s, { payload }) => { s.status.chefs = "succeeded"; s.chefs = payload ?? []; })
      .addCase(addChefAsync.fulfilled,    (s, { payload }) => { s.chefs.push(payload); })
      .addCase(updateChefAsync.fulfilled, (s, { payload }) => {
        const i = s.chefs.findIndex((c) => c._id === payload.chefId);
        if (i !== -1) s.chefs[i] = { ...s.chefs[i], ...payload };
      })
      .addCase(deleteChefAsync.fulfilled, (s, { payload }) => {
        s.chefs = s.chefs.filter((c) => c._id !== payload.deletedId);
      })

      // catch-all rejected
      .addMatcher(
        (action) => action.type.startsWith("owner/") && action.type.endsWith("/rejected"),
        (s, { payload }) => { s.error = payload ?? "Something went wrong"; }
      );
  },
});

export const { setOwnerRestaurantId, clearError } = ownerSlice.actions;

export const selectOwnerRestaurantId      = (s) => s.owner.restaurantId;
export const selectOwnerIsLoggedIn        = (s) => s.owner.isLoggedIn;
export const selectOwnerName              = (s) => s.owner.ownerName;
export const selectOwnerMenu              = (s) => s.owner.menu;
export const selectOwnerCategories        = (s) => s.owner.categories;
export const selectOwnerChefs             = (s) => s.owner.chefs;
export const selectDashboardStats         = (s) => s.owner.stats;
export const selectOwnerMenuStatus        = (s) => s.owner.status.menu;
export const selectOwnerCategoriesStatus  = (s) => s.owner.status.categories;
export const selectOwnerChefsStatus       = (s) => s.owner.status.chefs;
export const selectOwnerStatsStatus       = (s) => s.owner.status.stats;
export const selectOwnerAuthStatus        = (s) => s.owner.status.auth;
export const selectOwnerError             = (s) => s.owner.error;

export default ownerSlice.reducer;