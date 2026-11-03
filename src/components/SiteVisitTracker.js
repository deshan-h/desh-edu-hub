"use client";

import { useEffect } from "react";

/**
 * Lightweight, non-blocking client-side visit tracker.
 * Records unique session visits to feed the Admin Traffic Analytics.
 */
export default function SiteVisitTracker() {
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      // Do not track visits inside the private admin portal
      if (window.location.pathname.startsWith("/admin")) {
        return;
      }

      // Throttling: track once per session every 2 hours
      const lastRecorded = sessionStorage.getItem("desh_visit_recorded_time");
      const now = Date.now();
      if (lastRecorded && now - parseInt(lastRecorded, 10) < 1000 * 60 * 60 * 2) {
        return;
      }

      sessionStorage.setItem("desh_visit_recorded_time", now.toString());

      const payload = {
        path: window.location.pathname,
        referrer: document.referrer || null,
        screen: `${window.innerWidth}x${window.innerHeight}`,
      };

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/visits",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
      } else {
        fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch (e) {
      console.warn("Tracker notice:", e);
    }
  }, []);

  return null;
}

