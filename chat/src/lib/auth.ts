import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/auth-constants";
import { isAuthConfigured, readRuntimeAuth } from "@/lib/auth-store";

export { isAuthConfigured };

function getSecret() {
  const auth = readRuntimeAuth();
  if (!auth?.authSecret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(auth.authSecret);
}

export function getCredentials() {
  const auth = readRuntimeAuth();
  if (!auth) {
    throw new Error("APP_USERNAME and APP_PASSWORD must be configured.");
  }

  return { username: auth.username, password: auth.password };
}

export function validateCredentials(inputUsername: string, inputPassword: string) {
  const { username, password } = getCredentials();
  return inputUsername === username && inputPassword === password;
}

export async function createSessionToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
}

export async function getSessionUsername() {
  if (!isAuthConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifySessionToken(token);
    return typeof payload.username === "string" ? payload.username : null;
  } catch {
    return null;
  }
}
