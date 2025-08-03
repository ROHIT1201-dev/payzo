import express from "express";
import db from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  // TODO: Add zod validation here?
  // TODO: HDFC bank should ideally send us a secret so we know this is sent by them

  // Always parse fields from the webhook
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  try {
    // 1. Find transaction by token
    const userData = await db.onRampTransaction.findMany({
      where: { token: paymentInformation.token },
    });
    const transaction = userData[0];
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    // 2. Get status and userId from transaction
    const userStatus = transaction.status;
    const userId = transaction.userId;

    console.log("Found transaction:", transaction);
    console.log("Current status:", userStatus);

    // 3. (Optional) Log types and data
    console.log(
      "Attempting updateMany with userId:",
      userId,
      "type:",
      typeof userId
    );

    const balanceCheck = await db.balance.findFirst({
      where: { userId: userId },
    });
    console.log("Balance records:", balanceCheck);
    console.log("Increment started");

    if (userStatus === "Processing") {
      try {
        // Always use userId from transaction for correct DB update!
        const result = await db.$transaction([
          db.balance.updateMany({
            where: { userId: userId },
            data: {
              amount: {
                increment: Number(paymentInformation.amount),
              },
            },
          }),
          db.onRampTransaction.updateMany({
            where: { token: paymentInformation.token },
            data: { status: "Success" },
          }),
        ]);

        console.log("Transaction completed:", result);
        console.log("Increment ended");
        res.json({ message: "Captured" });
      } catch (dbError) {
        console.error("Database transaction failed:", dbError);
        res.status(500).json({
          message: "Database transaction failed",
        });
      }
    } else {
      console.log("Transaction already processed or invalid status");
      res.json({
        message: `Transaction is already ${userStatus || "processed"}`,
      });
    }
  } catch (e) {
    console.error("Webhook processing error:", e);
    res.status(411).json({ message: "Error while processing webhook" });
  }
});

app.listen(3003, () => {
  console.log("Webhook server running on port 3003");
});
