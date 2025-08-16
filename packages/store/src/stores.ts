// packages/store/src/stores.ts

import { configureStore } from "@reduxjs/toolkit";
import balanceReducer from "./slices/balanceSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      balance: balanceReducer,
    },
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
