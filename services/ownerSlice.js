import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addCategory,
    addChef,
    addMenuItem,
    deleteCategory,
    deleteChef,
    deleteMenuItem,
    editMenuItem,
    fetchChefs,
    fetchDashboardStats,
    fetchOwnerCategories,
    fetchOwnerMenu,
} from "./ownerApi";

// ── Thunks ────────────────────────────────────────────────────

export const fetchDashboardStatsAsync = createAsyncThunk(
  "owner/fetchStats",
  async (rid, { rejectWithValue }) => {
    try {
      return (await fetchDashboardStats(rid)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const fetchOwnerMenuAsync = createAsyncThunk(
  "owner/fetchMenu",
  async (rid, { rejectWithValue }) => {
    try {
      return (await fetchOwnerMenu(rid)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const addMenuItemAsync = createAsyncThunk(
  "owner/addMenuItem",
  async ({ restaurantId, item }, { rejectWithValue }) => {
    try {
      return (await addMenuItem(restaurantId, item)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const editMenuItemAsync = createAsyncThunk(
  "owner/editMenuItem",
  async ({ restaurantId, itemId, updates }, { rejectWithValue }) => {
    try {
      return (await editMenuItem(restaurantId, itemId, updates)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const deleteMenuItemAsync = createAsyncThunk(
  "owner/deleteMenuItem",
  async ({ restaurantId, itemId }, { rejectWithValue }) => {
    try {
      return (await deleteMenuItem(restaurantId, itemId)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const fetchOwnerCategoriesAsync = createAsyncThunk(
  "owner/fetchCategories",
  async (rid, { rejectWithValue }) => {
    try {
      return (await fetchOwnerCategories(rid)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const addCategoryAsync = createAsyncThunk(
  "owner/addCategory",
  async ({ restaurantId, categoryName }, { rejectWithValue }) => {
    try {
      return (await addCategory(restaurantId, categoryName)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const deleteCategoryAsync = createAsyncThunk(
  "owner/deleteCategory",
  async ({ restaurantId, categoryName }, { rejectWithValue }) => {
    try {
      return (await deleteCategory(restaurantId, categoryName)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const fetchChefsAsync = createAsyncThunk(
  "owner/fetchChefs",
  async (rid, { rejectWithValue }) => {
    try {
      return (await fetchChefs(rid)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const addChefAsync = createAsyncThunk(
  "owner/addChef",
  async (data, { rejectWithValue }) => {
    try {
      return (await addChef(data)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
export const deleteChefAsync = createAsyncThunk(
  "owner/deleteChef",
  async (id, { rejectWithValue }) => {
    try {
      return (await deleteChef(id)).data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

// ── Initial State ─────────────────────────────────────────────

const initialState = {
  menu: [],
  categories: [],
  chefs: [],
  stats: null,
  status: { stats: "idle", menu: "idle", categories: "idle", chefs: "idle" },
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStatsAsync.pending, (s) => {
        s.status.stats = "loading";
      })
      .addCase(fetchDashboardStatsAsync.fulfilled, (s, { payload }) => {
        s.status.stats = "succeeded";
        s.stats = payload;
      })
      .addCase(fetchDashboardStatsAsync.rejected, (s, { payload }) => {
        s.status.stats = "failed";
        s.error = payload;
      })

      .addCase(fetchOwnerMenuAsync.pending, (s) => {
        s.status.menu = "loading";
      })
      .addCase(fetchOwnerMenuAsync.fulfilled, (s, { payload }) => {
        s.status.menu = "succeeded";
        s.menu = payload;
      })
      .addCase(fetchOwnerMenuAsync.rejected, (s, { payload }) => {
        s.status.menu = "failed";
        s.error = payload;
      })

      .addCase(addMenuItemAsync.fulfilled, (s, { payload }) => {
        s.menu.push(payload);
      })
      .addCase(editMenuItemAsync.fulfilled, (s, { payload }) => {
        const i = s.menu.findIndex((m) => m.id === payload.id);
        if (i !== -1) s.menu[i] = payload;
      })
      .addCase(deleteMenuItemAsync.fulfilled, (s, { payload }) => {
        s.menu = s.menu.filter((m) => m.id !== payload.deletedId);
      })

      .addCase(fetchOwnerCategoriesAsync.pending, (s) => {
        s.status.categories = "loading";
      })
      .addCase(fetchOwnerCategoriesAsync.fulfilled, (s, { payload }) => {
        s.status.categories = "succeeded";
        s.categories = payload;
      })
      .addCase(addCategoryAsync.fulfilled, (s, { payload }) => {
        s.categories = payload;
      })
      .addCase(deleteCategoryAsync.fulfilled, (s, { payload }) => {
        s.categories = payload;
      })

      .addCase(fetchChefsAsync.pending, (s) => {
        s.status.chefs = "loading";
      })
      .addCase(fetchChefsAsync.fulfilled, (s, { payload }) => {
        s.status.chefs = "succeeded";
        s.chefs = payload;
      })
      .addCase(addChefAsync.fulfilled, (s, { payload }) => {
        s.chefs.push(payload);
      })
      .addCase(deleteChefAsync.fulfilled, (s, { payload }) => {
        s.chefs = s.chefs.filter((c) => c.id !== payload.deletedId);
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("owner/") && action.type.endsWith("/rejected"),
        (s, { payload }) => {
          s.error = payload ?? "Something went wrong";
        },
      );
  },
});

export const { clearError } = ownerSlice.actions;

export const selectOwnerMenu = (s) => s.owner.menu;
export const selectOwnerCategories = (s) => s.owner.categories;
export const selectOwnerChefs = (s) => s.owner.chefs;
export const selectDashboardStats = (s) => s.owner.stats;
export const selectOwnerMenuStatus = (s) => s.owner.status.menu;
export const selectOwnerCategoriesStatus = (s) => s.owner.status.categories;
export const selectOwnerChefsStatus = (s) => s.owner.status.chefs;
export const selectOwnerStatsStatus = (s) => s.owner.status.stats;
export const selectOwnerError = (s) => s.owner.error;

export default ownerSlice.reducer;
