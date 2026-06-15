import Image from "next/image";
import Link from "next/link";

import { GitHubIcon } from "@/components/icons/BrandIcons";
import { GITHUB_URL } from "@/lib/links";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#reviews", label: "Reviews" },
  { href: "#preview", label: "Preview" },
  { href: "#story", label: "How it started" },
  { href: "#get-started", label: "Get started" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/orion-logo.jpg"
            alt="Orion"
            width={32}
            height={32}
            className="invert"
          />
          <span className="text-sm font-semibold tracking-[0.2em] text-foreground">
            Orion
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden rounded-full px-3 py-2 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground sm:inline-block"
            >
              {link.label}
            </a>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-foreground"
          >
            <GitHubIcon size={18} />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
