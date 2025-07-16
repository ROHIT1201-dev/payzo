// packages/store/src/hooks/useBalance.ts
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../stores";
import { increment } from "../slices/balanceSlice";

export const useBalance = () => {
  const balance = useSelector((state: RootState) => state.balance.amount);
  

  return balance || 0;
};
