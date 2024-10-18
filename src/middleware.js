import { NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";

export function middleware(req) {
  const token = req.headers.get("Authorization");

  if (!token || !token.startsWith("Bearer "))
    return NextResponse.json({}, { status: 401 });

  const payload = verifyToken(token.substr(7));
  if (payload.error) return NextResponse.json({}, { status: 401 });

  req.token_payload = payload;
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/user/:path(update|delete)", "/(.*post.*)"],
};
