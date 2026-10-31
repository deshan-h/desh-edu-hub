"use client";

export default function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Ambient Glowing Orbs */}
      {/* Top-Left Glowing Cyan Orb */}
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-pulse" />

      {/* Bottom-Right Glowing Emerald Orb */}
      <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* Center Deep Glowing Blue Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none mix-blend-screen" />

      {/* 2. Cyber Tech Grid Overlay */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
        }}
      />
    </div>
  );
}

