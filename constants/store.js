import { configureStore } from "@reduxjs/toolkit";
import chefReducer from "../services/chefSlice";
import customerReducer from "../services/customerSlice";
import orderReducer from "../services/orderSlice";
import ownerReducer from "../services/ownerSlice";
import restaurantReducer from "../services/restaurantSlice";

const store = configureStore({
  reducer: {
    customer: customerReducer,
    restaurant: restaurantReducer,
    owner: ownerReducer,
    chef: chefReducer,
    orders: orderReducer,
  },
  // When integrating Socket.io, add your socket middleware here:
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(socketMiddleware),
});

export default store;

/*
 * Socket.io wiring (future):
 *
 * import { pushIncomingOrder } from '../app/chef/chefSlice';
 * import { syncOrderStatus }   from '../app/orders/orderSlice';
 *
 * export const socketMiddleware = (store) => {
 *   const socket = io('https://your-api.com');
 *   socket.on('order:new',     (order) => store.dispatch(pushIncomingOrder(order)));
 *   socket.on('order:updated', (order) => store.dispatch(syncOrderStatus(order)));
 *   return (next) => (action) => next(action);
 * };
 */
