import { NextResponse } from "next/server";
import { createPost } from "@/app/lib/database";

export async function POST(req, res) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;
  const { title, data } = await req.json();

  let post_id;
  try {
    post_id = await createPost(user_id, title, data);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "there was an error while processing your request" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(new URL(`/home`, req.url), 303);
}
