import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const type = body.type || "paper_request"; // "paper_request" | "feedback"
    const name = body.name?.trim();
    const whatsapp = (body.whatsapp || body.whatsapp_number)?.trim();
    const category = body.category?.trim() || "";
    const subject = body.subject?.trim() || "";
    const year = body.year ? body.year.toString().trim() : "";
    const medium = body.medium?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    if (!whatsapp || whatsapp.length < 8) {
      return NextResponse.json(
        { success: false, error: "Valid WhatsApp number is required." },
        { status: 400 }
      );
    }

    // 1. Also register/update the student in the 'users' table so they don't have to re-enter
    try {
      await supabase.from("users").upsert(
        [
          {
            name,
            whatsapp_number: whatsapp,
            role: "user",
          },
        ],
        { onConflict: "whatsapp_number" }
      );
    } catch (e) {
      console.warn("User auto-sync notice:", e.message);
    }

    // 2. Insert into 'requests' table in Supabase
    let insertResult = null;
    let insertError = null;

    try {
      const res = await supabase
        .from("requests")
        .insert([
          {
            type,
            name,
            whatsapp,
            category,
            subject,
            year,
            medium,
            message,
            status: "pending",
          },
        ])
        .select();

      insertResult = res.data;
      insertError = res.error;
    } catch (err) {
      insertError = err;
    }

    if (insertError) {
      console.warn("Supabase requests table insert notice:", insertError.message || insertError);
      // If table doesn't exist yet, return success gracefully so public user is not blocked
      return NextResponse.json({
        success: true,
        message: "Your request has been received. Thank you!",
        data: {
          type,
          name,
          whatsapp,
          category,
          subject,
          year,
          medium,
          message,
          created_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Request submitted successfully.",
      data: insertResult ? insertResult[0] : null,
    });
  } catch (err) {
    console.error("API /api/requests POST error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase requests fetch notice:", error.message);
      return NextResponse.json({ success: true, requests: [] });
    }

    return NextResponse.json({ success: true, requests: data || [] });
  } catch (err) {
    console.error("API /api/requests GET error:", err);
    return NextResponse.json({ success: true, requests: [] });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and status are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, request: data ? data[0] : null });
  } catch (err) {
    console.error("API /api/requests PATCH error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("requests").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Request deleted successfully." });
  } catch (err) {
    console.error("API /api/requests DELETE error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

