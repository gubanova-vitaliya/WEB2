import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './slices/todosSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    ourData: dataReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
