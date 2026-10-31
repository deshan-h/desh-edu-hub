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
      setError("Please enter your name.");
      return;
    }

    if (!trimmedWhatsapp || trimmedWhatsapp.length < 8) {
      setError("Please enter a valid WhatsApp number.");
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
      onSuccess(userData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white font-bold">
                📥
              </span>
              <h3 className="text-lg font-bold">Free Instant Download</h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-white/80 hover:text-white rounded-full p-1 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-xs text-blue-100">
            Please enter your name & WhatsApp number once to download past papers and study materials.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {paperTitle && (
            <div className="mb-4 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start gap-2.5">
              <span className="text-blue-600 mt-0.5 text-base">📄</span>
              <div className="text-xs text-slate-700">
                <span className="font-semibold block text-slate-900">Downloading:</span>
                <span className="line-clamp-2">{paperTitle}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="user-name"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="user-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kasun Perera"
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="user-whatsapp"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                id="user-whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 0771234567"
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                🔒 You will only be asked this once. Future downloads will be 1-click instant!
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-1/3 py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg shadow-sm transition inline-flex items-center justify-center gap-2"
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
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Unlock & Download</span>
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

