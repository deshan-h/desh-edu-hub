import { NextResponse } from "next/server";
import { recordVisit, getVisitStats } from "@/lib/visits";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if called via navigator.sendBeacon
    }

    const path = body.path || "/";
    const referrer = body.referrer || null;
    const screen = body.screen || null;
    const userAgent = request.headers.get("user-agent") || null;

    const result = await recordVisit({
      path,
      referrer,
      userAgent,
      screen,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Visit recording API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = parseInt(searchParams.get("days") || "14", 10);
    const days = isNaN(daysParam) || daysParam < 1 ? 14 : Math.min(daysParam, 90);

    const stats = await getVisitStats(days);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("Visit stats API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

