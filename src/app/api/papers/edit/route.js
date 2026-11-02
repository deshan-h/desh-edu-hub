import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    // 1. Verify Admin Authentication
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const sessionSecret = (
      process.env.ADMIN_SESSION_SECRET || "desh-papers-hub-admin-secret-2026"
    ).trim();

    if (!sessionCookie || sessionCookie !== sessionSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin login is required to edit papers." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, category, subject, year, has_answers } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Paper ID is required." },
        { status: 400 }
      );
    }

    if (!title?.trim() || !category?.trim() || !subject?.trim() || !year) {
      return NextResponse.json(
        { success: false, error: "Title, category, subject, and year are required." },
        { status: 400 }
      );
    }

    // 2. Prevent duplicate papers when editing
    const trimmedTitle = title.toString().trim();
    const { data: duplicateMatches } = await supabase
      .from("papers")
      .select("id, title")
      .neq("id", id)
      .ilike("title", trimmedTitle)
      .limit(1);

    if (duplicateMatches && duplicateMatches.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `මෙම නමින් වෙනත් ප්‍රශ්න පත්‍රයක් දැනටමත් පවතී ("${duplicateMatches[0].title}").`,
        },
        { status: 409 }
      );
    }

    // 2. Prepare update payload
    let updatePayload = {
      title: title.toString().trim(),
      category: category.toString().trim(),
      subject: subject.toString().trim(),
      year: parseInt(year.toString(), 10),
      has_answers: has_answers === true,
    };

    let { data, error: dbError } = await supabase
      .from("papers")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    // Gracefully handle if 'has_answers' column doesn't exist yet in Supabase
    if (
      dbError &&
      (dbError.message?.includes("has_answers") ||
        dbError.code === "PGRST204" ||
        dbError.code === "42703")
    ) {
      console.warn("Column has_answers missing in Supabase, retrying without column...");
      delete updatePayload.has_answers;

      const retryResult = await supabase
        .from("papers")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();
      data = retryResult.data;
      dbError = retryResult.error;
    }

    if (dbError) {
      console.error("Supabase update error:", dbError);
      return NextResponse.json(
        { success: false, error: `Failed to update paper: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Paper updated successfully!",
      data,
    });
  } catch (error) {
    console.error("Edit paper error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}

