import { NextResponse } from "next/server";
import { deletePost } from "@/app/lib/database";

export async function POST(req, res) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;
  const { id } = await req.json();

  if (!id)
    return NextResponse.json(
      { success: false, error: "unexpected error" },
      { status: 400 },
    );

  try {
    await deletePost(id, user_id);
  } catch (err) {
    console.log(err);
    if (err === "unauthorized")
      return NextResponse.json({ success: false, error: "not allowed" }, { status: 401 });
    return NextResponse.json(
      { success: false, error: "there was an error while deleting post" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(new URL("/home?erased=true", req.url), 303);
}
