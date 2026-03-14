import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import UserModel from "@/db/models/user.model";
import { STATUS } from "@/constants/http";
import TransactionModel from "@/db/models/transaction.model";

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

    const trans = await TransactionModel.find({ sellerId: user._id.toString() })
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      name: user.name || "User",
      trans: trans,
    },{
      status: STATUS.OK
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: STATUS.INTERNAL_SERVER_ERROR });
  };
};