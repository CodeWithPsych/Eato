import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllRestaurants, fetchRestaurantById } from "./restaurantApi";

export const fetchAllRestaurantsAsync = createAsyncThunk(
  "restaurant/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return (await fetchAllRestaurants()).data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const fetchRestaurantByIdAsync = createAsyncThunk(
  "restaurant/fetchById",
  async (restaurantId, { rejectWithValue }) => {
    try {
      return (await fetchRestaurantById(restaurantId)).data;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const initialState = {
  restaurants: [],
  selectedRestaurant: null,
  status: { list: "idle", detail: "idle" },
  error: null,
};

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
      })
      .addCase(fetchAllRestaurantsAsync.fulfilled, (state, { payload }) => {
        state.status.list = "succeeded";
        state.restaurants = payload;
      })
      .addCase(fetchAllRestaurantsAsync.rejected, (state, { payload }) => {
        state.status.list = "failed";
        state.error = payload;
      })

      .addCase(fetchRestaurantByIdAsync.pending, (state) => {
        state.status.detail = "loading";
      })
      .addCase(fetchRestaurantByIdAsync.fulfilled, (state, { payload }) => {
        state.status.detail = "succeeded";
        state.selectedRestaurant = payload;
      })
      .addCase(fetchRestaurantByIdAsync.rejected, (state, { payload }) => {
        state.status.detail = "failed";
        state.error = payload;
      });
  },
});

export const { clearSelectedRestaurant, clearError } = restaurantSlice.actions;

export const selectRestaurants = (s) => s.restaurant.restaurants;
export const selectSelectedRestaurant = (s) => s.restaurant.selectedRestaurant;
export const selectListStatus = (s) => s.restaurant.status.list;
export const selectDetailStatus = (s) => s.restaurant.status.detail;
export const selectRestaurantError = (s) => s.restaurant.error;

export default restaurantSlice.reducer;
