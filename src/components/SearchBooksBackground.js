"use client";

export default function SearchBooksBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[18rem] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 blur-3xl rounded-full" />

      {/* 2. Left Background: Compact Floating Open Book Illustration (No clipping) */}
      <div className="hidden sm:block absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 w-28 sm:w-32 md:w-36 lg:w-44 opacity-25 dark:opacity-30 transition-all duration-300">
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-md"
        >
          <defs>
            <linearGradient id="bookCoverLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="bookPagesLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Book Shadow */}
          <ellipse cx="100" cy="148" rx="85" ry="10" fill="#0f172a" opacity="0.15" />

          {/* Book Base Cover */}
          <path
            d="M 12 118 Q 100 135 188 118 L 192 126 Q 100 144 8 126 Z"
            fill="#1e3a8a"
          />

          {/* Left Page Stack */}
          <path
            d="M 15 116 Q 98 132 100 130 L 100 45 Q 98 47 15 31 Z"
            fill="url(#bookPagesLeft)"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />

          {/* Right Page Stack */}
          <path
            d="M 185 116 Q 102 132 100 130 L 100 45 Q 102 47 185 31 Z"
            fill="url(#bookPagesLeft)"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />

          {/* Top Fanned Left Page */}
          <path
            d="M 18 112 C 45 116 75 125 100 128 L 100 42 C 75 39 45 30 18 26 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />

          {/* Top Fanned Right Page */}
          <path
            d="M 182 112 C 155 116 125 125 100 128 L 100 42 C 125 39 155 30 182 26 Z"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />

          {/* Book Spine Center Glow */}
          <line x1="100" y1="42" x2="100" y2="128" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />

          {/* Decorative Text Lines on Left Page */}
          <line x1="32" y1="44" x2="85" y2="52" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
          <line x1="32" y1="56" x2="82" y2="64" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          <line x1="32" y1="68" x2="84" y2="76" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          <line x1="32" y1="80" x2="75" y2="88" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />

          {/* Decorative Text Lines on Right Page */}
          <line x1="115" y1="52" x2="168" y2="44" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
          <line x1="118" y1="64" x2="168" y2="56" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          <line x1="116" y1="76" x2="168" y2="68" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          <line x1="125" y1="88" x2="168" y2="80" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />

          {/* Ribbon Bookmark */}
          <path
            d="M 100 42 Q 103 80 115 125 L 110 135 L 105 125 Z"
            fill="#ef4444"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* 3. Right Background: Compact Stack of Books & Graduation Cap (No clipping) */}
      <div className="hidden sm:block absolute right-4 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 w-28 sm:w-32 md:w-36 lg:w-44 opacity-25 dark:opacity-30 transition-all duration-300">
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-md"
        >
          {/* Shadow */}
          <ellipse cx="105" cy="148" rx="80" ry="9" fill="#0f172a" opacity="0.15" />

          {/* Bottom Book (Indigo) */}
          <path
            d="M 28 132 L 155 132 L 175 122 L 48 122 Z"
            fill="#4338ca"
          />
          <path
            d="M 28 132 L 48 122 L 48 138 L 28 148 Z"
            fill="#312e81"
          />
          <path
            d="M 28 148 L 155 148 L 175 138 L 175 122 L 155 132 L 28 132 Z"
            fill="#6366f1"
          />
          <rect x="52" y="125" width="120" height="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />

          {/* Middle Book (Cyan/Blue) */}
          <path
            d="M 38 112 L 160 112 L 178 103 L 56 103 Z"
            fill="#0284c7"
          />
          <path
            d="M 38 112 L 56 103 L 56 119 L 38 128 Z"
            fill="#0369a1"
          />
          <path
            d="M 38 128 L 160 128 L 178 119 L 178 103 L 160 112 L 38 112 Z"
            fill="#0ea5e9"
          />
          <rect x="60" y="106" width="115" height="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />

          {/* Top Book (Blue-600) */}
          <path
            d="M 45 92 L 158 92 L 174 84 L 61 84 Z"
            fill="#1d4ed8"
          />
          <path
            d="M 45 92 L 61 84 L 61 99 L 45 107 Z"
            fill="#1e40af"
          />
          <path
            d="M 45 107 L 158 107 L 174 99 L 174 84 L 158 92 L 45 92 Z"
            fill="#2563eb"
          />
          <rect x="64" y="87" width="107" height="11" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />

          {/* Graduation Cap on top of books */}
          <polygon
            points="105,32 165,52 105,72 45,52"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <polygon
            points="105,35 160,52 105,68 50,52"
            fill="#0f172a"
          />

          {/* Cap Skullcap */}
          <path
            d="M 72 61 L 72 75 C 72 88 138 88 138 75 L 138 61 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Cap Tassel */}
          <circle cx="105" cy="52" r="3.5" fill="#f59e0b" />
          <path
            d="M 105 52 Q 135 56 142 80"
            stroke="#f59e0b"
            strokeWidth="2.2"
            fill="none"
          />
          <rect x="139" y="80" width="6" height="12" rx="1.5" fill="#d97706" />
        </svg>
      </div>

      {/* 4. Subtle Floating Academic Particle Icons */}
      <div className="hidden md:flex absolute inset-0 items-center justify-around opacity-15 dark:opacity-20 text-xs sm:text-sm text-slate-400 select-none">
        <span className="transform -translate-y-8 translate-x-12 text-blue-500 font-bold">A/L</span>
        <span className="transform translate-y-6 -translate-x-16 text-cyan-500 font-bold">O/L</span>
        <span className="transform -translate-y-8 -translate-x-12 text-emerald-500 font-bold">Grade 5</span>
      </div>
    </div>
  );
}
