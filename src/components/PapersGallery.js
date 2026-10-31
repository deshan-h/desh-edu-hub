"use client";

import { useState, useEffect, useMemo } from "react";
import DownloadModal from "./DownloadModal";

const CATEGORIES = ["All", "O/L", "A/L", "Grade 5", "Provincial", "Model"];

export default function PapersGallery({ initialPapers = [] }) {
  const [papers] = useState(initialPapers);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Auth / Modal State
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPaper, setPendingPaper] = useState(null);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("desh_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
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
        paper.subject?.toLowerCase().includes(query);

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [papers, selectedCategory, selectedYear, searchQuery]);

  // Handle Download Click
  const handleDownloadClick = (paper) => {
    // 1. Check if user already exists in localStorage
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

    // 2. If user exists, download directly
    if (user && (user.whatsapp_number || user.whatsapp)) {
      triggerDownload(paper.file_url);
    } else {
      // 3. Otherwise, open soft-login modal
      setPendingPaper(paper);
      setModalOpen(true);
    }
  };

  const triggerDownload = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleModalSuccess = (savedUser) => {
    setCurrentUser(savedUser);
    setModalOpen(false);
    if (pendingPaper?.file_url) {
      triggerDownload(pendingPaper.file_url);
    }
    setPendingPaper(null);
  };

  const handleClearUser = () => {
    localStorage.removeItem("desh_user");
    setCurrentUser(null);
  };

  // Category badge colors
  const getCategoryColor = (cat) => {
    switch (cat) {
      case "A/L":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "O/L":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Grade 5":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Provincial":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <section id="papers-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject (e.g. Science, Maths) or title..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
            {/* Category Filter */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-44 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full sm:w-36 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Year: {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* User Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Showing <span className="font-semibold text-slate-800">{filteredPapers.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{papers.length}</span> available papers
          </div>

          {currentUser ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                Logged in as <strong className="font-semibold">{currentUser.name}</strong> ({currentUser.whatsapp_number || currentUser.whatsapp})
              </span>
              <button
                onClick={handleClearUser}
                className="text-emerald-700 underline hover:text-emerald-900 ml-1 text-[11px]"
                title="Log out from this device"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="text-slate-400">
              💡 First download will ask for name & WhatsApp number once.
            </div>
          )}
        </div>
      </div>

      {/* Grid of Papers */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id || paper.file_url}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${getCategoryColor(
                      paper.category
                    )}`}
                  >
                    {paper.category || "General"}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {paper.year}
                  </span>
                </div>

                {/* Subject */}
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                  {paper.subject}
                </p>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {paper.title}
                </h3>
              </div>

              {/* Card Footer / Download Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <span>PDF Document</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadClick(paper)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📂
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Past Papers Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
            We couldn&apos;t find any past papers matching your selected category, year, or search query.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedYear("All");
              setSearchQuery("");
            }}
            className="text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
          >
            Reset Filters
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
  );
}

