import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/auth-constants";
import { verifySessionToken } from "@/lib/auth";

export async function requireSessionUsername(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = await verifySessionToken(token);
  const username = payload.username;

  if (typeof username !== "string" || !username.trim()) {
    throw new Error("Unauthorized");
  }

  return username;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
