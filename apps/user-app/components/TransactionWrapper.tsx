'use client';

import dynamic from "next/dynamic";
import { Transaction, TransactionUser } from "@repo/ui/TransactionHistory";

const TransactionHistory = dynamic(
  () =>
    import("@repo/ui/TransactionHistory").then((m) => m.TransactionHistory),
  { ssr: false }
);

type Props = {
  transactions: Transaction[];
  sessionUserId: number;
};

export function TransactionWrapper(props: Props) {
  return <TransactionHistory {...props} />;
}
