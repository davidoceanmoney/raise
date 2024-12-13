import { getAccessToken, isWhitelisted } from "@/lib/sheet";
import {  NextRequest, NextResponse } from "next/server";


export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
try {
  const { address } = params;

  const data = await isWhitelisted({address})
    return NextResponse.json({
      data
    },{status:200})
} catch (error) {

  return NextResponse.json({
    data:false
  },{status:500})
}
}