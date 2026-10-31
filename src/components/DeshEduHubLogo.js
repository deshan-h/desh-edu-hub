"use client";

import Image from "next/image";

/**
 * Reusable React Component for "DESH EduHub" 3D Metallic Badge Logo.
 *
 * Requirements fulfilled:
 * 1. Typography: Modern bold sans-serif font (font-extrabold / font-black, tracking-tight).
 * 2. "DESH": Deep metallic blue gradient effect (bg-gradient-to-r, bg-clip-text, text-transparent).
 * 3. "EduHub": Sleek metallic silver/chrome gradient effect.
 * 4. 3D Effect: Subtle drop-shadows & bevel reflections matching a physical 3D metallic badge.
 * 5. Layout: Perfectly aligned horizontally (inline-flex, items-center) for seamless placement in Navbars.
 * 6. Responsive: Mobile and desktop scaling with crisp clarity.
 */
export default function DeshEduHubLogo({
  showIcon = false,
  size = "md",
  className = "",
}) {
  const sizeClasses = {
    sm: "text-sm sm:text-base md:text-lg",
    md: "text-base sm:text-xl md:text-2xl",
    lg: "text-xl sm:text-2xl md:text-3xl",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}
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

      {/* 3D Embossed Metallic Text */}
      <div className="flex items-center leading-none tracking-tight">
        {/* "DESH" - Deep Metallic Blue Gradient with 3D Emboss */}
        <span
          className={`font-black uppercase tracking-tight bg-gradient-to-r from-[#0c2e59] via-[#1d6fc6] to-[#071930] dark:from-[#60a5fa] dark:via-[#93c5fd] dark:to-[#3b82f6] bg-clip-text text-transparent filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_2px_5px_rgba(37,99,235,0.4)] ${currentSize}`}
          style={{
            letterSpacing: "-0.035em",
          }}
        >
          DESH
        </span>

        {/* Space divider */}
        <span className="w-1.5 sm:w-2" />

        {/* "EduHub" - Sleek Metallic Silver / Chrome Gradient with 3D Emboss */}
        <span
          className={`font-black tracking-tight bg-gradient-to-r from-[#334155] via-[#94a3b8] to-[#1e293b] dark:from-[#ffffff] dark:via-[#e2e8f0] dark:to-[#94a3b8] bg-clip-text text-transparent filter drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.15)] ${currentSize}`}
          style={{
            letterSpacing: "-0.025em",
          }}
        >
          Edu<span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">Hub</span>
        </span>
      </div>
    </div>
  );
}
