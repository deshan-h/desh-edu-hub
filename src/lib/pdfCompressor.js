import { PDFDocument, PDFName, PDFNumber, PDFRawStream } from "pdf-lib";
import sharp from "sharp";
import zlib from "zlib";

/**
 * High-performance PDF Optimizer:
 * 1. Scans all indirect image objects in the PDF (both DCTDecode/JPEG and FlateDecode/PNG/raw).
 * 2. Downsamples massive scanner megapixels (e.g. 5000x7000) down to crisp A4 reading resolution (max 1600px).
 * 3. Re-encodes with MozJPEG compression (Quality 68-70).
 * 4. Updates PDF stream dictionary dimensions (/Width, /Height, /Length, /Filter).
 * 5. Saves entire PDF with useObjectStreams (zlib cross-reference and structure compression).
 *
 * @param {PDFDocument} pdfDoc
 * @param {object} options
 * @returns {Promise<{ imagesOptimized: number, bytesSaved: number }>}
 */
export async function optimizePdfDocument(pdfDoc, options = {}) {
  const quality = options.quality || 68;
  const maxDimension = options.maxDimension || 1600;

  let imagesOptimized = 0;
  let bytesSaved = 0;

  try {
    const objects = pdfDoc.context.enumerateIndirectObjects();

    for (const [ref, obj] of objects) {
      if (obj instanceof PDFRawStream) {
        const subtype = obj.dict.get(PDFName.of("Subtype"));
        if (subtype?.toString() === "/Image") {
          const filterObj = obj.dict.get(PDFName.of("Filter"));
          const filterStr = filterObj ? filterObj.toString() : "";
          const originalBytes = obj.contents;

          // Only process images larger than 40 KB
          if (!originalBytes || originalBytes.length <= 40 * 1024) {
            continue;
          }

          // Case 1: JPEG Image (handles both "/DCTDecode" and "[ /DCTDecode ]")
          if (filterStr.includes("DCTDecode")) {
            try {
              const transformer = sharp(Buffer.from(originalBytes));
              const meta = await transformer.metadata();

              let pipeline = sharp(Buffer.from(originalBytes));
              if (meta.width > maxDimension || meta.height > maxDimension) {
                pipeline = pipeline.resize({
                  width: meta.width > meta.height ? maxDimension : undefined,
                  height: meta.height >= meta.width ? maxDimension : undefined,
                  fit: "inside",
                  withoutEnlargement: true,
                });
              }

              const compressedJpg = await pipeline
                .jpeg({ quality, mozjpeg: true })
                .toBuffer();

              if (compressedJpg.length < originalBytes.length) {
                const compressedMeta = await sharp(compressedJpg).metadata();
                const saved = originalBytes.length - compressedJpg.length;
                bytesSaved += saved;

                obj.contents = new Uint8Array(compressedJpg);
                obj.dict.set(PDFName.of("Length"), PDFNumber.of(compressedJpg.length));
                obj.dict.set(PDFName.of("Width"), PDFNumber.of(compressedMeta.width));
                obj.dict.set(PDFName.of("Height"), PDFNumber.of(compressedMeta.height));
                imagesOptimized++;
              }
            } catch (err) {
              // Gracefully continue if an individual stream has unsupported metadata
            }
          }
          // Case 2: FlateDecode / PNG / Raw scanner raster
          else if (filterStr.includes("FlateDecode") && originalBytes.length > 80 * 1024) {
            try {
              // Try direct sharp parse (works if stream contains PNG / TIFF container)
              let pipeline = sharp(Buffer.from(originalBytes));
              const meta = await pipeline.metadata();

              if (meta && meta.width && meta.height) {
                if (meta.width > maxDimension || meta.height > maxDimension) {
                  pipeline = pipeline.resize({
                    width: meta.width > meta.height ? maxDimension : undefined,
                    height: meta.height >= meta.width ? maxDimension : undefined,
                    fit: "inside",
                    withoutEnlargement: true,
                  });
                }

                const compressedJpg = await pipeline
                  .jpeg({ quality, mozjpeg: true })
                  .toBuffer();

                if (compressedJpg.length < originalBytes.length) {
                  const compressedMeta = await sharp(compressedJpg).metadata();
                  const saved = originalBytes.length - compressedJpg.length;
                  bytesSaved += saved;

                  obj.contents = new Uint8Array(compressedJpg);
                  obj.dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
                  obj.dict.set(PDFName.of("Length"), PDFNumber.of(compressedJpg.length));
                  obj.dict.set(PDFName.of("Width"), PDFNumber.of(compressedMeta.width));
                  obj.dict.set(PDFName.of("Height"), PDFNumber.of(compressedMeta.height));
                  obj.dict.delete(PDFName.of("DecodeParms"));
                  imagesOptimized++;
                }
              }
            } catch (flateErr) {
              // Continue if raw uncontained stream
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("PDF optimization general warning:", err.message);
  }

  return { imagesOptimized, bytesSaved };
}
