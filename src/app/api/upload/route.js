import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { supabase } from "@/lib/supabase";
import { PDFDocument, PageSizes } from "pdf-lib";
import { optimizePdfDocument } from "@/lib/pdfCompressor";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // 0. Verify Admin Authentication
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const sessionSecret = (
      process.env.ADMIN_SESSION_SECRET || "desh-papers-hub-admin-secret-2026"
    ).trim();

    if (!sessionCookie || sessionCookie !== sessionSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin login is required to upload." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const category = formData.get("category");
    const subject = formData.get("subject");
    const year = formData.get("year");
    const stream = formData.get("stream");
    const grade = formData.get("grade");
    const hasAnswers =
      formData.get("has_answers") === "true" ||
      formData.get("with_answers") === "true";

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

    // 2.5 Prevent Duplicate Paper Uploads (Check Database)
    const trimmedTitle = title.toString().trim();
    const trimmedCat = category.toString().trim();
    const trimmedSubj = subject.toString().trim();
    const parsedYear = parseInt(year.toString(), 10);

    // A. Check by exact title (case-insensitive)
    const { data: titleMatches } = await supabase
      .from("papers")
      .select("id, title, category, subject, year, has_answers")
      .ilike("title", trimmedTitle)
      .limit(1);

    if (titleMatches && titleMatches.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `This paper already exists in the catalog ("${titleMatches[0].title}"). Duplicate uploads are not allowed.`,
        },
        { status: 409 }
      );
    }

    // Helper to detect province name in text
    const PROVINCE_KEYS = [
      "western",
      "central",
      "southern",
      "north western",
      "sabaragamuwa",
      "eastern",
      "uva",
      "northern",
      "north central",
    ];

    const getProvince = (txt) => {
      if (!txt) return null;
      const lower = txt.toLowerCase();
      for (const prov of PROVINCE_KEYS) {
        if (lower.includes(prov)) return prov;
      }
      return null;
    };

    // B. Check by category, subject, year, and answers combination
    const { data: metaMatches } = await supabase
      .from("papers")
      .select("id, title, category, subject, year, has_answers")
      .eq("category", trimmedCat)
      .ilike("subject", trimmedSubj)
      .eq("year", parsedYear);

    if (metaMatches && metaMatches.length > 0) {
      const currentProvince = getProvince(trimmedTitle);

      const duplicate = metaMatches.find((p) => {
        const pAns =
          p.has_answers === true ||
          p.has_answers === "true" ||
          p.title?.toLowerCase().includes("answers") ||
          p.title?.includes("පිළිතුරු");
        if (pAns !== hasAnswers) return false;

        // If provinces are different, they are NEVER duplicates!
        const pProvince = getProvince(p.title);
        if (currentProvince && pProvince && currentProvince !== pProvince) {
          return false;
        }

        // For Provincial papers, they differ by province, grade, and term
        if (trimmedCat.toLowerCase() === "provincial" || p.category?.toLowerCase() === "provincial") {
          return false;
        }

        return true;
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `A paper with these exact details already exists ("${duplicate.title}"). Duplicate uploads are not allowed.`,
          },
          { status: 409 }
        );
      }
    }

    // 3. Generate a safe unique file name
    const sanitizedFileName = file.name
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

    // 4. Convert uploaded file to Buffer & process with pdf-lib to append poster
    const arrayBuffer = await file.arrayBuffer();
    let uploadBuffer = Buffer.from(arrayBuffer);

    try {
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Path to the promotional A4 poster image in the public directory
      const publicDir = path.join(process.cwd(), "public");
      const possiblePosterNames = [
        "promo-poster.jpg",
        "promo-poster.png",
        "promo-poster.jpeg",
        "poster.jpg",
        "poster.png",
      ];

      let posterBuffer = null;
      let chosenFileName = "";

      for (const name of possiblePosterNames) {
        try {
          const candidatePath = path.join(publicDir, name);
          posterBuffer = await fs.readFile(candidatePath);
          chosenFileName = name;
          break;
        } catch {
          // File does not exist, continue checking candidates
        }
      }

      if (posterBuffer) {
        // Detect image format from magic bytes (even if named .jpg, may contain PNG bytes)
        const isPng =
          posterBuffer[0] === 0x89 &&
          posterBuffer[1] === 0x50 &&
          posterBuffer[2] === 0x4e &&
          posterBuffer[3] === 0x47;

        const embeddedImage = isPng
          ? await pdfDoc.embedPng(posterBuffer)
          : await pdfDoc.embedJpg(posterBuffer);

        // Standard A4 dimensions in PDF points: [595.28, 841.89]
        const [a4Width, a4Height] = PageSizes.A4;

        // Append a new A4 page to the VERY END of the PDF document
        const newPage = pdfDoc.addPage([a4Width, a4Height]);

        // Draw the poster image so it covers the entire A4 page full-bleed
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: a4Width,
          height: a4Height,
        });

        console.log(`Attached promo poster (${chosenFileName}). New page count: ${pdfDoc.getPageCount()}`);
      } else {
        console.warn("Promotional poster image not found in public folder, proceeding with PDF compression.");
      }

      // Compress the entire PDF (downsample & optimize embedded images across all pages)
      const { imagesOptimized, bytesSaved } = await optimizePdfDocument(pdfDoc, {
        quality: 72,
        maxDimension: 1600,
      });

      // Save the modified PDF with object streams compression enabled
      const modifiedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
      });
      uploadBuffer = Buffer.from(modifiedPdfBytes);

      console.log(
        `PDF Optimization Complete: Original: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)} MB, Final: ${(uploadBuffer.length / 1024 / 1024).toFixed(2)} MB (${imagesOptimized} images optimized, ${(bytesSaved / 1024 / 1024).toFixed(2)} MB saved).`
      );
    } catch (pdfError) {
      console.warn("Notice: Could not compress or append promo poster, uploading original:", pdfError);
      // Fallback: upload original PDF buffer
      uploadBuffer = Buffer.from(arrayBuffer);
    }

    // 5. Upload the modified PDF buffer to Cloudflare R2
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME?.trim(),
      Key: uniqueFileName,
      Body: uploadBuffer,
      ContentType: "application/pdf",
      ContentDisposition: `inline; filename="${sanitizedFileName}"`,
    };

    await r2.send(new PutObjectCommand(uploadParams));

    // 6. Construct public download URL
    const publicBaseUrl = (
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ""
    ).replace(/\/+$/, "");
    const fileUrl = `${publicBaseUrl}/${uniqueFileName}`;

    // 7. Insert new record into Supabase 'papers' table
    let insertPayload = {
      title: title.toString().trim(),
      category: category.toString().trim(),
      subject: subject.toString().trim(),
      year: parseInt(year.toString(), 10),
      file_url: fileUrl,
      download_count: 0,
      has_answers: hasAnswers,
    };

    if (stream && stream.toString().trim()) {
      insertPayload.stream = stream.toString().trim();
    }

    if (grade && grade.toString().trim() && grade.toString().trim() !== "None / General") {
      insertPayload.grade = grade.toString().trim();
    }

    let { data, error: dbError } = await supabase
      .from("papers")
      .insert([insertPayload])
      .select();

    // Gracefully handle if optional columns ('has_answers', 'stream', 'grade') don't exist yet in Supabase
    if (
      dbError &&
      (dbError.message?.includes("has_answers") ||
        dbError.message?.includes("stream") ||
        dbError.message?.includes("grade") ||
        dbError.code === "PGRST204" ||
        dbError.code === "42703")
    ) {
      console.warn("Optional column missing in Supabase, retrying without optional columns...");
      delete insertPayload.has_answers;
      delete insertPayload.stream;
      delete insertPayload.grade;

      const retryResult = await supabase
        .from("papers")
        .insert([insertPayload])
        .select();
      data = retryResult.data;
      dbError = retryResult.error;
    }

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

    // 8. Auto-mark matching pending student requests as 'uploaded'
    try {
      const cleanSub = subject.toString().trim().toLowerCase();
      const cleanYr = year.toString().trim();

      const { data: pendingReqs } = await supabase
        .from("requests")
        .select("id, subject, year, type, status")
        .eq("status", "pending")
        .eq("year", cleanYr);

      if (pendingReqs && pendingReqs.length > 0) {
        const matchingIds = pendingReqs
          .filter((r) => {
            if (!r.subject) return false;
            const rSub = r.subject.toLowerCase().trim();
            return cleanSub.includes(rSub) || rSub.includes(cleanSub);
          })
          .map((r) => r.id);

        if (matchingIds.length > 0) {
          await supabase
            .from("requests")
            .update({ status: "uploaded" })
            .in("id", matchingIds);
          console.log(`Auto-marked ${matchingIds.length} requests as uploaded.`);
        }
      }
    } catch (reqAutoErr) {
      console.warn("Could not auto-mark matching requests:", reqAutoErr.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Paper uploaded successfully with promotional poster attached!",
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
