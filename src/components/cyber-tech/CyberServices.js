"use client";

import {
  Cpu,
  Shield,
  Layers,
  Globe,
  Database,
  Terminal,
  Server,
  Radio,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";

export default function CyberServices() {
  const primaryServices = [
    {
      title: "Edge Cloud Computing",
      badge: "ULTRA LOW-LATENCY",
      desc: "Distributed compute clusters situated adjacent to carrier exchange facilities with sub-millisecond execution.",
      icon: <Server className="w-6 h-6 text-cyan-400" />,
      features: [
        "WASM & Isolated V8 micro-runtimes",
        "Geographic instant cold-start replication",
        "Stateless scale-to-zero microVMs",
      ],
      nestedItems: [
        { name: "Global Edge Nodes", stat: "340+ PoPs" },
        { name: "P99 Execution", stat: "1.2ms" },
        { name: "Auto Concurrency", stat: "Infinite" },
      ],
    },
    {
      title: "Quantum Defense Enclave",
      badge: "CRYPTO SECURITY",
      desc: "Post-quantum lattice cryptographic vaults enforcing end-to-end multi-party encryption for enterprise workloads.",
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      features: [
        "Kyber-1024 quantum-resilient keys",
        "Hardware Secure Enclave memory attestation",
        "Automated continuous compliance auditing",
      ],
      nestedItems: [
        { name: "Encryption Standard", stat: "FIPS 140-3" },
        { name: "Threat Neutralization", stat: "< 240ms" },
        { name: "Zero Trust Auditing", stat: "Real-time" },
      ],
    },
    {
      title: "Autonomous AI Relays",
      badge: "NEURAL MESH",
      desc: "Distributed LLM and agentic runtime orchestration engine with decentralized context caching and semantic routing.",
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      features: [
        "Model distillation and tensor sharding",
        "Semantic vector streaming cache",
        "Automated agentic workflow fallback",
      ],
      nestedItems: [
        { name: "Throughput Rate", stat: "125k t/s" },
        { name: "Context Window", stat: "2.0M tokens" },
        { name: "Multi-Model Fallback", stat: "Instant" },
      ],
    },
  ];

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>Digital Infrastructure Grid</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
            High-Performance Architecture
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Deploy mission-critical architectures across our global mesh network with hardened glassmorphic ergonomics and telemetry.
          </p>

          {/* Section Accent Line */}
          <div className="flex justify-center pt-2">
            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          </div>
        </div>

        {/* 3 Large Primary Feature Card Containers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {primaryServices.map((svc, idx) => (
            <div key={idx} className="relative group">
              {/* Ambient animated gradient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-700 pointer-events-none" />

              {/* Glass Card Surface */}
              <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between h-full space-y-6">
                {/* Top highlight beam */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-4">
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center shadow-inner">
                      {svc.icon}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-bold">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {svc.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {svc.desc}
                  </p>

                  {/* Bullet perks */}
                  <ul className="space-y-2 pt-2">
                    {svc.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inner Nested Grid Items */}
                <div className="pt-4 space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Telemetry Metrics
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {svc.nestedItems.map((item, nIdx) => (
                      <div
                        key={nIdx}
                        className="bg-slate-800/40 backdrop-blur-md p-2.5 rounded-2xl border border-white/5 hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] text-center"
                      >
                        <p className="text-xs font-black text-cyan-300 truncate">
                          {item.stat}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Divider Glow Line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        {/* Secondary Technical Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Distributed RPC", desc: "Low-overhead binary multiplexing across cluster peers.", icon: <Globe className="w-5 h-5 text-cyan-400" /> },
            { title: "Immutable Audit Log", desc: "Cryptographic hash chaining with tamper-evident zero-knowledge proofs.", icon: <Lock className="w-5 h-5 text-emerald-400" /> },
            { title: "Vector DB Engine", desc: "Simulated HNSW index caching with multi-dimensional cosine metrics.", icon: <Database className="w-5 h-5 text-purple-400" /> },
            { title: "Automated Deployments", desc: "GitOps orchestrated continuous deployment pipeline with canary gates.", icon: <Terminal className="w-5 h-5 text-blue-400" /> },
          ].map((node, idx) => (
            <div
              key={idx}
              className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-cyan-400/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-3 text-cyan-400">
                {node.icon}
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {node.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {node.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

