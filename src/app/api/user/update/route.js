import { updateUser } from "@/app/lib/database";
import { NextResponse } from "next/server";

const formValidate = (form) => {
  if (!form) return "empty form";
  const { first_name, last_name } = form;
  if (!first_name) return "empty first_name";
  if (!last_name) return "empty last_name";
  return "";
};

export async function POST(req) {
  const token_payload = JSON.parse(req.headers.get("x-token-payload"));
  const user_id = token_payload?.id;

  const form = await req.json();
  const reason = formValidate(form);
  if (reason !== "") {
    return NextResponse.json({ success: false, error: reason }, { status: 400 });
  }

  const { first_name, last_name } = form;
  try {
    await updateUser(user_id, first_name, last_name);
  } catch (err) {
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
