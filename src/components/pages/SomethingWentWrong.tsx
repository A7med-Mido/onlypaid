"use client"
import { useEffect } from "react";
import { redirect } from "next/navigation";
type Error = "auth error" | "internal server error" | ""

export default function SomethingWentWrong({ error }: { error: Error}) {

  useEffect(()=>{
    setTimeout(()=>{
      redirect("/");
    }, 5000)
  });

  return (
    <div className="flex justify-center items-center h-screen">
        <h1 className="text-5xl text-[#7EACB5] drop-shadow-[0_0_20px_#7EACB5] font-bold text-center">
          Something Went Wrong<br />
          {error}
        </h1>
    </div>
  )
}
