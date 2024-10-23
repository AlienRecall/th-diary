import { NextResponse } from "next/server";
import { getUserById } from "@/app/lib/database";

export async function GET(req, res) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;

  let user;
  try {
    user = await getUserById(user_id);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "user not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_url: user.image,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    },
    { status: 200 },
  );
}
