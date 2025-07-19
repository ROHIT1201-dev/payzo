import { Card } from "@repo/ui/card";
import { SendCard } from "../../../components/SendCard";

import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { time, timeStamp } from "console";

async function getP2Ptransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
    select: {
    amount: true,
    timeStamp: true,
    toUserId: true,
    toUser: {
      select: {
        id: true,
        name: true,
        number: true,
      },
    },
  },
  });
  return txns.map((t) => ({
    amount: t.amount,
    time: t.timeStamp,
    toUser: {
      id: t.toUserId,
      name: t.toUser?.name,
      number: t.toUser?.number,
    },
  }));
}
export default async function () {
    const transactions=await getP2Ptransactions();

  return (
    <div className="w-full">
      <SendCard />

      <div className="w-auto">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
          P2P  Transactions
        </div>
        <div className="px-3 bg-white  w-20 py-1 rounded-2xl font-medium">
          History
        </div>

        <div className=" h-auto m-2 p-2 rounded-xl">
          <div>
            <Card title="Transactions">
              <div className="pt-2">
                {transactions.map((t, index) => {
                  let statusColor = "text-green-600";
                //   if (t.status === "Success") statusColor = "text-green-600";
                //   else if (t.status === "Failure") statusColor = "text-red-600";
                //   else if (t.status === "Processing")
                //     statusColor = "text-black";

                  return (
                    <div key={index} className="flex justify-between mb-2">
                      <div>
                        <div className="text-sm">Send INR</div>
                        <div className={`text-xs ${statusColor}`}>
                          {t.time.toDateString()} — {t.status}
                        </div>
                      </div>
                      <div
                        className={`flex flex-col justify-center ${statusColor}`}
                      >
                        - ₹{(t.amount / 100).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
