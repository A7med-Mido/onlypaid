"use client"
import { useState, useEffect } from "react";

export default function Home() {
  const [annual, setAnnual] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>setMounted(true),[]);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden font-mono">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6">

        {/* PixelBlast stays as the hero bg */}

        {/* Beta badge */}
        <div
          className={`flex items-center gap-2 border border-[#7EACB5]/50 bg-[#00000099] font-bold text-white text-[9px] lg:text[11px] tracking-[0.14em] uppercase px-3 py-1.5 mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#6ee7b7]" />
          Now in public beta — 500 vaults active
        </div>

        {/* Headline */}
        <h1
          className={`font-black leading-none mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(52px,9vw,100px)", letterSpacing: "-0.03em" }}
        >
          Encrypt.<br />
          <span className="text-[#7EACB5] drop-shadow-[0_0_20px_#7EACB5]">Gate.</span><br />
          Get paid.
        </h1>

        {/* Subheading */}
        <p
          className={`text-white bg-[#00000079] p-2 rounded shadow-[0_0_50px_#000000] text-[15px] leading-relaxed max-w-md mb-10 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          The only paywall infrastructure built around zero-knowledge asset encryption.
          One SDK, any asset, any price.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <button className="px-7.5 py-3 bg-[#7EACB5] cursor-pointer text-white text-sm font-bold tracking-wider hover:bg-[#7A7EFF] hover:shadow-[0_0_32px_#6367FF88] transition-all duration-150">
            Sell your assets
          </button>
          <button className="px-8 py-3 font-bold cursor-pointer text-[#7EACB5] bg-white text-sm tracking-wider hover:bg-[#7A7EFF] hover:text-white hover:shadow-[0_0_32px_#6367FF88] transition-all duration-150">
            get your assets
          </button>
        </div>
      </section>
    </div>
  );
};