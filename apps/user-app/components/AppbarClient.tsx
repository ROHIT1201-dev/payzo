"use client"
import {signIn,signOut,useSession} from "next-auth/react";
import {useRouter} from "next/navigation"
import { Appbar } from "@repo/ui/appbar";
import React from 'react'

export default function AppbarClient() {
  const session=useSession();
  const router=useRouter();
  return (
    <div>
      <Appbar onSignin={signIn} onSignout={async ()=>{
        await signOut()
        router.push("/api/auth/signin")
      }} user={session.data?.user}/>
    </div>
  )
}
