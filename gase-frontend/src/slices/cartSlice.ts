import { createSlice } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks/useTypedRedux";

interface CartState {
  items: number[];
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.items.push(action.payload);
      state.totalItems = state.items.length;
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((id) => id !== action.payload);
      state.totalItems = state.items.length;
    },
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export const useCartTotalItems = () => {
  return useAppSelector((state: any) => state.cart?.totalItems || 0);
};

export default cartSlice.reducer;

