import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coins: [],
  loading: false,
  selectedCoin: "bitcoin",
};

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    setCoins(state, action) {
      state.coins = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSelectedCoin(state, action) {
      state.selectedCoin = action.payload;
    },
  },
});

export const { setCoins, setLoading, setSelectedCoin } = coinsSlice.actions;

export default coinsSlice.reducer;
