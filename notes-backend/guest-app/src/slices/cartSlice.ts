import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "../hooks/useTypedRedux";
import { Gas } from "./gasSlice";

interface CartItem {
  gas: Gas;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  isVisible: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  isVisible: false
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Gas>) {
      const existingItem = state.items.find(item => item.gas.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          gas: action.payload,
          quantity: 1
        });
      }
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.gas.id !== action.payload);
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    updateQuantity(state, action: PayloadAction<{ gasId: number; quantity: number }>) {
      const item = state.items.find(item => item.gas.id === action.payload.gasId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.gas.id !== action.payload.gasId);
        } else {
          item.quantity = action.payload.quantity;
        }
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      }
    },
    
    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
    },
    
    toggleCartVisibility(state) {
      state.isVisible = !state.isVisible;
    },
    
    setCartVisibility(state, action: PayloadAction<boolean>) {
      state.isVisible = action.payload;
    }
  }
});

// Selectors
export const useCartItems = () =>
  useAppSelector((state: any) => state.cart.items);

export const useCartTotalItems = () =>
  useAppSelector((state: any) => state.cart.totalItems);

export const useCartVisibility = () =>
  useAppSelector((state: any) => state.cart.isVisible);

export const useCartItemCount = (gasId: number) =>
  useAppSelector((state: any) => {
    const item = state.cart.items.find((item: CartItem) => item.gas.id === gasId);
    return item ? item.quantity : 0;
  });

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCartVisibility,
  setCartVisibility
} = cartSlice.actions;

export default cartSlice.reducer;




