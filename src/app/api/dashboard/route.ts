import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import AssetModel from "@/db/models/asset.model";
import UserModel from "@/db/models/user.model";
import TransactionModel from "@/db/models/transaction.model";
import { STATUS } from "@/constants/http";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not logged in" }, { status: STATUS.UNAUTHORIZED });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: STATUS.NOT_FOUND });
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
    return NextResponse.json({ error: "Server error" }, { status: STATUS.INTERNAL_SERVER_ERROR });
  };
};