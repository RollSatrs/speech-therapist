"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Login failed");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grain min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-foreground/30 px-4 py-2 text-xs uppercase tracking-[0.4em]">
              Admin Access
            </div>
            <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
              Speech Therapist <span className="text-foreground/60">Control</span>{" "}
              Room
            </h1>
            <p className="max-w-xl text-sm text-foreground/70">
              Управляйте тестами, результатами и воронкой клиентов. Чистый
              интерфейс, точные данные, быстрые решения.
            </p>
            <div className="flex items-center gap-4 text-xs text-foreground/60">
              <span>Безопасный вход</span>
              <span>•</span>
              <span>Чёрно-белая эстетика</span>
              <span>•</span>
              <span>Данные в реальном времени</span>
            </div>
          </div>

          <Card className="bg-background/90">
            <CardHeader>
              <CardTitle>Вход администратора</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="admin@center.kz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Пароль</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error ? (
                  <div className="rounded-xl border border-foreground/20 bg-muted px-3 py-2 text-xs text-foreground/70">
                    {error}
                  </div>
                ) : null}
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Входим..." : "Войти"}
                </Button>
                <p className="text-xs text-foreground/50">
                  Первый вход создаст администратора из{" "}
                  <span className="font-mono">ADMIN_EMAIL</span> и{" "}
                  <span className="font-mono">ADMIN_PASSWORD</span>.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
