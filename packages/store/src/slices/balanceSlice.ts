// packages/store/src/slices/balanceSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BalanceState {
  amount: number;
}

const initialState: BalanceState = {
  amount: 0,
};

export const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
    increment: (state) => {
      state.amount += 1;
    },
  },
});

export const { setBalance, increment } = balanceSlice.actions;
export default balanceSlice.reducer;
