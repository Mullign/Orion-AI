import { NextResponse } from "next/server";

import {
  createSessionToken,
  isAuthConfigured,
} from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { saveRuntimeAuth } from "@/lib/auth-store";

function validateUsername(username: string) {
  if (username.length < 3 || username.length > 32) {
    return "Username must be 3–32 characters.";
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "Username may only contain letters, numbers, underscores, and hyphens.";
  }

  return null;
}

function validatePassword(password: string) {
  if (password.length < 5) {
    return "Password must be at least 5 characters.";
  }

  return null;
}

export async function POST(req: Request) {
  if (isAuthConfigured()) {
    return NextResponse.json(
      { error: "Orion is already configured." },
      { status: 403 },
    );
  }

  try {
    const { username, password } = (await req.json()) as {
      username?: string;
      password?: string;
    };

    const trimmedUsername = username?.trim() ?? "";
    const trimmedPassword = password ?? "";

    if (!trimmedUsername || !trimmedPassword) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    const usernameError = validateUsername(trimmedUsername);
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    const passwordError = validatePassword(trimmedPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    saveRuntimeAuth(trimmedUsername, trimmedPassword);
    const token = await createSessionToken(trimmedUsername);
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Setup failed.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
