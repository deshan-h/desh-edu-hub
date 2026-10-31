import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const whatsapp_number = (body.whatsapp_number || body.whatsapp)?.trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    if (!whatsapp_number) {
      return NextResponse.json(
        { success: false, error: "WhatsApp number is required." },
        { status: 400 }
      );
    }

    // Upsert user into Supabase `users` table using `whatsapp_number` (handles UNIQUE constraint)
    const { data, error } = await supabase
      .from("users")
      .upsert(
        [
          {
            name,
            whatsapp_number,
            role: "user",
          },
        ],
        { onConflict: "whatsapp_number" }
      )
      .select();

    if (error) {
      console.error("Supabase user upsert error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully.",
      user: data ? data[0] : null,
    });
  } catch (err) {
    console.error("Error in /api/users:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
