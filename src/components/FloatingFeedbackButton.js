"use client";

export default function FloatingFeedbackButton({ onClick }) {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onClick}
        className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-[13px] shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Request a Past Paper or Send Feedback"
      >
        {/* Pulsing Attention Dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>

        {/* Icon */}
        <svg
          className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>

        {/* Label */}
        <span className="tracking-wide">
          <span className="sm:inline">Request Paper</span>
          <span className="hidden md:inline"> / Feedback</span>
        </span>

        {/* Subtle Glow Background */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-30 blur-sm -z-10 transition-opacity" />
      </button>
    </div>
  );
}

