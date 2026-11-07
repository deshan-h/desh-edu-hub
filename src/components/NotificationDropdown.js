"use client";

import { useState, useEffect, useRef, useMemo } from "react";

/**
 * Format relative time in friendly Sinhala / English
 */
function formatTimeAgo(dateStr) {
  if (!dateStr) return "මෑතකදී";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);
    if (diffSec < 60) return "මීට සුළු මොහොතකට පෙර";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `මීට මිනිත්තු ${diffMin}කට පෙර`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `මීට පැය ${diffHrs}කට පෙර`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "ඊයේ";
    if (diffDays < 7) return `මීට දින ${diffDays}කට පෙර`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    return "මෑතකදී";
  }
}

export default function NotificationDropdown({ papers = [], isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "requests" | "new"
  const [myFulfilledRequests, setMyFulfilledRequests] = useState([]);
  const [lastReadTime, setLastReadTime] = useState(null);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState([]);
  const dropdownRef = useRef(null);

  // Load last read timestamp & dismissed notifications from localStorage
  const loadReadState = () => {
    try {
      const storedTime = localStorage.getItem("desh_notifications_last_read");
      if (storedTime) setLastReadTime(storedTime);
      const dismissed = JSON.parse(localStorage.getItem("desh_dismissed_notifs") || "[]");
      setDismissedNotificationIds(dismissed);
    } catch (e) {
      console.warn("Could not load notification state:", e);
    }
  };

  // Check personal paper requests belonging to THIS user only
  const checkMyRequests = async () => {
    try {
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

      // Also check server if user has WhatsApp number
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

      // Merge by ID
      const allRequestsMap = new Map();
      localRequests.forEach((req) => req?.id && allRequestsMap.set(req.id, req));
      serverRequests.forEach((req) => req?.id && allRequestsMap.set(req.id, req));
      const combinedRequests = Array.from(allRequestsMap.values());

      if (combinedRequests.length === 0) {
        setMyFulfilledRequests([]);
        return;
      }

      // Match against papers catalogue
      const fulfilled = [];
      for (const req of combinedRequests) {
        if (!req.subject) continue;
        const reqSub = req.subject.toLowerCase().trim();
        const reqYr = req.year ? req.year.toString().trim() : "";

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

        if (foundPaper || req.status === "uploaded" || req.status === "resolved") {
          fulfilled.push({
            id: `req_${req.id || `${req.subject}_${req.year}`}`,
            request: req,
            paper: foundPaper,
            studentName: req.name || user?.name || "Student",
            fulfilledAt: req.updated_at || foundPaper?.created_at || req.created_at || new Date().toISOString(),
          });
        }
      }

      setMyFulfilledRequests(fulfilled);
    } catch (err) {
      console.warn("Error checking my requests:", err);
    }
  };

  useEffect(() => {
    loadReadState();
    checkMyRequests();

    const handleSync = () => {
      loadReadState();
      checkMyRequests();
    };

    window.addEventListener("desh_requests_updated", handleSync);
    window.addEventListener("desh_user_updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("desh_requests_updated", handleSync);
      window.removeEventListener("desh_user_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [papers]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Latest 12 papers added to system
  const recentPapers = useMemo(() => {
    if (!papers || papers.length === 0) return [];
    return [...papers]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 12);
  }, [papers]);

  // Filter out any notifications that have been marked as read/dismissed
  const visibleFulfilledRequests = useMemo(() => {
    return myFulfilledRequests.filter(
      (item) => !dismissedNotificationIds.includes(String(item.id))
    );
  }, [myFulfilledRequests, dismissedNotificationIds]);

  const visibleRecentPapers = useMemo(() => {
    return recentPapers.filter(
      (p) => !dismissedNotificationIds.includes(String(p.id))
    );
  }, [recentPapers, dismissedNotificationIds]);

  const totalVisibleNotifications =
    visibleFulfilledRequests.length + visibleRecentPapers.length;

  // Unread counts: only count unread items that haven't been dismissed/cleared
  const unreadCount = useMemo(() => {
    let count = 0;
    const lastRead = lastReadTime ? new Date(lastReadTime).getTime() : 0;

    visibleFulfilledRequests.forEach((item) => {
      const itemTime = new Date(item.fulfilledAt).getTime();
      if (itemTime > lastRead) count++;
    });

    visibleRecentPapers.forEach((p) => {
      const pTime = new Date(p.created_at || 0).getTime();
      if (pTime > lastRead) count++;
    });

    return count;
  }, [visibleFulfilledRequests, visibleRecentPapers, lastReadTime]);

  // Mark all as read & clear them from list
  const handleMarkAllAsRead = () => {
    const nowIso = new Date().toISOString();
    setLastReadTime(nowIso);

    // Collect all visible notification IDs to dismiss and clear
    const allIdsToDismiss = [
      ...visibleFulfilledRequests.map((item) => String(item.id)),
      ...visibleRecentPapers.map((p) => String(p.id)),
    ];

    const updatedDismissed = Array.from(
      new Set([...dismissedNotificationIds, ...allIdsToDismiss])
    );
    setDismissedNotificationIds(updatedDismissed);

    try {
      localStorage.setItem("desh_notifications_last_read", nowIso);
      localStorage.setItem("desh_dismissed_notifs", JSON.stringify(updatedDismissed));

      // Also dismiss any corresponding return visit alerts
      const alertKeysToDismiss = visibleFulfilledRequests.map(
        (item) => `alert_${item.request?.id || `${item.request?.subject}_${item.request?.year}`}`
      );
      const currentAlerts = JSON.parse(localStorage.getItem("desh_dismissed_alerts") || "[]");
      const updatedAlerts = Array.from(new Set([...currentAlerts, ...alertKeysToDismiss]));
      localStorage.setItem("desh_dismissed_alerts", JSON.stringify(updatedAlerts));
    } catch (e) {
      console.warn(e);
    }
  };

  // Dismiss a single notification item
  const handleDismissItem = (id, e) => {
    if (e) e.stopPropagation();
    const updated = Array.from(new Set([...dismissedNotificationIds, String(id)]));
    setDismissedNotificationIds(updated);
    try {
      localStorage.setItem("desh_dismissed_notifs", JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Actions
  const handleViewPaper = (paper, notificationId = null) => {
    if (!paper) return;
    if (notificationId) {
      handleDismissItem(notificationId);
    } else if (paper.id) {
      handleDismissItem(paper.id);
    }
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("desh_view_paper", { detail: paper }));
  };

  const handleDownloadPaper = (paper, notificationId = null) => {
    if (!paper) return;
    if (notificationId) {
      handleDismissItem(notificationId);
    } else if (paper.id) {
      handleDismissItem(paper.id);
    }
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("desh_download_paper", { detail: paper }));
  };

  const handleOpenRequestModal = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("desh_open_request_modal"));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl sm:rounded-2xl border transition-all duration-300 shadow-2xs hover:scale-105 cursor-pointer group shrink-0 ${
          isOpen
            ? "bg-rose-100/90 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border-rose-400 dark:border-rose-600 ring-2 ring-rose-500/20"
            : "bg-rose-50/90 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border-rose-200/90 dark:border-rose-800/80 hover:border-rose-400 dark:hover:border-rose-600"
        }`}
        title="දැනුම්දීම් (Notifications)"
        aria-label="Notifications"
      >
        <svg
          className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ${
            unreadCount > 0 ? "animate-wiggle group-hover:scale-110" : "group-hover:scale-105"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9.5px] font-black flex items-center justify-center shadow-xs shadow-red-500/40 animate-pulse border-2 border-white dark:border-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Dropdown Card */}
      {isOpen && (
        <div
          className={`z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden ${
            isMobile
              ? "fixed left-2 right-2 top-19 sm:top-21 max-h-[85vh]"
              : "absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[520px]"
          }`}
          style={{ width: isMobile ? "calc(100vw - 16px)" : undefined }}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-sm font-bold">
                🔔
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    දැනුම්දීම් (Notifications)
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 font-black text-[10px]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-400 dark:text-slate-500">
                  අලුත්ම ප්‍රශ්න පත්‍ර සහ ඔබ ඉල්ලූ පත්‍ර
                </p>
              </div>
            </div>

            {totalVisibleNotifications > 0 ? (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-[11px] font-bold text-blue-600 dark:text-cyan-400 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                title="සියල්ල කියවූ ලෙස සලකුණු කර ඉවත් කරන්න (Clear All)"
              >
                <span>Clear all</span>
                <span>✓</span>
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>All clear</span>
                <span>✓</span>
              </span>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 shrink-0 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              සියල්ල (All)
            </button>

            {visibleFulfilledRequests.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter("requests")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeFilter === "requests"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                }`}
              >
                <span>🎉 මගේ ඉල්ලීම්</span>
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-black">
                  {visibleFulfilledRequests.length}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveFilter("new")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                activeFilter === "new"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              අලුත් Papers
            </button>
          </div>

          {/* Notification Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 sm:p-2.5 space-y-1.5 custom-scrollbar">
            
            {/* 1. PERSONAL FULFILLED REQUESTS (ONLY FOR THIS USER) */}
            {(activeFilter === "all" || activeFilter === "requests") &&
              visibleFulfilledRequests.map((item) => (
                <div
                  key={item.id}
                  className="relative p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/30 border border-emerald-500/30 dark:border-emerald-500/40 shadow-xs space-y-2 animate-in fade-in"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1">
                        <span>🎉</span>
                        <span>ඔබ ඉල්ලූ ප්‍රශ්න පත්‍රය (Your Request)</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                        {formatTimeAgo(item.fulfilledAt)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDismissItem(item.id, e)}
                        className="w-5 h-5 rounded-md hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center text-xs transition cursor-pointer"
                        title="ඉවත් කරන්න (Clear)"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white leading-snug">
                      {item.paper?.title || `${item.request.year ? `${item.request.year} ` : ""}${item.request.subject || "ප්‍රශ්න පත්‍රය"} (${item.request.medium || "මාධ්‍යය"})`}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      ඔබගේ ඉල්ලීම පරිදි මෙම ප්‍රශ්න පත්‍රය දැන් පද්ධතියට Upload කර ඇත. පහතින් Download කරගන්න!
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {item.paper && (
                      <button
                        type="button"
                        onClick={() => handleViewPaper(item.paper, item.id)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>බලන්න (View)</span>
                      </button>
                    )}
                    {item.paper && (
                      <button
                        type="button"
                        onClick={() => handleDownloadPaper(item.paper, item.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>බාගන්න (Download)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

            {/* 2. NEWLY ADDED PAPERS (SHOWN TO ALL USERS) */}
            {(activeFilter === "all" || activeFilter === "new") &&
              visibleRecentPapers.map((paper) => {
                const isNew =
                  lastReadTime && new Date(paper.created_at || 0).getTime() > new Date(lastReadTime).getTime();

                return (
                  <div
                    key={paper.id}
                    onClick={() => handleViewPaper(paper, paper.id)}
                    className="p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition cursor-pointer flex flex-col gap-1 group border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-black bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                          {paper.category || "O/L"}
                        </span>
                        {paper.year && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {paper.year}
                          </span>
                        )}
                        {paper.stream && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                            {paper.stream}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isNew && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" title="අලුත්" />
                        )}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {formatTimeAgo(paper.created_at)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDismissItem(paper.id, e)}
                          className="w-5 h-5 rounded-md hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center text-xs transition cursor-pointer opacity-80 hover:opacity-100"
                          title="ඉවත් කරන්න (Clear)"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition leading-snug line-clamp-2">
                      {paper.title}
                    </h4>

                    {/* Quick Action links */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-[10px] text-slate-400">
                        {paper.medium || "Sinhala Medium"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-cyan-400 font-bold hover:underline">
                          බලන්න ↗
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPaper(paper, paper.id);
                          }}
                          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                        >
                          බාගන්න 📥
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Empty State */}
            {((activeFilter === "requests" && visibleFulfilledRequests.length === 0) ||
              (visibleRecentPapers.length === 0 && visibleFulfilledRequests.length === 0)) && (
              <div className="py-10 px-4 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 mx-auto flex items-center justify-center text-xl font-black">
                  ✓
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeFilter === "requests"
                    ? "ඔබ විසින් ඉල්ලූ ප්‍රශ්න පත්‍ර තවමත් එක් කර නොමැත"
                    : "සියලු දැනුම්දීම් කියවා ඉවත් කර ඇත (All Cleared)"}
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  නව ප්‍රශ්න පත්‍රයක් හෝ ඔබ ඉල්ලූ ප්‍රශ්න පත්‍රයක් එක් වූ විට මෙහි දිස්වනු ඇත.
                </p>
              </div>
            )}
          </div>

          {/* Footer: Request a Paper shortcut */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ප්‍රශ්න පත්‍රයක් සොයාගත නොහැකිද?
            </span>
            <button
              type="button"
              onClick={handleOpenRequestModal}
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline cursor-pointer text-xs"
            >
              <span>Request කරන්න</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

