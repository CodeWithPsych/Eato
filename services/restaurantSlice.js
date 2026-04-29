import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllRestaurants, fetchRestaurantById } from "./restaurantApi";

// ── Helper: always store a plain serializable error ───────────
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

// ── Initial State ─────────────────────────────────────────────

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  status: { list: "idle", detail: "idle" },
  error: null, // always a string or null — never an Error object
};

// ── Slice ─────────────────────────────────────────────────────

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRestaurantsAsync.pending, (state) => {
        state.status.list = "loading";
        state.error = null;
      })
      .addCase(fetchAllRestaurantsAsync.fulfilled, (state, { payload }) => {
        state.status.list = "succeeded";
        state.restaurants = payload;
        state.error = null;
      })
      .addCase(fetchAllRestaurantsAsync.rejected, (state, { payload }) => {
        state.status.list = "failed";
        state.error = serializeError(payload);
      })

      .addCase(fetchRestaurantByIdAsync.pending, (state) => {
        state.status.detail = "loading";
        state.error = null;
      })
      .addCase(fetchRestaurantByIdAsync.fulfilled, (state, { payload }) => {
        state.status.detail = "succeeded";
        state.selectedRestaurant = payload;
        state.error = null;
      })
      .addCase(fetchRestaurantByIdAsync.rejected, (state, { payload }) => {
        state.status.detail = "failed";
        state.error = serializeError(payload);
      });
  },
});

export const { clearSelectedRestaurant, clearError } = restaurantSlice.actions;

export const selectRestaurants         = (s) => s.restaurant.restaurants;
export const selectSelectedRestaurant  = (s) => s.restaurant.selectedRestaurant;
export const selectListStatus          = (s) => s.restaurant.status.list;
export const selectDetailStatus        = (s) => s.restaurant.status.detail;
export const selectRestaurantError     = (s) => s.restaurant.error;

export default restaurantSlice.reducer;