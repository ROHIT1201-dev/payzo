import express from "express";
import db from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  //TODO: Add zod validation here?
  //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

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
    const userData = await db.onRampTransaction.findMany({
      where: {
        token: paymentInformation.token,
      },
    });

    const userStatus = userData[0]?.status;
    console.log("Found transaction:", userData);
    console.log("Current status:", userStatus);
    console.log("Increment started");

    if (userStatus === "Processing") {
      try {
        const result = await db.$transaction([
          db.balance.updateMany({
            where: {
              userId: Number(paymentInformation.userId),
            },
            data: {
              amount: {
                increment: Number(paymentInformation.amount),
              },
            },
          }),
          db.onRampTransaction.updateMany({
            where: {
              token: paymentInformation.token,
            },
            data: {
              status: "Success",
            },
          }),
        ]);

        console.log("Transaction completed:", result);
        console.log("Increment ended");
        res.json({
          message: "Captured",
        });
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
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003, () => {
  console.log("Webhook server running on port 3003");
});