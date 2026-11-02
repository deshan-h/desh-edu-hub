"use client";

import Image from "next/image";

/**
 * Reusable React Component for "DESH EduHub" Logo Branding.
 * Layout: "DESH Edu" on top, "HUB" directly beneath with tight line spacing and no rounded rectangle.
 */
export default function DeshEduHubLogo({
  showIcon = false,
  size = "md",
  className = "",
}) {
  const sizeClasses = {
    sm: {
      text: "text-xs sm:text-sm md:text-base",
      hub: "text-[10px] sm:text-[11.5px] md:text-[12.5px] tracking-[0.22em] sm:tracking-[0.25em]",
    },
    md: {
      text: "text-sm sm:text-lg md:text-xl",
      hub: "text-[12px] sm:text-[14px] md:text-[15px] tracking-[0.24em] sm:tracking-[0.26em]",
    },
    lg: {
      text: "text-lg sm:text-2xl md:text-3xl",
      hub: "text-[14px] sm:text-[17px] md:text-[19px] tracking-[0.26em] sm:tracking-[0.28em]",
    },
  };

  const current = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 select-none whitespace-nowrap shrink-0 pointer-events-none ${className}`}
    >
      {/* Optional 3D Metallic Emblem Icon */}
      {showIcon && (
        <div className="relative shrink-0 filter drop-shadow-[0_4px_8px_rgba(15,23,42,0.18)] dark:drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/desh-eduhub-logo.png"
            alt="DESH EduHub Metallic Emblem"
            width={48}
            height={48}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain rounded-xl"
            priority
          />
        </div>
      )}

      {/* Two-Line Typographic Lockup: "DESH Edu" on top, "HUB" directly below with minimal line height */}
      <div className="flex flex-col items-start justify-center leading-none pointer-events-auto">
        {/* Top Line: DESH Edu */}
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
          {/* "DESH" - Deep Metallic Blue Gradient */}
          <span
            className={`font-black uppercase tracking-tight bg-gradient-to-r from-[#0c2e59] via-[#1d6fc6] to-[#071930] dark:from-[#60a5fa] dark:via-[#93c5fd] dark:to-[#3b82f6] bg-clip-text text-transparent filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.3)] ${current.text}`}
            style={{
              letterSpacing: "-0.03em",
            }}
          >
            DESH
          </span>

          {/* "Edu" - Sleek Metallic Chrome / Silver Gradient */}
          <span
            className={`font-black tracking-tight bg-gradient-to-r from-[#334155] via-[#94a3b8] to-[#1e293b] dark:from-[#ffffff] dark:via-[#e2e8f0] dark:to-[#cbd5e1] bg-clip-text text-transparent filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)] ${current.text}`}
            style={{
              letterSpacing: "-0.02em",
            }}
          >
            Edu
          </span>
        </div>

        {/* Bottom Line: "HUB" - Bold text with high-contrast Dark Mode glowing gradient */}
        <div className="mt-0.5 sm:mt-1 leading-none">
          <span
            className={`block font-black uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-cyan-300 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_0_12px_rgba(56,189,248,0.45)] ${current.hub}`}
          >
            HUB
          </span>
        </div>
      </div>
    </div>
  );
}
