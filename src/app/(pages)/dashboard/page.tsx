"use client";
import { goTo } from "@/actions/redirect";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function page() {
  const session = useSession();
  const [data, setData] = useState(null)
  useEffect(()=>{if(session.status === "unauthenticated") goTo("/api/auth/signin")},[session.status])

  useEffect(()=>{
    async()=>{
      try {
        const res =  await axios.get('');
        setData(res.data);
      } catch(error) {
        console.log(error);
      }
    }
  },[])

  return (
    <div>
      
    </div>
  );
};