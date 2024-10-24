import { NextResponse } from "next/server";
import { getUserById, deleteUser } from "@/app/lib/database";

export async function POST(req) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;

  try {
    let user = await getUserById(user_id);
    if (user.image)
      await unlink(path.join(process.cwd(), "public/uploads/" + user.image));
    await deleteUser(user_id);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "there was an error while deleting user" },
      { status: 500 },
    );
  }

  return NextResponse.redirect(new URL("/signup", req.url), 303);
}
