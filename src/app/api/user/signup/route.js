import bcrypt from "bcrypt";
import { registerUser } from "@/app/lib/database";
import { isEmailValid } from "@/app/lib/utils";
import { createToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";

const formValidate = (form) => {
  if (!form) return "empty form";
  const { email, username, password } = form;
  if (!email || !isEmailValid(email)) return "invalid email";
  if (!username || username.length > 64)
    return "invalid username (length should be max 64 chars).";
  if (!password || password.length < 8 || password.length > 128)
    return "invalid password (length should be min 8 and 128 chars max).";
  return "";
};

export async function POST(req) {
  const form = await req.json();
  const reason = formValidate(form);
  if (reason !== "") {
    return NextResponse.json({ success: false, error: reason }, { status: 400 });
  }

  const { email, username, password } = form;
  const hash = await bcrypt.hash(password, 10);

  let user_id;
  try {
    user_id = await registerUser(email, username, hash);
  } catch (err) {
    let msg = err;
    switch (err.errno) {
      case 19:
        msg = "an account with the same email/username already exist";
        break;
      default:
        msg = "internal error, please retry or contact us";
        break;
    }
    return NextResponse.json(
      { success: false, error: msg },
      { status: err.errno === 19 ? 400 : 500 },
    );
  }

  const { token, expires } = await createToken(user_id, username);
  return NextResponse.json(
    { success: true, token: token, expires: expires },
    { status: 201 },
  );
}
