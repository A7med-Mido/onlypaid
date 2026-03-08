"use client"
import Image from "next/image"


export default function Navbar() {
  return (
    <nav className="fixed sm:top-5 top-0 left-0 right-0 z-50 flex justify-center items-center">
      <div
        className="flex items-center sm:justify-between justify-between px-6 md:px-10 py-3 bg-[#07070F]/5 sm:rounded-4xl backdrop-blur-xs sm:w-[90%] w-full drop-shadow-[0_0_20px_#00000]"
      >
        <div className="flex items-center gap-2.5">
          {/* <div
            className="w-7 h-7 bg-[#7EACB5]"
            style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
          /> */}
          <Image
            src="/op-removed-bg.png"
            width={40}
            height={40}
            alt="onlypaid logo"
          />
          <span className="text-lg font-black tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            OnlyPaid
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[13px] tracking-wide text-white/40">
          {["Product", "Docs", "Pricing", "Blog"].map((l) => (
            <a key={l} href="#" className="hover:text-white transition-colors duration-150 pb-0.5 hover:border-b hover:border-[#7EACB5]">
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="text-[13px] px-4 py-2 border border-[#7EACB5] text-[#7EACB5] hover:bg-[#6367FF]/10 transition-colors duration-150">
            Log in
          </button> */}
          <button className="text-[13px] cursor-pointer px-5 py-2 bg-[#7EACB5] text-white hover:bg-[#7EACB5] transition-all duration-150 font-bold tracking-wider">
            Start now →
          </button>
        </div>
      </div>
    </nav>
  )
}
