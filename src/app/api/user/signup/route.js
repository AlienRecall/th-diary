import bcrypt from "bcrypt";
import { db } from "@/app/lib/database";
import { createToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const { username, password } = await req.json();

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO Users (username, password) VALUES (?, ?)",
    [username, hash],
    (err) => {
      if (err) {
        console.log(err);
        return NextResponse.json({}, { status: 400 });
      }
    },
  );

  const token = await createToken(username);
  return NextResponse.json(
    { success: true, access_token: token, type: "bearer" },
    { status: 201 },
  );
}
