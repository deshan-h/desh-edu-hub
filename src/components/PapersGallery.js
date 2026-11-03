"use client";

import { useState, useEffect, useMemo } from "react";
import DownloadModal from "./DownloadModal";
import PdfViewerModal from "./PdfViewerModal";
import FeedbackRequestModal from "./FeedbackRequestModal";
import FloatingFeedbackButton from "./FloatingFeedbackButton";
import SearchBooksBackground from "./SearchBooksBackground";
import PremiumSelect from "@/components/ui/PremiumSelect";

const CATEGORIES = [
  {
    id: "All",
    label: "සියල්ල (All)",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: "O/L",
    label: "සාමාන්‍ය පෙළ (O/L)",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    id: "A/L",
    label: "උසස් පෙළ (A/L)",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
      </svg>
    ),
  },
  {
    id: "Grade 5",
    label: "5 ශ්‍රේණිය (Grade 5)",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: "Provincial",
    label: "පළාත් (Provincial)",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "Model",
    label: "ආදර්ශ (Model)",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <circle cx="12" cy="12" r="5" strokeWidth={2} />
        <circle cx="12" cy="12" r="1.5" strokeWidth={2} fill="currentColor" />
      </svg>
    ),
  },
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
  const [viewingPaper, setViewingPaper] = useState(null);

  // Paper Request & Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackInitialTab, setFeedbackInitialTab] = useState("request");
  const [feedbackInitialSubject, setFeedbackInitialSubject] = useState("");

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

    // Sync search query with Navbar search bar
    const handleNavbarSearch = (e) => {
      setSearchQuery(e.detail || "");
    };
    window.addEventListener("desh_search_query", handleNavbarSearch);

    return () => {
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("desh_user_updated", handleUserUpdate);
      window.removeEventListener("desh_search_query", handleNavbarSearch);
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
    ).sort((a, b) => Number(b) - Number(a));
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

  // Group filtered papers into a Year-by-Year Timeline in descending order (2026, 2025, 2024...)
  const timelineGroups = useMemo(() => {
    const grouped = {};

    // Sort papers descending by year, then by newest created
    const sorted = [...filteredPapers].sort((a, b) => {
      const yA = Number(a.year) || 0;
      const yB = Number(b.year) || 0;
      if (yB !== yA) return yB - yA;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    sorted.forEach((paper) => {
      const yr = paper.year ? paper.year.toString() : "Other";
      if (!grouped[yr]) {
        grouped[yr] = [];
      }
      grouped[yr].push(paper);
    });

    // Ensure strictly descending order
    const sortedYearKeys = Object.keys(grouped).sort((a, b) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return Number(b) - Number(a);
    });

    return sortedYearKeys.map((year) => ({
      year,
      papers: grouped[year],
    }));
  }, [filteredPapers]);

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
      {/* 1. TOP HERO WITH BOOKS BACKGROUND DESIGN (Seamless & Fixed) */}
      <div className="relative overflow-visible z-20 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:from-transparent dark:via-blue-950/20 dark:to-transparent pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Books & Library Background Art */}
        <SearchBooksBackground />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          {/* Individual Category & Year Filter Chips (Pushed down comfortably) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto px-2 pt-3 sm:pt-5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500 scale-102"
                      : "bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
                  }`}
                >
                  <span className={`shrink-0 transition-colors ${isActive ? "text-white" : ""}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* Modern Calendar Year Selector Dropdown Chip */}
            <PremiumSelect
              value={selectedYear}
              onChange={setSelectedYear}
              options={availableYears.map((yr) => ({
                value: yr,
                label: yr === "All" ? "සියලුම වසර (All Years)" : `${yr} විභාග`,
                badge: yr === "2026" ? "New" : undefined,
              }))}
              size="pill"
              align="right"
              className="shrink-0"
              triggerClassName={
                selectedYear !== "All"
                  ? "!bg-blue-600 !text-white !border-blue-500 shadow-md shadow-blue-500/25"
                  : ""
              }
              icon={
                <svg className={`w-3.5 h-3.5 ${selectedYear !== "All" ? "text-white" : "text-cyan-600 dark:text-cyan-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* 2. PAPERS SECTION: ATTRACTIVE YEAR-BY-YEAR TIMELINE */}
      <section id="papers-section" className="pt-3 sm:pt-4 pb-12 max-w-[99.2%] 2xl:max-w-[99.5%] mx-auto px-3 sm:px-6 relative">
        {/* Timeline Content */}
        {timelineGroups.length > 0 ? (
          <div className="relative space-y-10 sm:space-y-12">
            {/* Glowing Vertical Timeline Spine (Desktop / Tablet) */}
            <div className="hidden sm:block absolute left-5 lg:left-6 top-6 bottom-10 w-1 bg-gradient-to-b from-cyan-500 via-blue-600 to-indigo-600 rounded-full opacity-40 dark:opacity-30 pointer-events-none" />

            {/* Year Groups Loop */}
            {timelineGroups.map((group) => {
              const is2026 = group.year === "2026";

              return (
                <div
                  key={group.year}
                  id={`timeline-year-${group.year}`}
                  className="relative sm:pl-16 lg:pl-20 scroll-mt-32 transition-all duration-300"
                >
                  {/* Timeline Milestone Node (Anchored to vertical line - No Blinking) */}
                  <div className="sm:absolute sm:left-0 sm:top-0 mb-3 sm:mb-0 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center font-black text-xs lg:text-sm shadow-md transition-all shrink-0 ${
                        is2026
                          ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 ring-4 ring-white dark:ring-slate-950"
                          : "bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-blue-500/20 ring-4 ring-white dark:ring-slate-950"
                      }`}
                    >
                      {is2026 ? "✨" : group.year.length === 4 ? group.year.slice(2) : "📅"}
                    </div>

                    {/* Mobile-only Year Title (next to milestone) */}
                    <div className="sm:hidden flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {group.year} විභාග ප්‍රශ්න පත්‍ර
                      </h3>
                      {is2026 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Year Header Bar */}
                  <div className="hidden sm:flex items-center justify-between gap-4 pb-2.5 mb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>{group.year} විභාග ප්‍රශ්න පත්‍ර</span>
                      </h3>

                      {is2026 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">
                          ✨ Latest • අලුත්ම එකතුව
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                        {group.papers.length} {group.papers.length === 1 ? "Paper" : "Papers"}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Year Milestone #{group.year}
                    </span>
                  </div>

                  {/* Cards Grid for this Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-4">
                    {group.papers.map((paper) => (
                      <div
                        key={paper.id || paper.file_url}
                        className="group relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all duration-200 p-3 sm:p-3.5 flex flex-col justify-between"
                      >
                        <div>
                          {/* Top Bar: Category on Left, Year on Right */}
                          <div className="flex items-center justify-between gap-1.5 mb-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getCategoryBadge(
                                paper.category
                              )}`}
                            >
                              {paper.category || "General"}
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                              {paper.year}
                            </span>
                          </div>

                          {/* Highlighted & Centered Subject Name */}
                          {paper.subject && (
                            <div className="my-2.5 flex items-center justify-center">
                              <div className="w-full text-center py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-blue-50/90 dark:from-blue-950/60 dark:via-indigo-950/60 dark:to-blue-950/60 border border-blue-200/90 dark:border-blue-800/70 shadow-2xs group-hover:border-blue-400 dark:group-hover:border-blue-500 group-hover:shadow-xs transition-all">
                                <span className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 drop-shadow-xs truncate block">
                                  {paper.subject}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Title */}
                          <h4 className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                            {paper.title}
                          </h4>

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

                        {/* Card Footer / View & Download Actions */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                              </svg>
                              <span className="hidden sm:inline">PDF</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* View / Preview Button */}
                            <button
                              type="button"
                              onClick={() => setViewingPaper(paper)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 text-[11px] font-bold rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all cursor-pointer"
                              title="View Paper in Modal"
                            >
                              <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View</span>
                            </button>

                            {/* Download Button */}
                            <button
                              type="button"
                              onClick={() => handleDownloadClick(paper)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-[11px] font-bold rounded-lg shadow-2xs hover:shadow-blue-500/20 transition-all cursor-pointer"
                              title="Download PDF"
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
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedYear("All");
                  setSearchQuery("");
                }}
                className="text-xs font-bold px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                සියලුම ප්‍රශ්න පත්‍ර පෙන්වන්න (Reset Filters)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedbackInitialTab("request");
                  setFeedbackInitialSubject(searchQuery);
                  setFeedbackModalOpen(true);
                }}
                className="text-xs font-bold px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📄 සොයන ප්‍රශ්න පත්‍රය Request කරන්න</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Feedback & Paper Request Action Button */}
        <FloatingFeedbackButton
          onClick={() => {
            setFeedbackInitialTab("request");
            setFeedbackInitialSubject("");
            setFeedbackModalOpen(true);
          }}
        />

        {/* Paper Request & Feedback Modal */}
        <FeedbackRequestModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          initialTab={feedbackInitialTab}
          initialSubject={feedbackInitialSubject}
        />

        {/* Interactive PDF Viewer Modal */}
        <PdfViewerModal
          isOpen={Boolean(viewingPaper)}
          onClose={() => setViewingPaper(null)}
          paper={viewingPaper}
          onDownload={(paperToDownload) => {
            setViewingPaper(null);
            handleDownloadClick(paperToDownload);
          }}
        />

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
