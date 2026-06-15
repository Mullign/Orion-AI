import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "orion-session";

function getSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export function getCredentials() {
  const username = process.env.APP_USERNAME?.trim();
  const password = process.env.APP_PASSWORD?.trim();

  if (!username || !password) {
    throw new Error("APP_USERNAME and APP_PASSWORD must be configured.");
  }

  return { username, password };
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
