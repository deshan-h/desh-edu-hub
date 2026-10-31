"use client";

import {
  Shield,
  Activity,
  Cpu,
  CheckCircle2,
  Terminal,
  Zap,
  Globe,
  Radio,
} from "lucide-react";

export default function CyberAbout() {
  const stats = [
    { label: "Total Network Operations", value: "48.2 Billion", change: "+24.8% MoM" },
    { label: "Mean Time To Recover", value: "< 14 ms", change: "Sub-threshold" },
    { label: "Encrypted Core Relays", value: "9,420+", change: "Global Cluster" },
    { label: "Active Enterprise Nodes", value: "1,280", change: "100% Isolated" },
  ];

  const pillars = [
    {
      title: "Zero-Trust Kernel",
      desc: "Every remote procedure call and system invocation is cryptographically authenticated with dynamic rotating session keys.",
    },
    {
      title: "Deterministic Replay",
      desc: "Distributed Raft consensus log ensures high availability and byte-for-byte state synchronization across disparate cloud regions.",
    },
    {
      title: "Hardened Sandboxes",
      desc: "Lightweight containerized microVM isolation with strict memory boundary controls and zero host leakage risk.",
    },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Architecture &amp; Mission</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
            Forged for Extreme Resiliency
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Engineered from silicon to the edge runtime to withstand partition events, hostile threat vectors, and heavy computational throughput.
          </p>

          <div className="flex justify-center pt-2">
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          </div>
        </div>

        {/* 2-Column Architecture Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Interactive Feature Card Container */}
          <div className="relative group">
            {/* Ambient animated gradient glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-700 pointer-events-none" />

            <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-[2rem] shadow-2xl space-y-6">
              {/* Top highlight beam */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Cluster Control Shell</h4>
                    <p className="text-xs text-slate-400 font-mono">mesh-node-us-east-1 // active</p>
                  </div>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Simulated Code Shell */}
              <div className="bg-slate-950/90 rounded-2xl p-4 font-mono text-xs text-slate-300 border border-white/5 space-y-2">
                <p className="text-slate-500">// Initiating cryptographic attestation...</p>
                <p className="text-cyan-400">&gt; mesh.verify_enclave(&quot;pqc-kyber1024&quot;) [OK]</p>
                <p className="text-emerald-400">&gt; multi_cloud_mesh.sync(nodes=9420) [VERIFIED]</p>
                <p className="text-slate-400">&gt; zero_trust_lease.rotate_keys(interval=300s)</p>
                <p className="text-purple-400 font-bold">&gt;&gt; SYSTEM STATUS: OPTIMAL (0 errors logged)</p>
              </div>

              {/* Inner Nested Grid Items */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg">
                  <p className="text-xs text-slate-400">Hardware Attestation</p>
                  <p className="text-base font-bold text-white mt-1">SEV-SNP &amp; SGX</p>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg">
                  <p className="text-xs text-slate-400">Consensus Round</p>
                  <p className="text-base font-bold text-cyan-300 mt-1">3.4 ms latency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Architectural Pillars */}
          <div className="space-y-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-cyan-400/40 hover:bg-slate-900/90 transition-all duration-300 shadow-xl group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 text-cyan-400 group-hover:text-emerald-400 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Divider Glow Line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        {/* 4 Large Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl text-center space-y-2 group hover:border-cyan-500/40 transition-all"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {stat.value}
              </p>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-800/60">
                {stat.change}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

