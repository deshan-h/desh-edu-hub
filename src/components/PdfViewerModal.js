"use client";

import { useState, useEffect } from "react";
import { getPaperStream, getStreamBadgeConfig } from "./PapersGallery";

export default function PdfViewerModal({ isOpen, onClose, paper, onDownload }) {
  const [loading, setLoading] = useState(true);

  // Reset loading state whenever a new paper is selected
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, paper?.file_url]);

  // Lock scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !paper) return null;

  const pdfUrl = paper.file_url ? `${paper.file_url}#toolbar=1&navpanes=0` : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2.5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1700px] h-[calc(100dvh-0.5rem)] sm:h-[calc(100dvh-1.25rem)] bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {paper.category || "General"}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {paper.year}
                </span>
                {(() => {
                  const isAL =
                    (paper.category || "").toLowerCase().includes("a/l") ||
                    (paper.title || "").toLowerCase().includes("a/l") ||
                    Boolean(paper.stream);
                  const stream = isAL ? getPaperStream(paper) : null;
                  const streamBadge = stream ? getStreamBadgeConfig(stream) : null;
                  if (!streamBadge) return null;
                  return (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border shadow-2xs ${streamBadge.className}`}
                      title={`විෂය ධාරාව: ${streamBadge.label} (${streamBadge.sinhala})`}
                    >
                      <span className="text-[10.5px] leading-none">{streamBadge.icon}</span>
                      <span>{streamBadge.label}</span>
                    </span>
                  );
                })()}
                {paper.subject && (
                  <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                    {paper.subject}
                  </span>
                )}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate" title={paper.title}>
                {paper.title}
              </h3>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Open in New Tab */}
            <a
              href={paper.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition shadow-2xs"
              title="Open PDF in new tab"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Full Tab</span>
            </a>

            {/* Download Button */}
            <button
              type="button"
              onClick={() => onDownload && onDownload(paper)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs font-bold shadow-2xs hover:shadow-blue-500/20 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer shadow-2xs"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Frame */}
        <div className="relative flex-1 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xs gap-3">
              <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ප්‍රශ්න පත්‍රය සූදානම් වෙමින් පවතී...
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Loading PDF Document...
                </p>
              </div>
            </div>
          )}

          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={paper.title || "Past Paper Preview"}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                PDF ගොනුව සොයා ගැනීමට නොහැකි විය.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The file URL is missing or unavailable.
              </p>
            </div>
          )}
        </div>

        {/* Mobile / Fallback Footer */}
        <div className="px-3 sm:px-4 py-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Interactive PDF Preview</span>
          </div>
          <a
            href={paper.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            ගැටළුවක් නම් New Tab එකෙන් විවෘත කරන්න ↗
          </a>
        </div>
      </div>
    </div>
  );
}

