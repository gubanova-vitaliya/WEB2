import { configureStore, combineReducers } from "@reduxjs/toolkit";
import dataReducer from "./slices/dataSlice";

// Объединение всех редьюсеров
const rootReducer = combineReducers({
  ourData: dataReducer
  // Здесь можно добавить другие редьюсеры
  // например: cart: cartReducer, user: userReducer
});

// Создание и настройка хранилища
const store = configureStore({
  reducer: rootReducer,
  // Можно добавить middleware, devTools и другие опции
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

