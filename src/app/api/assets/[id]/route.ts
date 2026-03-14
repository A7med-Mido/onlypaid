import { STATUS } from "@/constants/http";
import { NextResponse } from "next/server";





export async function GET () {
  try {
    return NextResponse.json({
      message: "success",
      success: true
    },{
      status: STATUS.OK
    })
  } catch(error) {
    return NextResponse.json({
      error,
      success: false
    },{
      status: STATUS.INTERNAL_SERVER_ERROR
    });
  };
};