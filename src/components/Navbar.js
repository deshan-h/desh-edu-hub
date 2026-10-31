"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

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

    return () => {
      window.removeEventListener("pwa_ready_to_install", handlePwaReady);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("desh_user_updated", handleStorageChange);
    };
  }, []);

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

  const handleConfirmLogout = () => {
    localStorage.removeItem("desh_user");
    setUser(null);
    setMenuOpen(false);
    setShowLogoutModal(false);
    window.dispatchEvent(new Event("desh_user_updated"));
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/65 dark:bg-slate-950/65 backdrop-blur-xl backdrop-saturate-150 border-b border-slate-200/50 dark:border-slate-800/60 shadow-xs shadow-slate-900/[0.03] dark:shadow-black/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand & Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-xl sm:rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
            </div>

            {/* Stylish Brand Layout: DESH Papers on top, HUB in rounded rectangle below */}
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  DESH
                </span>
                <span className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Papers
                </span>
              </div>
              <div className="mt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-0.5 rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black text-[11px] sm:text-xs tracking-widest uppercase shadow-xs">
                  HUB
                </span>
              </div>
            </div>
          </Link>

          {/* Right: User Display + Theme Toggle + Admin Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* User Display Pill */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="h-9 sm:h-10 flex items-center gap-2 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-50/90 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-emerald-200/80 dark:border-emerald-800/40 text-xs shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition cursor-pointer shrink-0"
                  title="පරිශීලක තොරතුරු බලන්න"
                >
                  <div className="relative shrink-0">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black flex items-center justify-center text-[11px] sm:text-xs shadow-xs uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                  </div>

                  {/* Desktop View (md and up) */}
                  <div className="hidden md:block text-left">
                    <p className="font-bold text-slate-900 dark:text-slate-100 leading-tight text-xs flex items-center gap-1.5">
                      <span>{user.name} ලෙස සම්බන්ධ වී ඇත</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight flex items-center gap-1 mt-0.5">
                      <span>⚡ 1-Click Download සක්‍රීයයි</span>
                      <span className="hidden lg:inline text-slate-400 dark:text-slate-500">
                        • {user.whatsapp_number || user.whatsapp}
                      </span>
                    </p>
                  </div>

                  {/* Mobile View (Compact name + chevron) */}
                  <div className="md:hidden flex items-center gap-1 text-left">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs max-w-[65px] xs:max-w-[85px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Desktop Direct Logout Button */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLogoutModal(true);
                    }}
                    className="hidden md:inline-block text-[11px] text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition ml-1 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                    title="ගිණුම ඉවත් කරන්න"
                  >
                    ඉවත් වන්න
                  </span>
                </button>

                {/* Mobile Profile Dropdown Card */}
                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
                      onClick={() => setMenuOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 z-50 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
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
                          ඔබ DESH Papers Hub වෙත සාර්ථකව සම්බන්ධ වී ඇත. දැන් සියලුම ප්‍රශ්න පත්‍ර එක් ක්ලික් එකකින් බාගත හැක.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full mt-1 py-2.5 px-3 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>ගිණුමෙන් ඉවත් වන්න (Log Out)</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>නොමිලේ Download සක්‍රීයයි</span>
              </div>
            )}

            {/* PWA Install App Button (when available) */}
            {canInstallPwa && (
              <button
                type="button"
                onClick={handleInstallApp}
                className="h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 animate-fade-in"
                title="DESH Papers App එක Install කරගන්න"
              >
                <span>📲</span>
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Theme Toggle (Dark/Light Switch) */}
            <ThemeToggle />

            {/* Discreet Staff / Admin Access Button (Matching Exact Dimensions) */}
            <Link
              href="/admin"
              className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
              title="Staff Access"
              aria-label="Staff Portal"
            >
              <svg
                className="w-5 h-5 transition-transform duration-300 hover:scale-105"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

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
