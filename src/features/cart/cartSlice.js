import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import cartItems from '../../cartItems';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
  cartItems: [],
  amount: 4,
  total: 0,
  isLoading: false,
};

export const getCartItems = createAsyncThunk(
  'cart/getCartItems',
  // first param is the args that we can pass with dispatch, we don't use it here
  async (_, thunkAPI) => {
    try {
      // console.log(thunkAPI.getState());
      const resp = await fetch(url);
      if (!resp.ok) {
        throw resp.statusText;
      }
      return resp.json();
    } catch (error) {
      console.log('err', error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

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
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  // builder callback notation, (new in RTK, recommended for typescript too)
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        // action.payload => what the is returned by the payloadCreator function
        console.log(action);
        state.isLoading = false;
      });
  },
  // object key notation (now it's deprecated)
  // extraReducers: {
  //   [getCartItems.pending]: (state) => {
  //     state.isLoading = true;
  //   },
  //   [getCartItems.fulfilled]: (state, action) => {
  //     console.log(action);
  //     state.isLoading = false;
  //     state.cartItems = action.payload;
  //   },
  //   [getCartItems.rejected]: (state, action) => {
  //     // action.payload => what the is returned by the payloadCreator function
  //     state.isLoading = false;
  //   },
  // },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
