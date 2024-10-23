import { NextResponse } from "next/server";
import { getUserById, resetImage } from "@/app/lib/database";
import { unlink } from 'fs/promises';
import path from "path";

export async function POST(req) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;

  try {
    let user = await getUserById(user_id);
    if (user.image) {
      await unlink(path.join(process.cwd(), "public/uploads/" + user.image));
      await resetImage(user_id);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "there was an error while deleting user image" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
