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
  const[url,setUrl] = useState("")

  useEffect(() => {
    if (upiNumber) {
      setToNumber(upiNumber);
    }
  }, [upiNumber]);

  useEffect(()=>{
    const handler = () =>{
      const value=localStorage.getItem("result")?.split("=")[1] || "";
      setUrl(value)
      setNumber(value)
      console.log(localStorage.getItem("result"));
    }
    window.addEventListener("storage",handler)
    handler()
    return () => {
      window.removeEventListener("storage", handler);
    };
  },[])



  

  return (
    <div className="h-[43vh] flex justify-center mt-3">
      <Card title="Send">
        <div className="min-w-72 pt-2">
          <TextInput
            placeholder={"Number"}
            label="Number"
            value={number}
            onChange={(value) => {
              setNumber(value);
              setToNumber(value);
            }}
          />
          <TextInput
            placeholder={"Amount"}
            label="Amount"
            value={amount}
            onChange={(value) => {
              setAmount(value);
            }}
          />
          <div className="pt-4 flex justify-center">
            <Button
              onClick={async () => {
                await p2pTransfer(number, Number(amount) * 100);
              localStorage.removeItem("result"); // 👈 clear stored value
              setNumber("");
              setToNumber("");
              setAmount("");

              // refresh if you still want
              window.location.reload();
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
