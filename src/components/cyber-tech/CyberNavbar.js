"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Cpu, Menu, X, ArrowRight } from "lucide-react";

export default function CyberNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "#hero" },
    { label: "Ecosystem", href: "#services" },
    { label: "Architecture", href: "#about" },
    { label: "Live Nodes", href: "#metrics" },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 left-0 right-0 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* 1. Left: Cyber Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Cpu className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-xl tracking-tight text-white drop-shadow">
                DESH
              </span>
              <span className="font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                DIGITAL
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase mt-0.5">
              // HUB OS v3.2
            </span>
          </div>
        </Link>

        {/* 2. Center: Nav Links Pill Container */}
        <div className="hidden md:flex items-center bg-slate-900/50 px-6 py-2.5 rounded-full border border-white/5 shadow-inner backdrop-blur-md gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
            >
              <span>{link.label}</span>
              {/* Active / Hover Beam under link */}
              <span className="absolute -bottom-1.5 left-1/2 w-0 h-0.5 bg-cyan-400 rounded-full transition-all duration-300 ease-out group-hover:w-full group-hover:left-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </a>
          ))}
        </div>

        {/* 3. Right: CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#services"
            className="group relative px-5 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Launch Portal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-bold text-slate-200 hover:text-cyan-400 py-1 transition"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full group relative px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(8,145,178,0.3)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Portal</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

