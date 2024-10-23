import { NextResponse } from "next/server";
import { getPost } from "@/app/lib/database";

export async function GET(req, { params: { id } }) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;

  let posts;
  try {
    posts = await getPost(id, user_id);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, posts: [posts] }, { status: 200 });
}
