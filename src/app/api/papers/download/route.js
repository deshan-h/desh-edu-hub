import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { paperId } = await request.json();

    if (!paperId) {
      return NextResponse.json(
        { success: false, error: "Paper ID is required." },
        { status: 400 }
      );
    }

    // 1. Get current count
    const { data: paper, error: fetchError } = await supabase
      .from("papers")
      .select("download_count")
      .eq("id", paperId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.warn("Fetch paper download count error:", fetchError);
    }

    const currentCount = paper?.download_count || 0;
    const nextCount = currentCount + 1;

    // 2. Update with incremented count
    const { data: updated, error: updateError } = await supabase
      .from("papers")
      .update({ download_count: nextCount })
      .eq("id", paperId)
      .select();

    if (updateError) {
      console.warn("Update download count error:", updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      download_count: nextCount,
    });
  } catch (err) {
    console.error("Error in /api/papers/download:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

