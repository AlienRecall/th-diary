import { NextResponse } from "next/server";
import { getPostOffset } from "@/app/lib/database";

export async function GET(req) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;
  let start, limit;
  if (req.params && "start" in req.params)
    start = req.params.start;
  if (req.params && "limit" in req.params)
    limit = req.params.limit;

  if (!start || !Number(start)) start = 0;
  if (!limit || !Number(limit) || limit > 100 || limit < 10) limit = 30;

  let posts = [];
  try {
    posts = await getPostOffset(user_id, start, limit);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true, posts: posts }, { status: 200 });
}
