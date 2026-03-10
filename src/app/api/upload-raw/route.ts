import { NextRequest, NextResponse } from "next/server";
import { createWriteStream } from "fs";
import { mkdir, stat, unlink } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import envs from "@/configs/envs.config";
import { STATUS } from "@/constants/http";

export const dynamic = "force-dynamic";
export const maxDuration = 600; // 10 minutes — adjust for your hosting

export async function POST(req: NextRequest) {
  let filePath: string | undefined;
  try {
    const session = await getServerSession();
    if(!session) {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415 })
    }

    // Optional: basic content-type check
    const contentType = req.headers.get("content-type") || "";
    if (
      !contentType.startsWith("application/")
      &&
      !contentType.startsWith("image/")
      &&
      !contentType.startsWith("video/")
      &&
      !contentType.startsWith("audio/")
    ) {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
    }

    // Get filename from query (?filename=...) or fallback
    let fileName = req.nextUrl.searchParams.get("filename") || `upload_${Date.now()}.bin`;
    fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_"); // sanitize

    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    filePath = path.join(uploadDir, fileName);

    const writeStream = createWriteStream(filePath);

    // req.body is a web ReadableStream<Uint8Array>
    const reader = req.body!.getReader();

    let totalBytes = 0;
    const MAX_BYTES = Number(envs .MAX_UPLOAD_FILE) * 1024 * 1024 * 1024;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        totalBytes += value.length;
        if (totalBytes > MAX_BYTES) {
          writeStream.destroy();
          if (filePath) await unlink(filePath).catch(() => {});
          return NextResponse.json({ error: "File too large" }, { status: 413 });
        }

        // write() returns boolean; false means backpressure → wait for drain
        if (!writeStream.write(value)) {
          await new Promise<void>((resolve) => writeStream.once("drain", resolve));
        }
      }
    }

    // End the stream and wait for finish
    await new Promise<void>((resolve, reject) => {
      writeStream.end(() => resolve());
      writeStream.on("error", reject);
    });

    const stats = await stat(filePath);

    const publicPath = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      name: fileName,
      size: stats.size,
    });
  } catch (err: any) {
    console.error("Upload error:", err);

    // Cleanup partial file
    if (filePath) {
      await unlink(filePath).catch(() => {});
    }

    return NextResponse.json(
      { error: "Upload failed", message: err.message || "Unknown error" },
      { status: STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}