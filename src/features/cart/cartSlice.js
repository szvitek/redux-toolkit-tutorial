import { createSlice } from '@reduxjs/toolkit';
import cartItems from '../../cartItems';

const initialState = {
  cartItems: cartItems,
  amount: 4,
  total: 0,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      // with redux-toolkit we can directly mutate the state
      // without returning any value from a reducer function
      // because of the immer library
      // -----------------------------
      // alternatively we can return the new state if we want to
      // useful when resetting the state back to its initial value
      state.cartItems = [];
    },
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
