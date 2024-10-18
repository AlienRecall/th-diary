import { NextResponse } from "next/server";

export async function POST(req, res) {
  console.log(req.token_payload.sub);
}
