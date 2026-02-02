"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-between border-b border-foreground/10 pb-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-foreground/60">{subtitle}</p>
        ) : null}
      </div>
      <Button variant="outline" onClick={logout}>
        Выйти
      </Button>
    </div>
  );
}
