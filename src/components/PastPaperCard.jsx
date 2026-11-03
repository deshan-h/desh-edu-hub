import React from "react";

/**
 * PastPaperCard Component
 *
 * A reusable, premium dark-themed card for past paper downloads.
 *
 * @param {Object} props
 * @param {string} [props.grade="O/L"] - Exam grade level (e.g., "O/L", "A/L", "Grade 5")
 * @param {string|number} [props.year="2025"] - Examination year (e.g., "2025")
 * @param {string} [props.subject="ACCOUNTING"] - Subject name (e.g., "ACCOUNTING", "PHYSICS")
 * @param {string} [props.title="2025 G.C.E. O/L Accounting Past Paper"] - Full paper title
 * @param {string} [props.viewLink="#"] - URL or target for PDF viewing
 * @param {string} [props.downloadLink="#"] - Direct download URL for the PDF
 * @param {Function} [props.onView] - Optional click handler for View action
 * @param {Function} [props.onDownload] - Optional click handler for Download action
 */
export default function PastPaperCard({
  grade = "O/L",
  year = "2025",
  subject = "ACCOUNTING",
  title = "2025 G.C.E. O/L Accounting Past Paper",
  viewLink = "#",
  downloadLink = "#",
  onView,
  onDownload,
}) {
  return (
    <div className="w-full max-w-sm bg-[#0B1120] border border-gray-800 rounded-2xl p-5 shadow-xl hover:border-gray-700/80 hover:shadow-2xl hover:shadow-indigo-950/20 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          {/* Grade Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide bg-blue-950/50 border border-blue-800/60 text-blue-400">
            {grade}
          </span>

          {/* Year Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-slate-800/80 border border-slate-700/80 text-slate-300">
            {year}
          </span>
        </div>

        {/* Full-width Subject Badge */}
        <div className="w-full text-center py-2 px-3 mb-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-400 font-extrabold text-xs tracking-widest uppercase shadow-inner group-hover:border-blue-700/60 transition-colors">
          {subject}
        </div>

        {/* Main Title */}
        <h3
          className="text-slate-100 font-bold text-sm sm:text-base leading-relaxed line-clamp-2 mb-4 group-hover:text-blue-400 transition-colors"
          title={title}
        >
          {title}
        </h3>
      </div>

      {/* Footer / Action Bar */}
      <div className="pt-3.5 border-t border-gray-800 flex items-center justify-between gap-3 mt-auto">
        {/* Left Side: PDF Format Indicator */}
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold select-none">
          {/* Red PDF Icon */}
          <svg
            className="w-4 h-4 text-rose-500 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
          <span className="tracking-wide">PDF</span>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* View Button (Glassmorphism / Dark Gray) */}
          <a
            href={viewLink}
            onClick={onView}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 backdrop-blur-sm transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            <span>View</span>
          </a>

          {/* Download Button (Bright Indigo with Subtle Glow) */}
          <a
            href={downloadLink}
            onClick={onDownload}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
}

