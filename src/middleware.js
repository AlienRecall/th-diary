import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/jwt";

export async function middleware(req) {
  const token = req.headers.get("Authorization");

  if (!token || !token.startsWith("Bearer "))
    return NextResponse.json({}, { status: 401 });

  const payload = await verifyToken(token.substr(7));
  if (payload.error) {
    return NextResponse.json(
      {
        expired: payload.error.code === "ERR_JWT_EXPIRED" ? true : false,
      },
      { status: 401 },
    );
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-token-payload", JSON.stringify(payload));
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/user/:path(update|delete|me|picture|remove-picture)", "/api/post/:path*"],
};
