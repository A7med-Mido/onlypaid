import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import AssetModel from "@/db/models/asset.model";
import UserModel from "@/db/models/user.model";
import { writeFile, mkdir, unlink, stat } from "fs/promises";
import path from "path";
import archiver from "archiver";
import { createWriteStream } from "node:fs";
import { STATUS } from "@/constants/http";
import envs from "@/configs/envs.config";

export const dynamic = "force-dynamic";
export const maxDuration = 600;

export async function POST(req: NextRequest) {
  let thumbnailPath: string | undefined;
  let assetPath: string | undefined;
  let zipPath: string | undefined;

  try {
    // In App Router → no req/res passed
    const session: Session | null = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: STATUS.UNAUTHORIZED });
    }

    const user = await UserModel.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: STATUS.UNAUTHORIZED });
    }

    const formData = await req.formData();

    const name        = formData.get("name")        as string | null;
    const description = formData.get("description") as string | null;
    const priceStr    = formData.get("price")       as string | null;
    const thumbnail   = formData.get("thumbnail")   as File | null;
    const assetFile   = formData.get("asset")       as File | null;

    if (!name || !description || !priceStr || !thumbnail || !assetFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const price = Number(priceStr);
    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const MAX_ASSET_MB = Number(envs.MAX_UPLOAD_FILE) || 10;
    const MAX_THUMB_MB = 8;

    if (assetFile.size > MAX_ASSET_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Asset file too large (max ${MAX_ASSET_MB} MB)` },
        { status: 413 }
      );
    }

    if (thumbnail.size > MAX_THUMB_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Thumbnail too large (max ${MAX_THUMB_MB} MB)` },
        { status: 413 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const publicDir = path.join(process.cwd(), "public");
    await mkdir(uploadDir, { recursive: true });

    // Save thumbnail
    const thumbExt  = thumbnail.name.split(".").pop() || "jpg";
    const thumbName = `${Date.now()}-thumb.${thumbExt}`;
    thumbnailPath   = path.join(publicDir, thumbName);
    await writeFile(thumbnailPath, Buffer.from(await thumbnail.arrayBuffer()));

    // Save asset
    const assetExt  = assetFile.name.split(".").pop() || "bin";
    const assetName = `${Date.now()}.${assetExt}`;
    assetPath       = path.join(uploadDir, assetName);
    await writeFile(assetPath, Buffer.from(await assetFile.arrayBuffer()));

    // ───────────────────────────────────────────────
    // Create ZIP
    // ───────────────────────────────────────────────
    const zipName = `${Date.now()}-asset.zip`;
    zipPath = path.join(uploadDir, zipName);

    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 6 } });

    // Type-safe event handlers
    archive.on("warning", (err: archiver.ArchiverError) => {
      if (err.code === "ENOENT") {
        console.warn("Archiver warning:", err);
      } else {
        throw err;
      }
    });

    archive.on("error", (err: Error) => {
      throw err;
    });

    archive.pipe(output);

    archive.file(assetPath, { name: assetFile.name || `asset.${assetExt}` });
    archive.file(thumbnailPath, { name: `thumbnail.${thumbExt}` });

    await archive.finalize();

    // Wait for completion
    await new Promise<void>((resolve, reject) => {
      output.on("close", resolve);
      output.on("error", reject);
    });

    const stats = await stat(zipPath);
    const compressedSizeKb = Math.round(stats.size / 1024);

    // Cleanup originals
    await Promise.allSettled([
      unlink(thumbnailPath).catch(() => {}),
      unlink(assetPath).catch(() => {}),
    ]);

    const publicZip = `/uploads/${zipName}`;

    const newAsset = await AssetModel.create({
      name,
      description,
      price,
      sellerId: user._id.toString(),
      thumbnailImage: publicZip,
      asset: publicZip,
      size: compressedSizeKb,
    });

    return NextResponse.json({
      success: true,
      asset: {
        _id: newAsset._id,
        name: newAsset.name,
        thumbnailImage: newAsset.thumbnailImage,
        asset: newAsset.asset,
        price: newAsset.price,
        size: newAsset.size,
      },
    });
  } catch (err: unknown) {
    console.error("Upload error:", err);

    await Promise.allSettled([
      thumbnailPath ? unlink(thumbnailPath).catch(() => {}) : Promise.resolve(),
      assetPath     ? unlink(assetPath).catch(() => {})     : Promise.resolve(),
      zipPath       ? unlink(zipPath).catch(() => {})       : Promise.resolve(),
    ]);

    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Upload failed", message },
      { status: STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}