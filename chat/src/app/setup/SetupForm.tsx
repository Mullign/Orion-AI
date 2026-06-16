"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SpaceBackground } from "@/components/SpaceBackground";

export function SetupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("orion");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SpaceBackground />
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/90 p-8 backdrop-blur-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src="/orion-logo.jpg"
              alt="Orion"
              width={72}
              height={72}
              className="mb-4 invert"
            />
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
              Orion Setup
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Choose the username and password for this workspace.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");

              if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
              }

              setLoading(true);

              const response = await fetch("/api/auth/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
              });

              setLoading(false);

              if (!response.ok) {
                const data = (await response.json()) as { error?: string };
                setError(data.error ?? "Setup failed.");
                return;
              }

              router.push("/");
              router.refresh();
            }}
          >
            <label className="block text-sm">
              <span className="text-muted">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 text-foreground outline-none focus:border-accent/50"
                autoComplete="username"
                minLength={3}
                maxLength={32}
                pattern="[A-Za-z0-9_-]+"
                required
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 text-foreground outline-none focus:border-accent/50"
                autoComplete="new-password"
                minLength={5}
                required
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background/50 px-3 py-2.5 text-foreground outline-none focus:border-accent/50"
                autoComplete="new-password"
                minLength={5}
                required
              />
            </label>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Finish setup"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
