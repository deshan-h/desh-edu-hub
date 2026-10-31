import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    // Verify Admin Authentication
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const sessionSecret = (
      process.env.ADMIN_SESSION_SECRET || "desh-papers-hub-admin-secret-2026"
    ).trim();

    if (!sessionCookie || sessionCookie !== sessionSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required." },
        { status: 401 }
      );
    }

    const { id, fileUrl } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Paper ID is required." },
        { status: 400 }
      );
    }

    // 1. Delete object from Cloudflare R2 storage
    if (fileUrl) {
      try {
        const fileKey = fileUrl.split("/").pop();
        if (fileKey) {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME?.trim(),
              Key: fileKey,
            })
          );
        }
      } catch (r2Err) {
        console.warn("R2 file deletion notice:", r2Err);
      }
    }

    // 2. Delete record from Supabase 'papers' table
    const { error: dbError } = await supabase
      .from("papers")
      .delete()
      .eq("id", id);

    if (dbError) {
      return NextResponse.json(
        { success: false, error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Paper deleted successfully.",
    });
  } catch (err) {
    console.error("Delete paper API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete paper." },
      { status: 500 }
    );
  }
}

