import { Card } from "@repo/ui/card";
import { SendCard } from "../../../components/SendCard";

import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";

async function getP2Ptransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    select: {
      amount: true,
      timeStamp: true,
      fromUserId: true,
      toUserId: true,
      fromUser: {
        select: {
          id: true,
          name: true,
          number: true,
        },
      },
      toUser: {
        select: {
          id: true,
          name: true,
          number: true,
        },
      },
    },
    orderBy: {
      timeStamp: "desc",
    },
  });

  return {
    sessionUserId: userId,
    transactions: txns.map((t) => ({
      amount: t.amount,
      time: t.timeStamp,
      fromUserId: t.fromUserId,
      toUserId: t.toUserId,
      fromUser: {
        id: t.fromUser.id,
        name: t.fromUser.name,
        number: t.fromUser.number,
      },
      toUser: {
        id: t.toUser.id,
        name: t.toUser.name,
        number: t.toUser.number,
      },
    })),
  };
}

export default async function () {
  const { transactions, sessionUserId } = await getP2Ptransactions();

  return (
    <div className="w-full">
      <SendCard />

      <div className="w-auto">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          P2P Transactions
        </div>
        <div className="px-3 bg-white w-20 py-1 rounded-2xl font-medium">
          History
        </div>

        <div className="h-auto m-2 p-2 rounded-xl">
          <Card title="Transactions">
            <div className="pt-2">
              {transactions.map((t, index) => {
                const isOutgoing = t.fromUserId === sessionUserId;
                const sign = isOutgoing ? "-" : "+";
                const statusColor = isOutgoing
                  ? "text-red-600"
                  : "text-green-600";
                const directionLabel = isOutgoing ? "Sent INR" : "Received INR";

                return (
                  <div key={index} className="flex justify-between mb-2">
                    <div>
                      <div className="text-sm">{directionLabel}</div>
                      <div className={`text-xs ${statusColor}`}>
                        {new Date(t.time).toDateString()}
                      </div>
                    </div>
                    <div
                      className={`flex flex-col justify-center ${statusColor}`}
                    >
                      {sign} ₹{(t.amount / 100).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
