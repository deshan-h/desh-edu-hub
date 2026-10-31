"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import DeshEduHubLogo from "./DeshEduHubLogo";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const userMenuRef = useRef(null);

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

  // Close profile dropdown when clicking anywhere outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

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
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl backdrop-saturate-150 border-b border-slate-200/50 dark:border-slate-800/60 shadow-xs shadow-slate-900/[0.03] dark:shadow-black/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between relative">
          
          {/* ================= 1. LEFT: User Profile / Free Status (z-30 shrink-0) ================= */}
          <div className="flex items-center gap-2 shrink-0 z-30">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="h-9 sm:h-10 flex items-center gap-2 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-50/90 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-emerald-200/80 dark:border-emerald-800/40 text-xs shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition cursor-pointer shrink-0"
                  title="පරිශීලක තොරතුරු බලන්න"
                >
                  <div className="relative shrink-0">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black flex items-center justify-center text-[11px] sm:text-xs shadow-xs uppercase">
                      {user.name ? user.name.charAt(0) : "U"}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse" />
                  </div>

                  {/* Desktop View */}
                  <div className="hidden lg:block text-left">
                    <p className="font-bold text-slate-900 dark:text-slate-100 leading-tight text-xs flex items-center gap-1.5">
                      <span>{user.name}</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight flex items-center gap-1 mt-0.5">
                      <span>⚡ 1-Click Download</span>
                    </p>
                  </div>

                  {/* Tablet/Mobile View (Compact name) */}
                  <div className="lg:hidden hidden sm:flex items-center gap-1 text-left">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs max-w-[70px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </div>

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
                </button>

                {/* Profile Dropdown Menu Card */}
                {menuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 z-50 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 animate-fade-in">
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
                      className="w-full mt-1 py-2.5 px-3 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
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
              <div className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="hidden sm:inline">නොමිලේ Download සක්‍රීයයි</span>
                <span className="sm:hidden font-bold text-emerald-600 dark:text-emerald-400">Free</span>
              </div>
            )}
          </div>

          {/* ================= 2. CENTER: Logo & DESH EduHub Brand (pointer-events-none wrapper, z-20) ================= */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Link
              href="/"
              className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 group shrink-0 transition-transform duration-300 hover:scale-102 cursor-pointer"
              title="DESH EduHub"
            >
              {/* 3D Metallic Emblem Icon */}
              <div className="relative shrink-0 filter drop-shadow-[0_3px_6px_rgba(15,23,42,0.18)] dark:drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/desh-eduhub-logo.png"
                  alt="DESH EduHub Logo"
                  width={44}
                  height={44}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain rounded-xl"
                  priority
                />
              </div>

              {/* Reusable DESH EduHub 3D Metallic Text Component */}
              <DeshEduHubLogo size="md" />
            </Link>
          </div>

          {/* ================= 3. RIGHT: Actions (z-30 shrink-0) ================= */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 z-30">
            {/* PWA Install App Button */}
            {canInstallPwa && (
              <button
                type="button"
                onClick={handleInstallApp}
                className="h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 animate-fade-in"
                title="DESH EduHub App එක Install කරගන්න"
              >
                <span>📲</span>
                <span className="hidden md:inline">Install App</span>
              </button>
            )}

            {/* Theme Toggle (Dark/Light Switch) */}
            <ThemeToggle />

            {/* Discreet Staff / Admin Access Button */}
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
