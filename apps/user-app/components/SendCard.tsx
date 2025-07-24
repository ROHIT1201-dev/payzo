"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

import { TextInput } from "@repo/ui/TextInput";
import { useEffect, useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
export function SendCard({ upiNumber }: { upiNumber?: string }) {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [toNumber, setToNumber] = useState("");

  useEffect(() => {
    if (upiNumber) {
      setToNumber(upiNumber);
    }
  }, [upiNumber]);

  return (
    <div className="h-[43vh] flex justify-center mt-3">
      <Card title="Send">
        <div className="min-w-72 pt-2">
          <TextInput
            placeholder={"Number"}
            label="Number"
            onChange={(value) => {
              setNumber(value);
              setToNumber(value);
            }}
          />
          <TextInput
            placeholder={"Amount"}
            label="Amount"
            onChange={(value) => {
              setAmount(value);
            }}
          />
          <div className="pt-4 flex justify-center">
            <Button
              onClick={async () => {
                await p2pTransfer(number, Number(amount) * 100);
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
