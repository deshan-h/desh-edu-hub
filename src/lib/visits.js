import { supabase } from "./supabase.js";
import fs from "fs";
import path from "path";

// Local JSON fallback file path
const LOCAL_VISITS_FILE = path.join(process.cwd(), ".data", "site_visits.json");

// Helper to ensure .data directory exists
function ensureLocalDir() {
  const dir = path.dirname(LOCAL_VISITS_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn("Could not create .data directory:", e);
    }
  }
}

// Read local visits fallback
function readLocalVisits() {
  try {
    ensureLocalDir();
    if (fs.existsSync(LOCAL_VISITS_FILE)) {
      const data = fs.readFileSync(LOCAL_VISITS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Error reading local visits:", e);
  }
  return { visits: [] };
}

// Write local visits fallback
function writeLocalVisits(data) {
  try {
    ensureLocalDir();
    fs.writeFileSync(LOCAL_VISITS_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.warn("Error writing local visits:", e);
  }
}

// Format Sri Lankan date (YYYY-MM-DD in Asia/Colombo time, UTC+5:30)
export function getColomboDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().split("T")[0];
  }
}

/**
 * Record a single site visit
 */
export async function recordVisit({ path = "/", referrer = null, userAgent = null, screen = null } = {}) {
  const now = new Date();
  const visitDate = getColomboDate(now);
  const record = {
    page_path: path || "/",
    referrer: referrer || null,
    user_agent: userAgent || null,
    visit_date: visitDate,
    visited_at: now.toISOString(),
  };

  let supabaseSuccess = false;

  // 1. Attempt to insert into Supabase `site_visits` table
  try {
    const { error } = await supabase.from("site_visits").insert([record]);
    if (!error) {
      supabaseSuccess = true;
    }
  } catch (e) {
    // Supabase table might not exist yet
  }

  // 2. Always maintain local cache fallback
  try {
    const local = readLocalVisits();
    local.visits = local.visits || [];
    local.visits.push({
      ...record,
      screen: screen || null,
    });

    // Keep last 15,000 visits to prevent memory explosion
    if (local.visits.length > 15000) {
      local.visits = local.visits.slice(-15000);
    }

    writeLocalVisits(local);
  } catch (e) {
    console.warn("Local visit record notice:", e);
  }

  return { success: true, supabase: supabaseSuccess, date: visitDate };
}

/**
 * Get aggregated day-by-day site visit analytics
 */
export async function getVisitStats(daysCount = 14) {
  const todayStr = getColomboDate();
  let rawVisits = [];

  // 1. Try to fetch from Supabase
  try {
    const { data, error } = await supabase
      .from("site_visits")
      .select("visit_date, visited_at, page_path")
      .order("visited_at", { ascending: false })
      .limit(20000);

    if (!error && data && data.length > 0) {
      rawVisits = data;
    }
  } catch (e) {
    // Fall back to local
  }

  // 2. If Supabase is empty or table doesn't exist, use local visits
  if (rawVisits.length === 0) {
    const local = readLocalVisits();
    rawVisits = local.visits || [];
  }

  // Group visits by date (YYYY-MM-DD)
  const dateCounts = {};
  const pageCounts = {};

  rawVisits.forEach((v) => {
    const d = v.visit_date || (v.visited_at ? v.visited_at.split("T")[0] : null);
    if (d) {
      dateCounts[d] = (dateCounts[d] || 0) + 1;
    }
    const p = v.page_path || "/";
    pageCounts[p] = (pageCounts[p] || 0) + 1;
  });

  // Generate continuous past N days list (including days with 0 visits)
  const dailyStats = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = getColomboDate(d);

    // Format human-friendly label (e.g. "Nov 03" or "Mon, 3")
    const formatted = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Colombo",
    }).format(d);

    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "Asia/Colombo",
    }).format(d);

    dailyStats.push({
      date: dateStr,
      label: formatted,
      weekday: weekday,
      count: dateCounts[dateStr] || 0,
      isToday: dateStr === todayStr,
    });
  }

  // Summary Metrics
  const todayVisits = dateCounts[todayStr] || 0;

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getColomboDate(yesterday);
  const yesterdayVisits = dateCounts[yesterdayStr] || 0;

  // Last 7 days sum
  let last7DaysTotal = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = getColomboDate(d);
    last7DaysTotal += dateCounts[dateStr] || 0;
  }

  // Total All-Time Recorded
  const totalVisits = rawVisits.length;

  // Peak day in the window
  let peakDay = { date: todayStr, count: 0, label: "Today" };
  dailyStats.forEach((stat) => {
    if (stat.count >= peakDay.count) {
      peakDay = stat;
    }
  });

  // Daily Average in the selected window
  const sumInWindow = dailyStats.reduce((acc, curr) => acc + curr.count, 0);
  const averageInWindow = Math.round(sumInWindow / Math.max(1, dailyStats.length));

  return {
    today: todayVisits,
    yesterday: yesterdayVisits,
    last7Days: last7DaysTotal,
    total: totalVisits,
    peakDay,
    dailyAverage: averageInWindow,
    daily: dailyStats,
    daysRequested: daysCount,
    topPages: Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count })),
  };
}
