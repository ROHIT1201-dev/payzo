"use client"

import { useSearchParams } from "next/navigation"
import { SendCard } from "./SendCard";

export function P2PClientWrapper(){
    const searchParams = useSearchParams();
    const number = searchParams.get("number") || undefined;

    return <SendCard upiNumber={number}/>
}