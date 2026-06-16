import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth-constants";

const publicPaths = [
  "/setup",
  "/login",
  "/api/auth/setup",
  "/api/auth/login",
  "/api/auth/logout",
];

function getSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    return null;
  }

  return new TextEncoder().encode(secret);
}

function isConfigured() {
  return Boolean(process.env.APP_USERNAME?.trim() && process.env.APP_PASSWORD?.trim());
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    publicPaths.some((path) => pathname === path) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".jpg")
  ) {
    return NextResponse.next();
  }

  if (!isConfigured()) {
    return NextResponse.redirect(new URL("/setup", request.url));
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = getSecret();

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
