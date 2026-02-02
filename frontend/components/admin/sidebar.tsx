import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/tests", label: "Тесты" },
  { href: "/admin/parents", label: "Родители" },
  { href: "/admin/sessions", label: "Сессии" },
  { href: "/admin/results", label: "Результаты" },
];

export function Sidebar() {
  return (
    <aside className="flex h-full flex-col gap-8 border-r border-foreground/10 bg-background/80 px-6 py-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-foreground/60">
          Admin Console
        </span>
        <h2 className="text-lg font-semibold">Speech Screening</h2>
        <Badge className="w-fit">Live Database</Badge>
      </div>
      <nav className="flex flex-1 flex-col gap-3 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-transparent px-4 py-3 transition hover:border-foreground/20 hover:bg-foreground/5"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="text-xs text-foreground/50">
        Данные бота синхронизируются напрямую с БД.
      </div>
    </aside>
  );
}
