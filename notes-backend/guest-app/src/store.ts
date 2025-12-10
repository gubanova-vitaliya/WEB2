import { configureStore, combineReducers } from "@reduxjs/toolkit";
import gasCalculationReducer from "./slices/dataSlice";
import gasReducer from "./slices/gasSlice";
import cartReducer from "./slices/cartSlice";

// Объединение всех редьюсеров
const rootReducer = combineReducers({
  gasCalculation: gasCalculationReducer,
  gas: gasReducer,
  cart: cartReducer
  // Здесь можно добавить другие редьюсеры
  // например: user: userReducer
});

// Создание и настройка хранилища
const store = configureStore({
  reducer: rootReducer,
  // Включаем Redux DevTools для отладки
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Отключаем проверку для определенных типов действий, если нужно
        ignoredActions: [],
      },
    }),
});

// Экспорт типов для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;




