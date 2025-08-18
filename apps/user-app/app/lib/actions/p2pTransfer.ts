"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { timeStamp } from "console";

export async function p2pTransfer(to: string, amount: number) {
  console.log("hulullulu");
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  console.log("userid", userId);
  if (!userId) {
    return {
      message: "Error while sending",
    };
  }
  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });
  console.log("to user", toUser);
  if (!toUser) {
    console.log("User not found");
    return {
      message: "User not found",
    };
  }

  if (amount <= 0 || amount==null) {
    console.log("Enter valid amount");
    return {
      message: "Enter valid amount",
    };
  }
  await prisma.$transaction(async (tx:any) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(userId)} FOR UPDATE`;
    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(userId) },
    });

    //   console.log("above sleep");
    //   await new Promise((res) => setTimeout(res,4000));
    //    console.log("after sleep");t
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }
    console.log("userid in p2p", userId);
    await tx.balance.update({
      where: { userId: Number(userId) },
      data: { amount: { decrement: amount } },
    });

    await tx.balance.upsert({
      where: { userId: toUser.id },
      update: { amount: { increment: amount } },
      create: {
        userId: toUser.id,
        amount: amount,
        locked:0,
      },
    });

    await tx.p2pTransfer.create({
      data: {
        fromUserId: Number(userId),
        toUserId: toUser.id,
        amount,
        timeStamp: new Date(),
      },
    });
  });
}
