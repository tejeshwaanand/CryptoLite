// src/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers"; // Create this file for your reducers

const store = configureStore({
  reducer: rootReducer,
});

export default store;
