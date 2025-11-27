import { combineReducers, configureStore } from "@reduxjs/toolkit";
import gasReducer from "./slices/gasSlice";
import cartReducer from "./slices/cartSlice";

const rootReducer = combineReducers({
  gas: gasReducer,
  cart: cartReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем проверки сериализации для дат в корзине
        ignoredActions: ['cart/addToCart'],
        ignoredPaths: ['cart.items.addedAt']
      }
    })
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

