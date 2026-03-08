"use client"

export default function Footer() {
  return (
    <footer className="bg-[#07070F] border-t border-white/[0.06] py-12 px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-5 h-5 bg-[#6367FF]"
              style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
            />
            <span className="font-black" style={{ fontFamily: "Syne, sans-serif" }}>OnlyPaid</span>
          </div>
          <p className="text-white/25 text-[12px] leading-relaxed max-w-[200px]">
            Zero-knowledge paywall infrastructure for encrypted digital assets.
          </p>
        </div>

        {[
          { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
          { title: "Developers", links: ["Docs", "API Reference", "SDK", "Status"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Security"] },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-white/20 text-[11px] tracking-[0.15em] uppercase mb-4">{col.title}</p>
            {col.links.map((l) => (
              <a
                key={l}
                href="#"
                className="block text-white/40 text-[13px] mb-2.5 hover:text-white transition-colors duration-150"
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-2 text-white/20 text-[12px]">
        <span>© 2025 OnlyPaid Inc. All rights reserved.</span>
        <div className="flex gap-6">
          {["Privacy", "Terms", "SOC 2"].map((l) => (
            <a key={l} href="#" className="hover:text-white transition-colors duration-150">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
