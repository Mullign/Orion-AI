import { redirect } from "next/navigation";

import { isAuthConfigured } from "@/lib/auth-store";

import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (!isAuthConfigured()) {
    redirect("/setup");
  }

  return <LoginForm />;
}
