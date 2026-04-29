import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    acceptOrder,
    fetchKitchenOrders,
    markOrderReady,
    rejectOrder,
    updatePrepTime,
} from './customerApi';

// Default restaurant — update dynamically when multi-restaurant support is added
const DEFAULT_RESTAURANT = 'res_001';

// ── Async Thunks ──────────────────────────────────────────────

export const fetchMenuAsync = createAsyncThunk(
  'customer/fetchMenu',
  async (restaurantId = DEFAULT_RESTAURANT, { rejectWithValue }) => {
    try {
      return (await fetchMenu(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);


export const fetchMenuByCategoryAsync = createAsyncThunk(
  'customer/fetchMenuByCategory',
  async (arg, { rejectWithValue }) => {
    try {
      const restaurantId =
        typeof arg === 'object' ? arg.restaurantId ?? DEFAULT_RESTAURANT : DEFAULT_RESTAURANT;
      const category = typeof arg === 'object' ? arg.category ?? 'All' : arg ?? 'All';
      return (await fetchMenuByCategory(restaurantId, category)).data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchCategoriesAsync = createAsyncThunk(
  'customer/fetchCategories',
  async (restaurantId = DEFAULT_RESTAURANT, { rejectWithValue }) => {
    try {
      return (await fetchCategories(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchRestaurantDetailsAsync = createAsyncThunk(
  'customer/fetchRestaurantDetails',
  async (restaurantId = DEFAULT_RESTAURANT, { rejectWithValue }) => {
    try {
      return (await fetchRestaurantDetails(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(err);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuAsync.pending, (state) => {
        state.status.menu = 'loading';
      })
      .addCase(fetchMenuAsync.fulfilled, (state, { payload }) => {
        state.status.menu = 'succeeded';
        state.menu = payload;
      })
      .addCase(fetchMenuAsync.rejected, (state, { payload }) => {
        state.status.menu = 'failed';
        state.error = payload;
      })

      .addCase(fetchMenuByCategoryAsync.pending, (state) => {
        state.status.menu = 'loading';
      })
      .addCase(fetchMenuByCategoryAsync.fulfilled, (state, { payload }) => {
        state.status.menu = 'succeeded';
        state.menu = payload;
      })
      .addCase(fetchMenuByCategoryAsync.rejected, (state, { payload }) => {
        state.status.menu = 'failed';
        state.error = payload;
      })

      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status.categories = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, { payload }) => {
        state.status.categories = 'succeeded';
        state.categories = ['All', ...payload];
      })
      .addCase(fetchCategoriesAsync.rejected, (state, { payload }) => {
        state.status.categories = 'failed';
        state.error = payload;
      })

      .addCase(fetchRestaurantDetailsAsync.pending, (state) => {
        state.status.restaurant = 'loading';
      })
      .addCase(fetchRestaurantDetailsAsync.fulfilled, (state, { payload }) => {
        state.status.restaurant = 'succeeded';
        state.restaurantDetails = payload;
      })
      .addCase(fetchRestaurantDetailsAsync.rejected, (state, { payload }) => {
        state.status.restaurant = 'failed';
        state.error = payload;
      });
  },
});

export const { setCategory, clearError } = customerSlice.actions;

// ── Selectors ─────────────────────────────────────────────────
export const selectMenu = (s) => s.customer.menu;
export const selectCategories = (s) => s.customer.categories;
export const selectSelectedCategory = (s) => s.customer.selectedCategory;
export const selectRestaurantDetails = (s) => s.customer.restaurantDetails;
export const selectMenuStatus = (s) => s.customer.status.menu;
export const selectCategoriesStatus = (s) => s.customer.status.categories;
export const selectRestaurantStatus = (s) => s.customer.status.restaurant;
export const selectCustomerError = (s) => s.customer.error;

export default customerSlice.reducer;