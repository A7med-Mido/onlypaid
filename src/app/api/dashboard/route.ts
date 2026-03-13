import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import AssetModel from "@/db/models/asset.model";
import UserModel from "@/db/models/user.model";
import TransactionModel from "@/db/models/transaction.model";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const myListings = await AssetModel.find({ sellerId: user._id.toString() })
      .sort({ createdAt: -1 });

    const trans = await TransactionModel.find({
      sellerId: user._id.toString()
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      name: user.name || "User",
      listings: myListings,
      trans: trans
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  };
};