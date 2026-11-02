"use client";

import Link from "next/link";
import { Cpu, ArrowRight, Zap, Terminal, Shield, Sparkles } from "lucide-react";

export default function CyberFooter() {
  return (
    <footer className="relative bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 pt-16 pb-12 overflow-hidden">

      {/* Top Banner CTA Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-700 pointer-events-none" />

          <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-[2rem] shadow-2xl text-center space-y-6">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for Deployment</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Begin Interfacing With the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
                Digital Hub Grid
              </span>
            </h3>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Provision instant cryptographic enclaves, configure neural mesh routes, and scale workloads seamlessly.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              {/* Primary Cyan/Blue CTA Button */}
              <a
                href="#services"
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_40px_rgba(8,145,178,0.6)] hover:-translate-y-1 overflow-hidden flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5 text-white" />
                <span>Initialize Core Node</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-2xl pointer-events-none" />
              </a>

              {/* Secondary Glowing Glass Button */}
              <a
                href="#hero"
                className="group relative px-7 py-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-base transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Back To Top ↑</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider Glow Line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent max-w-7xl mx-auto mb-12" />

      {/* Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-sm">
        {/* Col 1: Brand */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              DESH <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DIGITAL</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ultra-resilient cybernetic cloud infrastructure, quantum-hardened enclaves, and distributed edge intelligence.
          </p>
        </div>

        {/* Col 2: Services */}
        <div className="space-y-3">
          <p className="font-bold text-white uppercase text-xs tracking-wider">Architecture</p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#services" className="hover:text-cyan-400 transition">Edge Cloud Mesh</a></li>
            <li><a href="#services" className="hover:text-cyan-400 transition">Quantum Crypto Enclave</a></li>
            <li><a href="#services" className="hover:text-cyan-400 transition">Autonomous AI Relays</a></li>
            <li><a href="#services" className="hover:text-cyan-400 transition">Global Latency Map</a></li>
          </ul>
        </div>

        {/* Col 3: Resources */}
        <div className="space-y-3">
          <p className="font-bold text-white uppercase text-xs tracking-wider">Resources</p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#about" className="hover:text-cyan-400 transition">System Architecture</a></li>
            <li><a href="#hero" className="hover:text-cyan-400 transition">Release Notes v3.2</a></li>
            <li><Link href="/" className="hover:text-cyan-400 transition">DESH EduHub Portal</Link></li>
            <li><a href="https://desh.s.gy/whatsapp" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Technical Support</a></li>
          </ul>
        </div>

        {/* Col 4: Operations & System Health */}
        <div className="space-y-3">
          <p className="font-bold text-white uppercase text-xs tracking-wider">System Status</p>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400">All Clusters Operational</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Telemetry: 0.00% packet loss</p>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} DESH Digital Hub. All cryptographic and network rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="text-[11px] font-mono text-cyan-400/80">ENCRYPTED PROTOCOL // SHA-256</span>
          <a href="https://desh.s.gy/desh-digital-hub" className="hover:text-cyan-400 transition font-bold">
            desh.s.gy/desh-digital-hub
          </a>
        </div>
      </div>

    </footer>
  );
}


