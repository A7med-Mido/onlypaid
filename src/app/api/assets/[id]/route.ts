import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import path from "path";
import UserModel from "@/db/models/user.model";
import AssetModel from "@/db/models/asset.model";
import TransactionModel from "@/db/models/transaction.model";
import { STATUS } from "@/constants/http";

export const dynamic = "force-dynamic";

type Params = { params: { assetId: string } };

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    /* --------------------------------
       1. Auth check
    -------------------------------- */
    const session: Session | null = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: STATUS.UNAUTHORIZED }
      );
    }

    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing assetId" },
        { status: 400 }
      );
    }

    /* --------------------------------
       2. Resolve the buyer in DB
    -------------------------------- */
    const user = await UserModel.findOne({
      email: session.user.email,
    }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: STATUS.UNAUTHORIZED }
      );
    }

    const buyerId = user._id.toString();

    /* --------------------------------
       3. Verify ownership
       Strategy: check EITHER
         a) Transaction exists for (buyerId, assetId)  — purchase record
         b) assetId is in user.ownedAssets             — direct grant / free asset
    -------------------------------- */
    // const [transaction, isInOwnedAssets] = await Promise.all([
    //   TransactionModel.findOne({ buyerId, assetId }).lean(),
    //   Promise.resolve(user.ownedAssets?.includes(assetId) ?? false),
    // ]);

    // if (!transaction && !isInOwnedAssets) {
    //   return NextResponse.json(
    //     { error: "Access denied. You have not purchased this asset." },
    //     { status: STATUS.FORBIDDEN ?? 403 }
    //   );
    // }

    /* --------------------------------
       4. Fetch asset record
    -------------------------------- */
    const asset = await AssetModel.findById(id).lean();

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    /* --------------------------------
       5. Resolve the file path
       asset.asset is stored as a public URL like "/uploads/12345-bundle.zip"
       We map it back to the filesystem.
    -------------------------------- */
    const relativePath = asset.asset.startsWith("/")
      ? asset.asset.slice(1)
      : asset.asset;

    const filePath = path.join(process.cwd(), "public", relativePath);

    if (!existsSync(filePath)) {
      console.error("File not found on disk:", filePath);
      return NextResponse.json(
        { error: "Asset file not found on server" },
        { status: 404 }
      );
    }

    const fileStat = await stat(filePath);
    const fileName = path.basename(filePath);

    /* --------------------------------
       6. Stream the file
       Using Node.js ReadStream → Web ReadableStream
       so the whole file is never loaded into memory.
    -------------------------------- */
    const nodeStream = createReadStream(filePath);

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on("data", (chunk) => {
          controller.enqueue(
            chunk instanceof Buffer ? chunk : Buffer.from(chunk)
          );
        });
        nodeStream.on("end", () => controller.close());
        nodeStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(fileStat.size),
        // Prevent proxies / CDNs from caching download responses
        "Cache-Control": "no-store",
      },
    });

  } catch (err: unknown) {
    console.error("Download error:", err);
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json(
      { error: "Download failed", message },
      { status: STATUS.INTERNAL_SERVER_ERROR }
    );
  };
};