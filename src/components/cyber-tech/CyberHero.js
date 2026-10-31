"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Shield,
  Cpu,
  ArrowRight,
  Terminal,
  Activity,
  Flame,
  Radio,
} from "lucide-react";

export default function CyberHero() {
  const perks = [
    { icon: <Zap className="w-4 h-4 text-cyan-400" />, label: "Sub-millisecond Latency" },
    { icon: <Shield className="w-4 h-4 text-emerald-400" />, label: "Zero-Trust Mesh" },
    { icon: <Cpu className="w-4 h-4 text-blue-400" />, label: "Autonomous AI Relays" },
    { icon: <Activity className="w-4 h-4 text-purple-400" />, label: "99.999% SLA Uptime" },
  ];

  return (
    <section id="hero" className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-bold">NEXT-GEN DEPLOYMENT:</span>
            <span className="text-cyan-300">Hub OS Core Online</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl leading-[1.08]">
            Architecting the Future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
              Cybernetics &amp; Digital Clouds
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Next-generation distributed infrastructure tailored for high-scale computing, autonomous intelligence, and edge-native zero-trust security.
          </p>

          {/* Section Accent Line */}
          <div className="flex justify-center py-2">
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          </div>

          {/* Button Component Hierarchy Showcase */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {/* 1. Primary Cyan/Blue CTA Button */}
            <a
              href="#services"
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_40px_rgba(8,145,178,0.6)] hover:-translate-y-1 overflow-hidden flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-white" />
              <span>Explore Ecosystem</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              
              {/* Inner Hover Sweep Effect */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-2xl pointer-events-none" />
            </a>

            {/* 2. Secondary Glowing Glass Button */}
            <a
              href="#about"
              className="group relative px-7 py-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Read Spec Docs</span>
            </a>

            {/* 3. Tertiary / Ghost Button */}
            <a
              href="#metrics"
              className="px-7 py-4 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 text-slate-200 font-bold text-lg hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center cursor-pointer"
            >
              <span>Live Telemetry</span>
            </a>
          </div>

          {/* 4. Pill Feature Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="px-4 py-2.5 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl text-slate-200 text-sm font-semibold flex items-center gap-2 shadow-xl hover:-translate-y-0.5 transition-all cursor-default"
              >
                {perk.icon}
                <span>{perk.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider Glow Line */}
        <div className="my-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        {/* Hero Interactive News & System Status Glassmorphic Card Container */}
        <div className="max-w-4xl mx-auto">
          {/* Feature Card Container with ambient animated gradient glow */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-700 pointer-events-none" />

            <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl">
              {/* Top highlight beam */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
                    <Flame className="w-4 h-4 text-cyan-400 animate-bounce" />
                    <span>Global Network Dispatch // Latest Release</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Quantum Shield Mesh &amp; Cloud Relays v3.2 Available
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xl">
                    Experience automated packet obfuscation, multi-cloud cryptographic failover, and hardware-accelerated enclave processing.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
                  <a
                    href="#services"
                    className="w-full md:w-auto group/btn relative px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Deploy Node</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

