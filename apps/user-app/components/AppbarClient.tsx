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
       await signOut({ redirect: false });
  router.push("/signin");
      }} user={session.data?.user}/>
    </div>
  )
}
