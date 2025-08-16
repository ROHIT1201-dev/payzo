'use client';

import { Button } from "@repo/ui/button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  User as UserIcon,
  Calendar,
} from "lucide-react";
import { useState } from "react";


export type TransactionUser = {
  id: number;
  name?: string | null;
  number?: string | null;
};

export type Transaction = {
  amount: number;
  time: string;
  fromUserId: number;
  toUserId: number;
  fromUser: TransactionUser;
  toUser: TransactionUser;
};

interface Props {
  transactions: Transaction[];
  sessionUserId: number;
}

export const TransactionHistory = ({ transactions, sessionUserId }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Activity className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start your first transfer using the options above
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-[#6a51a6] hover:bg-[#5a4496]">
              Send Money
            </Button>
            <Button variant="outline">Scan QR Code</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
              <div className="col-span-1">Type</div>
              <div className="col-span-4">Transaction</div>
              <div className="col-span-3">Participant</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {displayedTransactions.map((t, index) => {
              const isOutgoing = t.fromUserId === sessionUserId;
              const sign = isOutgoing ? "-" : "+";
              const statusColor = isOutgoing ? "text-red-600" : "text-green-600";
              const bgColor = isOutgoing ? "bg-red-50" : "bg-green-50";
              const directionLabel = isOutgoing ? "Sent Payment" : "Received Payment";
              const otherUser = isOutgoing ? t.toUser : t.fromUser;

              return (
                <div
                  key={index}
                  className="transaction-item px-6 py-4 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor} group-hover:scale-110 transition-transform`}>
                        {isOutgoing ? (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        ) : (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="font-semibold text-gray-900">
                        {directionLabel}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: ****{String(index).padStart(4, "0")}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {otherUser.name || `User ${otherUser.id}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            ****{otherUser.number?.slice(-4) || "0000"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {t.time
                            ? new Date(t.time).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.time
                          ? new Date(t.time).toLocaleTimeString()
                          : ""}
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className={`text-lg font-bold ${statusColor}`}>
                        {sign} ₹{(t.amount / 100).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isOutgoing ? "Debited" : "Credited"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {transactions.length > 5 && !showAll && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAll(true)}
              >
                View All {transactions.length} Transactions
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
