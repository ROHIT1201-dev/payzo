"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

import { Select } from "@repo/ui/Select";
import { useState } from "react";
import { TextInput } from "@repo/ui/TextInput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptxn";
import axios from "axios";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );

  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");

  const handleStatus = async (token: any, transactionId: any, amount: any) => {
    console.log("request arrived");
    console.log("Token:", token);
    console.log("Transaction ID:", transactionId);
    console.log("Amount:", amount);
    // Handle status updates here
    try {
      const res=await axios.post("https://payzo-bank-webhook.onrender.com/hdfcWebhook", {
        token: token,
        user_identifier: transactionId,
        amount: amount*100,
      });
      console.log(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          value={Number(amount)}
          onChange={(value) => {
            setAmount(Number(value));
          }}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={(value) => {
            setRedirectUrl(
              SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
            );
            setProvider(
              SUPPORTED_BANKS.find((x) => x.name === value)?.name || ""
            );
          }}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4 ">
          <Button
            onClick={async () => {
              const res = await createOnRampTransaction(amount * 100, provider);

              console.log(res.token);
              const token = res.token;
              const transactionId = res.id;
              handleStatus(token, transactionId,amount);
              // window.location.href = redirectUrl || "";

            }}
          >
            Add Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
