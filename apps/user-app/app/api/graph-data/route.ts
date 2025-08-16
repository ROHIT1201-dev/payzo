import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = Number(session?.user?.id);
  
  if (!user)
    return NextResponse.json({ error: "Invalid User" }, { status: 400 });

  const transfer = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: user }, { toUserId: user }],
    },
    orderBy:{timeStamp:"asc"}
  });
  const totalSent = transfer
    .filter((t:any) => t.fromUserId === user)
    .reduce((sum:number, t:any) => sum + t.amount, 0);

  const totalReceived = transfer
    .filter((t:any) => t.toUserId === user)
    .reduce((sum:number, t:any) => sum + t.amount, 0);
    console.log(transfer);
  return NextResponse.json({data:transfer,
    user,
    totalReceived,
    totalSent
  })
}
