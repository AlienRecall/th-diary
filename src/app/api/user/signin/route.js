import { NextResponse } from "next/server";

export async function POST(req, res) {
  return NextResponse.json({ success: true }, { status: 200 });
}