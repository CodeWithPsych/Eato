import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllRestaurants,
  fetchRestaurantById,
  createRestaurant,
  updateRestaurant,
} from "./restaurantApi";

const serializeError = (err) => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (err.message) return err.message;
  if (err.error) return String(err.error);
  return String(err);
};

// ── Thunks ────────────────────────────────────────────────────

export const fetchAllRestaurantsAsync = createAsyncThunk(
  "restaurant/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return (await fetchAllRestaurants()).data;
    } catch (err) {
      return rejectWithValue(serializeError(err));
    }
  }
);

export const fetchRestaurantByIdAsync = createAsyncThunk(
  "restaurant/fetchById",
  async (restaurantId, { rejectWithValue }) => {
    try {
      return (await fetchRestaurantById(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(serializeError(err));
    }
  }
);

export const createRestaurantAsync = createAsyncThunk(
  "restaurant/create",
  async (restaurantData, { rejectWithValue }) => {
    try {
      return (await createRestaurant(restaurantData)).data;
    } catch (err) {
      return rejectWithValue(serializeError(err));
    }
  }
);

export const updateRestaurantAsync = createAsyncThunk(
  "restaurant/update",
  async ({ restaurantId, updates }, { rejectWithValue }) => {
    try {
      return (await updateRestaurant(restaurantId, updates)).data;
    } catch (err) {
      return rejectWithValue(serializeError(err));
    }
  }
);

// ── Initial State ─────────────────────────────────────────────

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  newRestaurantId: null, // set after successful creation
  status: {
    list: "idle",
    detail: "idle",
    create: "idle",
    update: "idle",
  },
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
    clearNewRestaurantId: (state) => {
      state.newRestaurantId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchAllRestaurantsAsync.pending, (s) => {
        s.status.list = "loading";
        s.error = null;
      })
      .addCase(fetchAllRestaurantsAsync.fulfilled, (s, { payload }) => {
        s.status.list = "succeeded";
        s.restaurants = payload;
      })
      .addCase(fetchAllRestaurantsAsync.rejected, (s, { payload }) => {
        s.status.list = "failed";
        s.error = serializeError(payload);
      })

      // fetchById
      .addCase(fetchRestaurantByIdAsync.pending, (s) => {
        s.status.detail = "loading";
        s.error = null;
      })
      .addCase(fetchRestaurantByIdAsync.fulfilled, (s, { payload }) => {
        s.status.detail = "succeeded";
        s.selectedRestaurant = payload;
      })
      .addCase(fetchRestaurantByIdAsync.rejected, (s, { payload }) => {
        s.status.detail = "failed";
        s.error = serializeError(payload);
      })

      // create
      .addCase(createRestaurantAsync.pending, (s) => {
        s.status.create = "loading";
        s.error = null;
      })
      .addCase(createRestaurantAsync.fulfilled, (s, { payload }) => {
        s.status.create = "succeeded";
        s.restaurants.push(payload);
        s.newRestaurantId = payload.id;
      })
      .addCase(createRestaurantAsync.rejected, (s, { payload }) => {
        s.status.create = "failed";
        s.error = serializeError(payload);
      })

      // update
      .addCase(updateRestaurantAsync.pending, (s) => {
        s.status.update = "loading";
      })
      .addCase(updateRestaurantAsync.fulfilled, (s, { payload }) => {
        s.status.update = "succeeded";
        const idx = s.restaurants.findIndex((r) => r.id === payload.id);
        if (idx !== -1) s.restaurants[idx] = { ...s.restaurants[idx], ...payload };
        if (s.selectedRestaurant?.id === payload.id) {
          s.selectedRestaurant = { ...s.selectedRestaurant, ...payload };
        }
      })
      .addCase(updateRestaurantAsync.rejected, (s, { payload }) => {
        s.status.update = "failed";
        s.error = serializeError(payload);
      });
  },
});

export const { clearSelectedRestaurant, clearNewRestaurantId, clearError } =
  restaurantSlice.actions;

export const selectRestaurants        = (s) => s.restaurant.restaurants;
export const selectSelectedRestaurant = (s) => s.restaurant.selectedRestaurant;
export const selectNewRestaurantId    = (s) => s.restaurant.newRestaurantId;
export const selectListStatus         = (s) => s.restaurant.status.list;
export const selectDetailStatus       = (s) => s.restaurant.status.detail;
export const selectCreateStatus       = (s) => s.restaurant.status.create;
export const selectRestaurantError    = (s) => s.restaurant.error;

export default restaurantSlice.reducer;