"use client";

import Image from "next/image";

/**
 * Reusable React Component for "DESH EduHub" Logo Branding.
 * Ultra-Premium, High-Contrast Typography with glowing metallic accents.
 */
export default function DeshEduHubLogo({
  showIcon = false,
  size = "navbar", // "navbar" | "sm" | "md" | "lg"
  className = "",
}) {
  const sizeClasses = {
    navbar: {
      text: "text-[13.5px] sm:text-[16px] md:text-[17px]",
      hub: "text-[9.5px] sm:text-[11px] md:text-[11.5px] tracking-[0.28em] sm:tracking-[0.32em]",
      dash: "w-3 sm:w-4",
    },
    sm: {
      text: "text-xs sm:text-sm md:text-base",
      hub: "text-[9px] sm:text-[10.5px] md:text-[11.5px] tracking-[0.24em] sm:tracking-[0.28em]",
      dash: "w-2.5 sm:w-3",
    },
    md: {
      text: "text-base sm:text-xl md:text-2xl",
      hub: "text-[11px] sm:text-[13px] md:text-[14px] tracking-[0.26em] sm:tracking-[0.3em]",
      dash: "w-4 sm:w-5",
    },
    lg: {
      text: "text-xl sm:text-2xl md:text-3xl",
      hub: "text-[13px] sm:text-[15px] md:text-[17px] tracking-[0.28em] sm:tracking-[0.32em]",
      dash: "w-5 sm:w-6",
    },
  };

  const current = sizeClasses[size] || sizeClasses.navbar;

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none whitespace-nowrap shrink-0 pointer-events-none ${className}`}
    >
      {/* Optional 3D Metallic Emblem Icon with Glass Pedestal */}
      {showIcon && (
        <div className="relative shrink-0 flex items-center justify-center p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/80 dark:border-white/15 shadow-sm shadow-slate-900/5 dark:shadow-cyan-500/20 group-hover:shadow-md group-hover:shadow-blue-500/25 group-hover:border-blue-400/60 dark:group-hover:border-cyan-400/50 transition-all duration-300">
          <Image
            src="/icon-512.png"
            alt="DESH EduHub Emblem"
            width={44}
            height={44}
            className="w-7.5 h-7.5 sm:w-9 sm:h-9 object-contain drop-shadow-[0_2px_6px_rgba(15,23,42,0.18)] dark:drop-shadow-[0_0_12px_rgba(56,189,248,0.45)] transition-transform duration-300 group-hover:scale-106"
            priority
          />
        </div>
      )}

      {/* Two-Line Typographic Lockup: "DESH Edu" on top, "HUB ──" below */}
      <div className="flex flex-col items-start justify-center leading-none pointer-events-auto">
        {/* Top Line: DESH Edu */}
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
          {/* "DESH" - Electric Deep Royal Blue to Indigo Gradient */}
          <span
            className={`font-black uppercase tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 dark:from-cyan-300 dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_0_14px_rgba(56,189,248,0.45)] ${current.text}`}
            style={{
              letterSpacing: "-0.03em",
            }}
          >
            DESH
          </span>

          {/* "Edu" - High Contrast Titanium Slate to Crisp White */}
          <span
            className={`font-black tracking-tight text-slate-800 dark:text-white filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_1px_6px_rgba(255,255,255,0.25)] ${current.text}`}
            style={{
              letterSpacing: "-0.02em",
            }}
          >
            Edu
          </span>

          {/* Micro Glowing Sparkle Dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 dark:from-cyan-300 dark:to-sky-400 shadow-xs shadow-cyan-400/50 inline-block animate-pulse ml-0.5" />
        </div>

        {/* Bottom Line: "HUB" with Sleek Linear Accent */}
        <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 leading-none">
          <span
            className={`block font-black uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-cyan-300 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] ${current.hub}`}
          >
            HUB
          </span>
          <span
            className={`h-[2px] rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 dark:from-cyan-400 dark:via-sky-400 dark:to-indigo-400 opacity-80 ${current.dash}`}
          />
        </div>
      </div>
    </div>
  );
}
