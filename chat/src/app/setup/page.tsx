import { redirect } from "next/navigation";

import { isAuthConfigured } from "@/lib/auth-store";

import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  if (isAuthConfigured()) {
    redirect("/login");
  }

  return <SetupForm />;
}
