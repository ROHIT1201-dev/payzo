import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = Number(req.nextUrl.searchParams.get("userId"));
  if (!user)
    return NextResponse.json({ error: "Invalid User" }, { status: 400 });

  const transfer = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: user }, { toUserId: user }],
    },
    orderBy:{timeStamp:"asc"}
  });
  return NextResponse.json({data:transfer})
}
