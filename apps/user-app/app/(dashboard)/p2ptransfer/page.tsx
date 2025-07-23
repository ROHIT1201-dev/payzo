import { Card } from "@repo/ui/card";

import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { P2PClientWrapper } from "../../../components/P2PClientWrapper";
import { Button } from "@repo/ui/button";

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
      <div className="flex flex-1/2 justify-center">
        <div>
          <P2PClientWrapper />
        </div>
        <div>
          <div className="h-[43vh] bg-white w-80 mt-3 rounded-lg">
            <div className="w-full bg-purple-600 h-14 rounded-tr-lg rounded-tl-lg flex justify-center items-center text-2xl font-semibold ">
             
              QR Scan
            </div>
            <div className="flex justify-center mt-6">
              <div className="bg-white p-4 rounded-xl border-4 border-transparent bg-gradient-to-r from-white to-white bg-clip-padding border-gradient-to-r from-pink-400 via-teal-300 to-blue-400 shadow-xl animate-pulse h-36 w-36">
                
              </div>
            </div>
          <div className="pt-4 flex justify-center m-2">
            <Button >Start Scanning</Button>
          </div>
          </div>
        </div>
      </div>

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
