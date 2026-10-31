import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const category = formData.get("category");
    const subject = formData.get("subject");
    const year = formData.get("year");

    // 1. Validate required fields
    if (!title || !category || !subject || !year) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields (title, category, subject, year) are required.",
        },
        { status: 400 }
      );
    }

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          error: "A valid PDF file is required.",
        },
        { status: 400 }
      );
    }

    // 2. Validate file type (PDF only)
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only PDF documents are allowed.",
        },
        { status: 400 }
      );
    }

    // 3. Generate a safe unique file name
    const sanitizedFileName = file.name
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

    // 4. Convert file to buffer and upload to Cloudflare R2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME?.trim(),
      Key: uniqueFileName,
      Body: buffer,
      ContentType: "application/pdf",
    };

    await r2.send(new PutObjectCommand(uploadParams));

    // 5. Construct public download URL
    const publicBaseUrl = (
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ""
    ).replace(/\/+$/, "");
    const fileUrl = `${publicBaseUrl}/${uniqueFileName}`;

    // 6. Insert new record into Supabase 'papers' table
    const { data, error: dbError } = await supabase
      .from("papers")
      .insert([
        {
          title: title.toString().trim(),
          category: category.toString().trim(),
          subject: subject.toString().trim(),
          year: parseInt(year.toString(), 10),
          file_url: fileUrl,
        },
      ])
      .select();

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: `Database insertion failed: ${dbError.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Paper uploaded successfully!",
        data: data ? data[0] : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during upload.",
      },
      { status: 500 }
    );
  }
}

