"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import DeshEduHubLogo from "./DeshEduHubLogo";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Read stored user from localStorage
  const loadUser = () => {
    try {
      const stored = localStorage.getItem("desh_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn("Error reading localStorage:", e);
    }
  };

  useEffect(() => {
    loadUser();

    // Check PWA readiness
    if (typeof window !== "undefined" && window.pwaDeferredPrompt) {
      setCanInstallPwa(true);
    }
    const handlePwaReady = () => setCanInstallPwa(true);
    window.addEventListener("pwa_ready_to_install", handlePwaReady);

    // Listen for custom login/logout events so navbar updates instantly
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("desh_user_updated", handleStorageChange);

    // Listen for search reset events from gallery
    const handleSearchReset = () => setSearchQuery("");
    window.addEventListener("desh_search_reset", handleSearchReset);

    return () => {
      window.removeEventListener("pwa_ready_to_install", handlePwaReady);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("desh_user_updated", handleStorageChange);
      window.removeEventListener("desh_search_reset", handleSearchReset);
    };
  }, []);

  // Handle Search Input in Navbar
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("desh_search_query", { detail: val }));
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("desh_search_query", { detail: "" }));
    }
  };

  // Close profile dropdown & mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (menuOpen || mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen, mobileMenuOpen]);

  const handleInstallApp = async () => {
    if (typeof window !== "undefined" && window.pwaDeferredPrompt) {
      window.pwaDeferredPrompt.prompt();
      const choice = await window.pwaDeferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setCanInstallPwa(false);
        window.pwaDeferredPrompt = null;
      }
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClearCacheRefresh = async () => {
    setIsRefreshing(true);
    try {
      // 1. Clear CacheStorage
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 2. Update service worker registrations
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update();
        }
      }

      // 3. Clear temporary sessionStorage
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn("Cache clear error:", e);
    }

    // 4. Cache-busting hard reload
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("reload", Date.now().toString());
      window.location.href = url.toString();
    }, 250);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("desh_user");
    setUser(null);
    setMenuOpen(false);
    setMobileMenuOpen(false);
    setShowLogoutModal(false);
    window.dispatchEvent(new Event("desh_user_updated"));
  };

  return (
    <>
      {/* ================= FULL-STRETCHED EDGE-TO-EDGE FLOATING BOX NAVBAR ================= */}
      <div className="sticky top-1 sm:top-2 z-40 w-full px-1.5 sm:px-2.5 max-w-[99.2%] 2xl:max-w-[99.5%] mx-auto transition-all duration-300">
        <header className="relative w-full bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl backdrop-saturate-150 rounded-2xl border border-white/60 dark:border-white/10 shadow-xl shadow-slate-900/[0.04] dark:shadow-black/50 px-3 sm:px-5 h-15 sm:h-17 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300">
          
          {/* Subtle top inner highlight rim */}
          <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none" />

          {/* ================= 1. LEFT: Brand & 3D Metallic Logo ================= */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0 transition-transform duration-300 hover:scale-102 cursor-pointer"
            title="DESH EduHub"
          >
            {/* 3D Metallic Emblem Icon */}
            <div className="relative shrink-0 filter drop-shadow-[0_2px_6px_rgba(15,23,42,0.18)] dark:drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/desh-eduhub-logo.png"
                alt="DESH EduHub Logo"
                width={36}
                height={36}
                className="w-7 h-7 sm:w-8.5 sm:h-8.5 object-contain rounded-xl"
                priority
              />
            </div>

            {/* Brand Text: DESH Edu on top, Hub in rounded rectangle below */}
            <DeshEduHubLogo size="sm" />
          </Link>

          {/* ================= 2. CENTER: Embedded Navbar Search Bar (Always visible on Desktop & Mobile) ================= */}
          <div className="flex-1 max-w-xl sm:max-w-2xl mx-auto px-1 sm:px-3">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600 dark:text-cyan-400">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="විෂය, නම හෝ වසර සොයන්න..."
                className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-100/70 dark:bg-slate-950/45 backdrop-blur-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200/70 dark:border-white/10 hover:border-blue-400 dark:hover:border-cyan-400/40 focus:outline-none focus:border-blue-500 focus:bg-white/90 dark:focus:bg-slate-950/80 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer text-xs"
                  title="සෙවුම ඉවත් කරන්න"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ================= 3. RIGHT (Desktop md+): PWA, ThemeToggle, Admin Lock, User Profile ================= */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* PWA Install Button */}
            {canInstallPwa && (
              <button
                type="button"
                onClick={handleInstallApp}
                className="h-8.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="Install PWA App"
              >
                <span>📲</span>
                <span className="hidden lg:inline">Install</span>
              </button>
            )}

            {/* Cache Clear & Hard Refresh Button */}
            <button
              type="button"
              onClick={handleClearCacheRefresh}
              disabled={isRefreshing}
              className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 border border-slate-200/90 dark:border-slate-800/90 transition shadow-2xs cursor-pointer ${
                isRefreshing ? "cursor-wait opacity-80" : ""
              }`}
              title="Cache Clear & Hard Refresh (කෑෂ් මකා නැවත පූරණය කරන්න)"
              aria-label="Cache Clear & Hard Refresh"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isRefreshing ? "animate-spin text-blue-600 dark:text-cyan-400" : "hover:rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />



            {/* Student Profile / Free Status Button */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-black uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="hidden sm:inline truncate max-w-[85px]">
                    {user.name.split(" ")[0]}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown (Desktop) */}
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 z-50 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 animate-fade-in">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black flex items-center justify-center text-sm shadow-xs uppercase shrink-0">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.whatsapp_number || user.whatsapp}
                        </p>
                      </div>
                    </div>

                    <div className="py-3 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>⚡ 1-Click Download සක්‍රීයයි</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1 leading-relaxed">
                        ඔබ DESH EduHub වෙත සාර්ථකව සම්බන්ධ වී ඇත. දැන් සියලුම ප්‍රශ්න පත්‍ර එක් ක්ලික් එකකින් බාගත හැක.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full mt-1 py-2 px-3 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>ගිණුමෙන් ඉවත් වන්න (Log Out)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-semibold">Free Download</span>
              </div>
            )}
          </div>

          {/* ================= 4. RIGHT (Mobile < md): 3-Lines Hamburger Button (iri 3k) ================= */}
          <div className="flex md:hidden items-center shrink-0" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 transition cursor-pointer shadow-2xs"
              aria-label="Open Navigation Menu"
              title="Menu"
            >
              {/* 3 Clean Horizontal Lines */}
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* ================= MOBILE COLLAPSED DROPDOWN CARD (Install, Dark Mode, Profile, Staff) ================= */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden mt-2 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/60 dark:border-white/10 text-slate-800 dark:text-slate-100 space-y-3.5 animate-fade-in"
          >
            {/* 1. Student Profile Section */}
            {user ? (
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black flex items-center justify-center text-xs uppercase shadow-xs">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">⚡ 1-Click Download සක්‍රීයයි</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                >
                  ඉවත් වන්න
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Access Status</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  නොමිලේ බාගත කිරීම් සක්‍රීයයි
                </span>
              </div>
            )}

            {/* 2. Dark Mode / Theme Toggle Row */}
            <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Dark Mode / Theme
              </span>
              <ThemeToggle />
            </div>

            {/* 3. Cache Clear & Hard Refresh Row */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleClearCacheRefresh();
              }}
              disabled={isRefreshing}
              className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <svg
                  className={`w-4 h-4 text-blue-600 dark:text-cyan-400 ${isRefreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Cache Clear & Hard Refresh</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                {isRefreshing ? "Refreshing..." : "Reload ⚡"}
              </span>
            </button>

            {/* 3. Install PWA App Button (when available) */}
            {canInstallPwa && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleInstallApp();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📲</span>
                <span>Install DESH EduHub App</span>
              </button>
            )}


          </div>
        )}
      </div>

      {/* Custom Logout Confirmation Popup Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center overflow-hidden transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 shadow-xs">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              ගිණුමෙන් ඉවත් වන්නද?
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              ඔබගේ සුරකින ලද නම සහ WhatsApp අංකය මෙම උපාංගයෙන් ඉවත් කෙරේ. මීළඟ බාගත කිරීමේදී නැවත තොරතුරු ඇතුළත් කිරීමට සිදුවනු ඇත.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-1/2 py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl shadow-md hover:shadow-red-500/20 transition cursor-pointer"
              >
                ඔව්, ඉවත් වන්න
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
