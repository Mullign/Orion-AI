import Image from "next/image";

import { ChatWorkspace } from "@/components/app/ChatWorkspace";
import { MulliganCredit } from "@/components/MulliganCredit";
import { SpaceBackground } from "@/components/SpaceBackground";
import { getSessionUsername } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function ChatHomePage() {
  const username = await getSessionUsername();

  return (
    <>
      <SpaceBackground />
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Image
                src="/orion-logo.jpg"
                alt="Orion"
                width={28}
                height={28}
                className="invert"
              />
              <div>
                <span className="block text-xs font-semibold tracking-[0.25em] text-foreground">
                  ORION
                </span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-muted">
                  Chat workspace
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {username ? (
                <span className="hidden text-xs text-muted sm:inline">
                  Signed in as {username}
                </span>
              ) : null}
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col px-4 py-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
            <ChatWorkspace />
          </div>
        </main>

        <footer className="border-t border-border px-4 py-3 sm:px-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <MulliganCredit compact />
            <p className="text-xs text-muted">Private local AI workspace</p>
          </div>
        </footer>
      </div>
    </>
  );
}
