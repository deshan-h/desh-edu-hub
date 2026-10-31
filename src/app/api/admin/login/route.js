import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = (process.env.ADMIN_USERNAME || "admin").trim();
    const expectedPassword = (process.env.ADMIN_PASSWORD || "admin123").trim();
    const sessionSecret = (
      process.env.ADMIN_SESSION_SECRET || "desh-papers-hub-admin-secret-2026"
    ).trim();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (
      username.trim() !== expectedUsername ||
      password.trim() !== expectedPassword
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Admin logged in successfully.",
    });

    response.cookies.set({
      name: "admin_session",
      value: sessionSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

