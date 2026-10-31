"use client";

import { useState } from "react";

export default function DownloadModal({ isOpen, onClose, onSuccess, paperTitle }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedWhatsapp = whatsapp.trim();

    if (!trimmedName) {
      setError("කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න. (Please enter your name.)");
      return;
    }

    if (!trimmedWhatsapp || trimmedWhatsapp.length < 8) {
      setError("වලංගු WhatsApp අංකයක් ඇතුළත් කරන්න. (Please enter a valid WhatsApp number.)");
      return;
    }

    setLoading(true);

    try {
      // 1. Save to Supabase via our /api/users endpoint
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          whatsapp_number: trimmedWhatsapp,
          whatsapp: trimmedWhatsapp,
        }),
      });

      const result = await response.json();

      if (!response.ok && !result.success) {
        console.warn("User save notice:", result.error);
      }

      // 2. Save details into browser localStorage
      const userData = {
        name: trimmedName,
        whatsapp_number: trimmedWhatsapp,
        whatsapp: trimmedWhatsapp,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("desh_user", JSON.stringify(userData));

      // Notify Navbar to update user display immediately
      window.dispatchEvent(new Event("desh_user_updated"));

      // 3. Trigger download & close modal
      onSuccess(userData);
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback: still save in localStorage so student gets their paper
      const userData = {
        name: trimmedName,
        whatsapp_number: trimmedWhatsapp,
        whatsapp: trimmedWhatsapp,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("desh_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("desh_user_updated"));
      onSuccess(userData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg shadow-xs">
                📥
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  නොමිලේ Download කරගන්න
                </h3>
                <p className="text-[11px] text-blue-100">Free Instant PDF Download</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-white/80 hover:text-white rounded-full p-1.5 hover:bg-white/10 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="mt-3 text-xs text-blue-100 leading-relaxed">
            ප්‍රශ්න පත්‍ර නොමිලේ බාගත කරගැනීම සඳහා ඔබගේ නම සහ WhatsApp අංකය එක් වරක් පමණක් ඇතුළත් කරන්න.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {paperTitle && (
            <div className="mb-5 p-3.5 bg-blue-50/80 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700/80 flex items-start gap-3">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5 text-lg">📄</span>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold block text-slate-900 dark:text-white">
                  තෝරාගත් ප්‍රශ්න පත්‍රය:
                </span>
                <span className="line-clamp-2 mt-0.5">{paperTitle}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="user-name"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                ඔබගේ සම්පූර්ණ නම (Your Name) <span className="text-red-500">*</span>
              </label>
              <input
                id="user-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="උදා: කසුන් පෙරේරා (e.g. Kasun Perera)"
                disabled={loading}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="user-whatsapp"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                WhatsApp අංකය (WhatsApp Number) <span className="text-red-500">*</span>
              </label>
              <input
                id="user-whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="උදා: 0771234567"
                disabled={loading}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                🔒 මෙය ඇතුළත් කළ පසු ඉදිරි සියලුම ප්‍රශ්න පත්‍ර එක් ක්ලික් එකකින් බාගත කරගත හැක.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-1/3 py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              >
                අවලංගු කරන්න
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>සකසමින්...</span>
                  </>
                ) : (
                  <>
                    <span>Download කරගන්න</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
