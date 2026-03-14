import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import CollectionAssetModel from "@/db/models/assetCollection.model";
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
  const assetTempPaths: string[] = [];
  let zipPath: string | undefined;

  try {
    const session: Session | null = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: STATUS.UNAUTHORIZED }
      );
    }

    const user = await UserModel.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: STATUS.UNAUTHORIZED }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const priceStr = formData.get("price") as string | null;
    const thumbnail = formData.get("thumbnail") as File | null;

    // Support multiple asset files via getAll()
    const assetFiles = formData.getAll("assets") as File[];

    if (!name || !description || !priceStr || !thumbnail || assetFiles.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const price = Number(priceStr);

    if (Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    const MAX_THUMB_MB = 8;

    if (thumbnail.size > MAX_THUMB_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Thumbnail too large (max ${MAX_THUMB_MB} MB)` },
        { status: 413 }
      );
    }

    const timestamp = Date.now();

    const publicDir = path.join(process.cwd(), "public");
    const uploadsDir = path.join(publicDir, "uploads");
    const tempDir = path.join(process.cwd(), "tmp");
    // Dedicated temp dir for this collection's assets
    const collectionTempDir = path.join(tempDir, `collection-${timestamp}`);

    await mkdir(uploadsDir, { recursive: true });
    await mkdir(tempDir, { recursive: true });
    await mkdir(collectionTempDir, { recursive: true });

    /* -------------------------
       Save Thumbnail → /public
    --------------------------*/

    const thumbExt = thumbnail.name.split(".").pop() || "jpg";
    const thumbName = `${timestamp}-thumb.${thumbExt}`;
    thumbnailPath = path.join(publicDir, thumbName);

    await writeFile(
      thumbnailPath,
      Buffer.from(await thumbnail.arrayBuffer())
    );

    /* -------------------------
       Save All Assets TEMPORARILY
       inside collectionTempDir
    --------------------------*/

    const assetOriginalNames: string[] = [];

    for (let i = 0; i < assetFiles.length; i++) {
      const file = assetFiles[i];
      const ext = file.name.split(".").pop() || "bin";
      // Preserve original filename but prefix with index to avoid collisions
      const safeName = `${String(i + 1).padStart(3, "0")}_${file.name}`;
      const tempFilePath = path.join(collectionTempDir, safeName);

      await writeFile(tempFilePath, Buffer.from(await file.arrayBuffer()));

      assetTempPaths.push(tempFilePath);
      assetOriginalNames.push(safeName);
    }

    /* -------------------------
       Create ZIP
       Structure inside zip:
         collection/
           001_file.fbx
           002_file.png
           ...
           thumbnail.<ext>
    --------------------------*/

    const zipName = `${timestamp}-collection.zip`;
    zipPath = path.join(uploadsDir, zipName);

    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 6 } });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);

    // Add all asset files into a "collection/" directory inside the zip
    for (let i = 0; i < assetTempPaths.length; i++) {
      archive.file(assetTempPaths[i], {
        name: `collection/${assetOriginalNames[i]}`,
      });
    }

    // Also bundle the thumbnail
    archive.file(thumbnailPath, {
      name: `collection/thumbnail.${thumbExt}`,
    });

    await archive.finalize();

    await new Promise<void>((resolve, reject) => {
      output.on("close", resolve);
      output.on("error", reject);
    });

    /* -------------------------
       Cleanup TEMP assets
    --------------------------*/

    for (const p of assetTempPaths) {
      await unlink(p).catch(() => {});
    }
    // Remove temp collection dir (should be empty now)
    await unlink(collectionTempDir).catch(() => {});

    const stats = await stat(zipPath);
    const compressedSizeKb = Math.round(stats.size / 1024);

    /* -------------------------
       Public URLs
    --------------------------*/

    const publicThumbUrl = `/${thumbName}`;
    const publicZipUrl = `/uploads/${zipName}`;

    // assets array stores each original filename as a relative path inside the zip
    const assetsEntries = assetOriginalNames.map(
      (n) => `collection/${n}`
    );

    const newCollection = await CollectionAssetModel.create({
      name,
      description,
      price,
      sellerId: user._id.toString(),
      thumbnailImage: publicThumbUrl,
      assets: assetsEntries,
      size: compressedSizeKb,
    });

    return NextResponse.json({
      success: true,
      collection: {
        _id: newCollection._id,
        name: newCollection.name,
        thumbnailImage: newCollection.thumbnailImage,
        assets: newCollection.assets,
        price: newCollection.price,
        size: newCollection.size,
      },
    });

  } catch (err: unknown) {
    console.error("Collection upload error:", err);

    if (zipPath) {
      await unlink(zipPath).catch(() => {});
    }

    const message =
      err instanceof Error ? err.message : "Unknown server error";

    return NextResponse.json(
      { error: "Upload failed", message },
      { status: STATUS.INTERNAL_SERVER_ERROR }
    );
  };
};