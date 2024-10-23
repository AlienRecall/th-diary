import { NextResponse } from "next/server";
import { getUserByUsername } from "@/app/lib/database";
import { createToken } from "@/app/lib/jwt";
import bcrypt from "bcrypt";

const formValidate = (form) => {
  if (!form) return "empty form";
  const { username, password } = form;
  if (!username || username.length > 128) return "invalid username";
  if (!password || password.length > 128) return "invalid password";
  return "";
};

export async function POST(req) {
  const form = await req.json();
  const reason = formValidate(form);
  if (reason !== "") {
    return NextResponse.json({ success: false, error: reason }, { status: 400 });
  }

  let user;
  const { username, password } = form;
  try {
    user = await getUserByUsername(username);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "user not found" },
      { status: 404 },
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json(
      { success: false, error: "wrong password." },
      { status: 401 },
    );
  }

  const { token, expires } = await createToken(user.id, user.username);
  return NextResponse.json(
    { success: true, token: token, expires: expires },
    { status: 201 },
  );
}
