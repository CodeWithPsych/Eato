import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchMenu,
  fetchMenuByCategory,
  fetchCategories,
  fetchRestaurantDetails,
} from './customerApi';

// ── Async Thunks ──────────────────────────────────────────────

export const fetchMenuAsync = createAsyncThunk(
  'customer/fetchMenu',
  async (restaurantId, { rejectWithValue }) => {
    try {
      return (await fetchMenu(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(err?.message ?? String(err));
    }
  }
);

export const fetchMenuByCategoryAsync = createAsyncThunk(
  'customer/fetchMenuByCategory',
  async (arg, { rejectWithValue }) => {
    try {
      const restaurantId = typeof arg === 'object' ? arg.restaurantId : null;
      const category = typeof arg === 'object' ? (arg.category ?? 'All') : (arg ?? 'All');
      if (!restaurantId) return rejectWithValue('restaurantId is required');
      return (await fetchMenuByCategory(restaurantId, category)).data;
    } catch (err) {
      return rejectWithValue(err?.message ?? String(err));
    }
  }
);

export const fetchCategoriesAsync = createAsyncThunk(
  'customer/fetchCategories',
  async (restaurantId, { rejectWithValue }) => {
    try {
      if (!restaurantId) return rejectWithValue('restaurantId is required');
      return (await fetchCategories(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(err?.message ?? String(err));
    }
  }
);

export const fetchRestaurantDetailsAsync = createAsyncThunk(
  'customer/fetchRestaurantDetails',
  async (restaurantId, { rejectWithValue }) => {
    try {
      if (!restaurantId) return rejectWithValue('restaurantId is required');
      return (await fetchRestaurantDetails(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(err?.message ?? String(err));
    }
  }
);

// ── Initial State ─────────────────────────────────────────────

const initialState = {
  menu: [],
  categories: [],
  selectedCategory: 'All',
  restaurantDetails: null,
  status: {
    menu: 'idle',
    categories: 'idle',
    restaurant: 'idle',
  },
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCustomer: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchMenu
      .addCase(fetchMenuAsync.pending, (s) => { s.status.menu = 'loading'; })
      .addCase(fetchMenuAsync.fulfilled, (s, { payload }) => {
        s.status.menu = 'succeeded';
        s.menu = payload;
      })
      .addCase(fetchMenuAsync.rejected, (s, { payload }) => {
        s.status.menu = 'failed';
        s.error = payload;
      })

      // fetchMenuByCategory
      .addCase(fetchMenuByCategoryAsync.pending, (s) => { s.status.menu = 'loading'; })
      .addCase(fetchMenuByCategoryAsync.fulfilled, (s, { payload }) => {
        s.status.menu = 'succeeded';
        s.menu = payload;
      })
      .addCase(fetchMenuByCategoryAsync.rejected, (s, { payload }) => {
        s.status.menu = 'failed';
        s.error = payload;
      })

      // fetchCategories
      .addCase(fetchCategoriesAsync.pending, (s) => { s.status.categories = 'loading'; })
      .addCase(fetchCategoriesAsync.fulfilled, (s, { payload }) => {
        s.status.categories = 'succeeded';
        s.categories = ['All', ...payload];
      })
      .addCase(fetchCategoriesAsync.rejected, (s, { payload }) => {
        s.status.categories = 'failed';
        s.error = payload;
      })

      // fetchRestaurantDetails
      .addCase(fetchRestaurantDetailsAsync.pending, (s) => { s.status.restaurant = 'loading'; })
      .addCase(fetchRestaurantDetailsAsync.fulfilled, (s, { payload }) => {
        s.status.restaurant = 'succeeded';
        s.restaurantDetails = payload;
      })
      .addCase(fetchRestaurantDetailsAsync.rejected, (s, { payload }) => {
        s.status.restaurant = 'failed';
        s.error = payload;
      });
  },
});

export const { setCategory, clearError, resetCustomer } = customerSlice.actions;

// ── Selectors ─────────────────────────────────────────────────
export const selectMenu                = (s) => s.customer.menu;
export const selectCategories          = (s) => s.customer.categories;
export const selectSelectedCategory    = (s) => s.customer.selectedCategory;
export const selectRestaurantDetails   = (s) => s.customer.restaurantDetails;
export const selectMenuStatus          = (s) => s.customer.status.menu;
export const selectCategoriesStatus    = (s) => s.customer.status.categories;
export const selectRestaurantStatus    = (s) => s.customer.status.restaurant;
export const selectCustomerError       = (s) => s.customer.error;

export default customerSlice.reducer;