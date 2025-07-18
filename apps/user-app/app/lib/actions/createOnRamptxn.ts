"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  const token = (Math.random()*1000).toString();

  const userId = session.user.id;

  if (!userId) {
    return {
      message: "User not loggin in",
    };
  }
  await prisma.onRampTransaction.create({
    data: {
      userId: Number(userId),
      status: "Processing",
      token: token,
      provider,
      amount: amount,
      startTime: new Date(),
    },
  });
  return {
    message: "On ramp transaction added",
  };
}
