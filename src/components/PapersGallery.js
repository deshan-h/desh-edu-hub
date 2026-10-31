"use client";

import { useState, useEffect, useMemo } from "react";
import DownloadModal from "./DownloadModal";

const CATEGORIES = [
  { id: "All", label: "සියල්ල (All)" },
  { id: "O/L", label: "සාමාන්‍ය පෙළ (O/L)" },
  { id: "A/L", label: "උසස් පෙළ (A/L)" },
  { id: "Grade 5", label: "5 ශ්‍රේණිය (Grade 5)" },
  { id: "Provincial", label: "පළාත් (Provincial)" },
  { id: "Model", label: "ආදර්ශ (Model)" },
];

// Helper function to check if paper includes answers
const checkHasAnswers = (paper) => {
  if (paper.has_answers === true || paper.has_answers === "true") return true;
  if (!paper.title) return false;
  const t = paper.title.toLowerCase();
  return (
    t.includes("with answers") ||
    t.includes("answers") ||
    t.includes("marking scheme") ||
    t.includes("පිළිතුරු")
  );
};

export default function PapersGallery({ initialPapers = [] }) {
  const [papers, setPapers] = useState(initialPapers);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Auth / Modal State
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPaper, setPendingPaper] = useState(null);

  // Sync user with localStorage
  const loadUser = () => {
    try {
      const stored = localStorage.getItem("desh_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
  };

  useEffect(() => {
    loadUser();

    const handleUserUpdate = () => loadUser();
    window.addEventListener("storage", handleUserUpdate);
    window.addEventListener("desh_user_updated", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("desh_user_updated", handleUserUpdate);
    };
  }, []);

  // Compute unique years from papers
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        papers
          .map((p) => p.year)
          .filter(Boolean)
      )
    ).sort((a, b) => b - a);
    return ["All", ...years];
  }, [papers]);

  // Filtered papers
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesCategory =
        selectedCategory === "All" ||
        paper.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesYear =
        selectedYear === "All" ||
        paper.year?.toString() === selectedYear.toString();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        paper.title?.toLowerCase().includes(query) ||
        paper.subject?.toLowerCase().includes(query) ||
        paper.year?.toString().includes(query);

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [papers, selectedCategory, selectedYear, searchQuery]);

  // Handle Download Click
  const handleDownloadClick = (paper) => {
    let user = currentUser;
    if (!user) {
      try {
        const stored = localStorage.getItem("desh_user");
        if (stored) {
          user = JSON.parse(stored);
          setCurrentUser(user);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    if (user && (user.whatsapp_number || user.whatsapp)) {
      triggerDownload(paper);
    } else {
      setPendingPaper(paper);
      setModalOpen(true);
    }
  };

  const triggerDownload = (paper) => {
    if (!paper?.file_url) return;
    window.open(paper.file_url, "_blank");

    // Increment count optimistically in UI
    if (paper.id) {
      setPapers((prev) =>
        prev.map((p) =>
          p.id === paper.id
            ? { ...p, download_count: (p.download_count || 0) + 1 }
            : p
        )
      );

      // Increment in database in background
      fetch("/api/papers/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id }),
      }).catch((e) => console.warn("Failed to record download count:", e));
    }
  };

  const handleModalSuccess = (savedUser) => {
    setCurrentUser(savedUser);
    setModalOpen(false);
    if (pendingPaper) {
      triggerDownload(pendingPaper);
    }
    setPendingPaper(null);
  };

  // Category badge styling
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "A/L":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/40";
      case "O/L":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/40";
      case "Grade 5":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/40";
      case "Provincial":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/40";
      case "Model":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/40";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60";
    }
  };

  return (
    <div className="w-full">
      {/* 1. TOP OF THE PAGE SEARCH BAR (Page eke udatama) */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 pt-3 sm:pt-4 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight mb-3">
            ඔබට අවශ්‍ය ප්‍රශ්න පත්‍රය මෙතනින් සොයන්න
          </h2>

          {/* Prominent Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-3.5">
            <span className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="විෂය (Subject), ප්‍රශ්න පත්‍රයේ නම හෝ වසර මෙතැන Type කරන්න..."
              className="w-full pl-12 sm:pl-14 pr-12 py-3.5 sm:py-4 text-sm sm:text-base bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl shadow-lg shadow-blue-500/5 dark:shadow-none border-2 border-blue-100 dark:border-slate-800 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="සොයන පදය ඉවත් කරන්න"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills & Year Selector */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 max-w-6xl mx-auto overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap shrink-0 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer ${isActive
                      ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md scale-102"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="whitespace-nowrap shrink-0 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === "All" ? "සියලුම වසර (Years)" : yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. PAPERS GRID & RESULTS SECTION */}
      <section id="papers-section" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Results summary bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6 gap-2">
          <div>
            ප්‍රශ්න පත්‍ර <span className="font-bold text-slate-800 dark:text-slate-200">{filteredPapers.length}</span> ක් හමුවිය (සම්පූර්ණ එකතුව: {papers.length})
          </div>
        </div>

        {/* Grid of Papers (Compact, Low-Height Cards) */}
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id || paper.file_url}
                className="group relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200 p-3 sm:p-3.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Category, Subject & Year in one sleek line */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getCategoryBadge(
                          paper.category
                        )}`}
                      >
                        {paper.category || "General"}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
                        {paper.subject}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                      {paper.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {paper.title}
                  </h3>

                  {/* With Answers Badge */}
                  {checkHasAnswers(paper) && (
                    <div className="mt-1.5 flex items-center">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-800/80 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>With Answers (පිළිතුරු සහිතයි)</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer / Download Action (Slimmer spacing) */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <span>PDF</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400" title="මුළු බාගත කිරීම් ගණන">
                      <svg className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="font-bold">{paper.download_count ?? 0}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadClick(paper)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-2xs hover:shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              📂
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              ප්‍රශ්න පත්‍ර කිසිවක් හමු නොවීය
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              ඔබ සෙවූ නිර්ණායක වලට අදාළ ප්‍රශ්න පත්‍ර තවම ඇතුළත් කර නොමැත. වෙනත් විෂයක් හෝ වසරක් තෝරා බලන්න.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedYear("All");
                setSearchQuery("");
              }}
              className="text-xs font-bold px-5 py-2.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              සියලුම ප්‍රශ්න පත්‍ර පෙන්වන්න (Reset Filters)
            </button>
          </div>
        )}

        {/* Soft Login Download Modal */}
        <DownloadModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setPendingPaper(null);
          }}
          onSuccess={handleModalSuccess}
          paperTitle={pendingPaper?.title}
        />
      </section>
    </div>
  );
}
