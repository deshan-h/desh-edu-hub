"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your admin username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Invalid login credentials.");
      }

      // Reload page so server component verifies the cookie and opens the dashboard
      window.location.reload();
    } catch (err) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-[#07090E] flex flex-col justify-between text-slate-100 selection:bg-blue-600/30">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-800 p-8 backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="relative h-16 w-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <Image
                src="/desh-eduhub-logo.png"
                alt="DESH EduHub Emblem"
                width={64}
                height={64}
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 text-xs font-bold mb-2">
              <span>🔒</span>
              <span>Staff Only</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              DESH EduHub Admin
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Enter your administrative credentials to manage past papers.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-400 font-semibold">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-3 px-5 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white"
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
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In as Admin</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer info */}
      <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        DESH EduHub • Administrative Control Center
      </div>
    </div>
  );
}

