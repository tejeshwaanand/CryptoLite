import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  watchlist: [], // Initialize with an empty array
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist(state, action) {
      const coin = action.payload;
      if (!state.watchlist.some((item) => item.id === coin.id)) {
        state.watchlist.push(coin);
      }
    },
    removeFromWatchlist(state, action) {
      state.watchlist = state.watchlist.filter(
        (item) => item.id !== action.payload
      );
    },
    setWatchlist(state, action) {
      state.watchlist = action.payload;
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, setWatchlist } =
  watchlistSlice.actions;

export default watchlistSlice.reducer;
