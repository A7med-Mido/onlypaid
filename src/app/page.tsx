"use client"

import { useState, useEffect } from "react";
import PixelBlast from "@/components/ui/PixelBlast";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    annualPrice: "$23",
    period: "/mo",
    desc: "For indie creators & small projects",
    features: [
      "Up to 50 encrypted assets",
      "1 paywall endpoint",
      "Basic analytics",
      "AES-256 encryption",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$89",
    annualPrice: "$71",
    period: "/mo",
    desc: "For growing businesses & teams",
    features: [
      "Unlimited encrypted assets",
      "10 paywall endpoints",
      "Advanced analytics & logs",
      "AES-256 + RSA encryption",
      "Custom domain gating",
      "Priority support",
      "Webhook integrations",
    ],
    cta: "Get Pro Access",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    annualPrice: "Custom",
    period: "",
    desc: "Full control at any scale",
    features: [
      "Unlimited everything",
      "Dedicated infrastructure",
      "SSO & SAML support",
      "Audit logs & compliance",
      "SLA guarantee",
      "Dedicated account manager",
      "On-prem option available",
    ],
    cta: "Talk to Sales",
    highlight: false,
  },
];

const FEATURES = [
  {
    icon: "⬡",
    title: "Vault Encryption",
    desc: "Military-grade AES-256 encryption for every asset. Keys are derived per-user, per-asset — zero-knowledge by default.",
  },
  {
    icon: "◈",
    title: "Paywall Engine",
    desc: "Drop a single line of code to gate any asset behind Stripe, crypto, or custom auth. Payments unlock decryption in real-time.",
  },
  {
    icon: "◎",
    title: "Access Policies",
    desc: "Time-limited links, per-IP restrictions, download quotas, and revocable tokens. You define the rules.",
  },
  {
    icon: "⬟",
    title: "Audit Trail",
    desc: "Immutable access logs with timestamps, IPs, and decryption events. Compliance-ready exports in one click.",
  },
];

const STATS = [
  { value: "128-bit", label: "Key entropy" },
  { value: "< 80ms", label: "Decrypt latency" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "SOC 2", label: "Compliant" },
];

const STEPS = [
  {
    num: "01",
    title: "Upload & Encrypt",
    body: "Drop any file. Our SDK encrypts it client-side before it ever leaves your machine. Only you hold the master key.",
  },
  {
    num: "02",
    title: "Set Your Price",
    body: "Define access rules: one-time payment, subscription, or token-gated. Connect Stripe or crypto in seconds.",
  },
  {
    num: "03",
    title: "Share the Link",
    body: "Distribute your paywall URL. Buyers pay → decrypt → download. You see real-time access events in your dashboard.",
  },
];

export default function Home() {
  const [annual, setAnnual] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>setMounted(true),[]);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden font-mono">
      <div className="w-full h-screen absolute -z-10">
        <PixelBlast
          variant="square"
          pixelSize={3}
          color="#7EACB5"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.2}
          rippleThickness={0.10}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={12}
          speed={0.5}
          edgeFade={0.01}
          transparent
        />
      </div>


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
          <button className="px-8 py-3 bg-[#7EACB5] cursor-pointer text-white text-sm font-bold tracking-wider hover:bg-[#7A7EFF] hover:shadow-[0_0_32px_#6367FF88] transition-all duration-150">
            Create your vault →
          </button>
          <button className="px-8 py-3 border border-white cursor-pointer text-white text-sm tracking-wider hover:bg-[#6367FF]/10 transition-all duration-150">
            View docs
          </button>
        </div>



      </section>
    </div>
  );
};