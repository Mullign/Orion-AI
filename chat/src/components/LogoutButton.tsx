"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
    >
      Sign out
    </button>
  );
}
