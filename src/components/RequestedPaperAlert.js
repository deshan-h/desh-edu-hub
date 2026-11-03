"use client";

import { useState, useEffect, useMemo } from "react";

/**
 * RequestedPaperAlert Component
 *
 * In-App Return Visit Notification Alert.
 * When a student returns to the site after requesting a paper, this component
 * detects if the requested paper is now uploaded/ready and presents a celebratory,
 * high-conversion alert banner with direct "View" and "Download" actions.
 */
export default function RequestedPaperAlert({ papers = [], onViewPaper, onDownloadPaper }) {
  const [matchedAlert, setMatchedAlert] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Give the page 1.5 seconds to settle before popping up the notification
    const timer = setTimeout(() => {
      checkAvailableRequests();
    }, 1200);

    // Listen for storage or request updates
    const handleSync = () => checkAvailableRequests();
    window.addEventListener("desh_requests_updated", handleSync);
    window.addEventListener("desh_user_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("desh_requests_updated", handleSync);
      window.removeEventListener("desh_user_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [papers]);

  const checkAvailableRequests = async () => {
    try {
      // 1. Get stored user & requested papers
      let user = null;
      try {
        const u = localStorage.getItem("desh_user");
        if (u) user = JSON.parse(u);
      } catch (e) {
        console.warn(e);
      }

      let localRequests = [];
      try {
        const r = localStorage.getItem("desh_my_requests");
        if (r) localRequests = JSON.parse(r);
      } catch (e) {
        console.warn(e);
      }

      const dismissedAlerts = JSON.parse(
        localStorage.getItem("desh_dismissed_alerts") || "[]"
      );

      // 2. Also fetch updated status from server if user has a WhatsApp number
      let serverRequests = [];
      const waNumber = user?.whatsapp_number || user?.whatsapp;
      if (waNumber && waNumber.length >= 8) {
        try {
          const res = await fetch(`/api/requests?whatsapp=${encodeURIComponent(waNumber)}`);
          const json = await res.json();
          if (json.success && json.requests) {
            serverRequests = json.requests;
          }
        } catch (fetchErr) {
          console.warn("Could not fetch remote requests:", fetchErr);
        }
      }

      // Merge local and server requests by ID
      const allRequestsMap = new Map();
      localRequests.forEach((req) => req?.id && allRequestsMap.set(req.id, req));
      serverRequests.forEach((req) => req?.id && allRequestsMap.set(req.id, req));
      const combinedRequests = Array.from(allRequestsMap.values());

      if (combinedRequests.length === 0) return;

      // 3. Find if any requested paper now exists in the system
      for (const req of combinedRequests) {
        if (!req.subject) continue;
        const alertKey = `alert_${req.id || `${req.subject}_${req.year}`}`;

        // Skip if already dismissed by user
        if (dismissedAlerts.includes(alertKey)) continue;

        const reqSub = req.subject.toLowerCase().trim();
        const reqYr = req.year ? req.year.toString().trim() : "";

        // Check if matching paper exists in current `papers` catalogue
        const foundPaper = papers.find((p) => {
          if (!p) return false;
          const pSub = (p.subject || p.title || "").toLowerCase().trim();
          const pYr = p.year ? p.year.toString().trim() : "";

          const subjectMatches =
            pSub.includes(reqSub) ||
            reqSub.includes(pSub) ||
            (p.title && p.title.toLowerCase().includes(reqSub));

          const yearMatches = !reqYr || pYr === reqYr;

          return subjectMatches && yearMatches;
        });

        // Trigger alert if paper exists or status is marked 'uploaded' / 'resolved'
        if (foundPaper || req.status === "uploaded" || req.status === "resolved") {
          setMatchedAlert({
            alertKey,
            request: req,
            paper: foundPaper,
            studentName: req.name || user?.name || "Student",
          });
          return; // Show first unread match
        }
      }
    } catch (err) {
      console.warn("Error checking requested papers status:", err);
    }
  };

  const handleDismiss = () => {
    if (!matchedAlert) return;
    try {
      const dismissed = JSON.parse(localStorage.getItem("desh_dismissed_alerts") || "[]");
      if (!dismissed.includes(matchedAlert.alertKey)) {
        dismissed.push(matchedAlert.alertKey);
        localStorage.setItem("desh_dismissed_alerts", JSON.stringify(dismissed));
      }
    } catch (e) {
      console.warn(e);
    }
    setIsDismissed(true);
  };

  const handleView = () => {
    if (matchedAlert?.paper && onViewPaper) {
      onViewPaper(matchedAlert.paper);
      handleDismiss();
    }
  };

  const handleDownload = () => {
    if (matchedAlert?.paper && onDownloadPaper) {
      onDownloadPaper(matchedAlert.paper);
      handleDismiss();
    }
  };

  if (!matchedAlert || isDismissed) {
    return null;
  }

  const { request, paper, studentName } = matchedAlert;

  return (
    <aside
      aria-label="Past Paper Request Update Notification"
      className="fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-40 max-w-[94vw] sm:max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl border-2 border-emerald-500/80 dark:border-emerald-500/70 shadow-2xl shadow-emerald-500/15 p-4 sm:p-5 ring-4 ring-emerald-500/10">
        {/* Glow Accent Top Bar */}
        <div className="absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-start justify-between gap-2.5 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* Pulsing Bell / Celebration Icon */}
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 text-base shadow-xs">
              🎉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                  සුබ ආරංචියක්! (Good News!)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block leading-tight">
                ඔබ ඉල්ලූ ප්‍රශ්න පත්‍රය දැන් සූදානම්
              </span>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notification Body */}
        <div className="space-y-2 mb-3.5">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            හෙලෝ <b className="text-slate-900 dark:text-white font-extrabold">{studentName}</b>, ඔබ මීට පෙර අපෙන් Request කළ පහත ප්‍රශ්න පත්‍රය දැන් DESH Digital Hub වෙත Upload කර ඇත:
          </p>

          {/* Paper Preview Card */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {request.category || paper?.category || "Exam"}
                </span>
                {(request.year || paper?.year) && (
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {request.year || paper?.year}
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {paper?.title || `${request.year ? `${request.year} ` : ""}${request.subject} Past Paper`}
              </h4>
            </div>

            <span className="text-xl shrink-0">📄</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {paper && onViewPaper && (
            <button
              type="button"
              onClick={handleView}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition active:scale-95 cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>බලන්න (View)</span>
            </button>
          )}

          {paper && onDownloadPaper ? (
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer shadow-md shadow-emerald-600/25"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer text-center"
            >
              හරි, ස්තූතියි! (Got it)
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

