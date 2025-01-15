import { combineReducers } from "@reduxjs/toolkit";
import coinsReducer from "./Reducers/coinsMarketCapSlice";
import watchlistReducer from "./Reducers/watchlistSlice";

const rootReducer = combineReducers({
  coins: coinsReducer,
  watchlist: watchlistReducer,
});

export default rootReducer;
