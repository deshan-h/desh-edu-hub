"use client";

import { useState, useEffect } from "react";

export default function FloatingFeedbackButton({ onClick, onOpen }) {
  const [showBubble, setShowBubble] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Auto-trigger the support agent speech bubble shortly after system load
  useEffect(() => {
    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem("desh_feedback_bubble_dismissed");
      if (dismissed === "true") {
        return;
      }
    } catch (e) {
      console.warn(e);
    }

    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissBubble = (e) => {
    e?.stopPropagation?.();
    setShowBubble(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem("desh_feedback_bubble_dismissed", "true");
    } catch (err) {
      console.warn(err);
    }
  };

  const handleTrigger = (tab = "request") => {
    setShowBubble(false);
    if (onOpen) {
      onOpen(tab);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Support Agent Proactive Speech Bubble */}
      {showBubble && !isDismissed && (
        <div className="relative mb-3.5 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-blue-200/90 dark:border-blue-900/60 ring-1 ring-blue-500/20 animate-in fade-in slide-in-from-bottom-3 duration-300 z-50">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-blue-400/80 shrink-0 bg-white/60 dark:bg-slate-800/80 p-0.5 flex items-center justify-center">
                <img
                  src="/icon-512.png?v=5"
                  alt="Desh Hub Support"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-black text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                  <span>Desh Hub Support</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  Online • Help Desk
                </span>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={handleDismissBubble}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close notification"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message Content */}
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span>👋 ඔබට අවශ්‍ය ප්‍රශ්න පත්‍රයක් තියෙනවද?</span>
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ඔබ සොයන ප්‍රශ්න පත්‍රය <b>Request</b> කරන්න හෝ ඔබේ අදහස් <b>Feedback</b> හරහා අපට එවන්න!
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTrigger("request")}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer text-center truncate"
            >
              📄 Request Paper
            </button>
            <button
              type="button"
              onClick={() => handleTrigger("feedback")}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all active:scale-95 cursor-pointer text-center truncate border border-slate-200/80 dark:border-slate-700/80"
            >
              💬 Feedback
            </button>
          </div>

          {/* Chat Bubble Tail pointing to the round avatar */}
          <div className="absolute -bottom-1.5 right-6 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-r border-b border-blue-200/90 dark:border-blue-900/60 rotate-45 transform" />
        </div>
      )}

      {/* Floating Round Support Agent Button (රවුම) */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => handleTrigger("request")}
          className="keep-round relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-slate-900 p-1 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 border-2 border-blue-500 hover:border-indigo-500 hover:scale-108 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group-hover:ring-4 group-hover:ring-blue-500/20"
          title="Support Agent: Request Paper / Feedback"
        >
          {/* Logo inside Circle */}
          <div className="keep-round w-full h-full rounded-full overflow-hidden bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-white/10 flex items-center justify-center p-1.5 sm:p-2 shadow-inner">
            {!logoError ? (
              <img
                src="/icon-512.png?v=5"
                alt="DESH Support"
                onError={() => setLogoError(true)}
                className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-transform duration-300 group-hover:scale-110 pointer-events-none"
              />
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            )}
          </div>

          {/* Active Online Indicator Beacon */}
          <span className="keep-round absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="keep-round animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="keep-round relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" />
          </span>

          {/* Subtle Outer Glow Aura */}
          <span className="keep-round absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 opacity-20 group-hover:opacity-60 blur-md -z-10 transition-opacity" />
        </button>

        {/* Floating Tooltip Label (visible when bubble is closed) */}
        {!showBubble && (
          <div className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Request Paper / Feedback
            <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-slate-900 dark:border-l-white" />
          </div>
        )}
      </div>
    </div>
  );
}
