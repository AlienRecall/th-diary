import { setImageUser } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import crypto from "crypto";
import path from "path";

export async function POST(req) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json(
      { success: false, error: "No files received." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const filename =
    crypto.createHash("md5").update(user_id.toString()).digest("hex") + ext;
  try {
    await writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer);
    await setImageUser(user_id, filename);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        error: "there was an error while processing your request, please retry.",
      },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true }, { status: 200 });
}
