import { Topbar } from "@/components/admin/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDailyParents, getSummary } from "@/lib/metrics";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Sparkline({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 200;
      const y = 40 - (d.count / max) * 40;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 200 40" className="h-10 w-full">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range = searchParams.range === "30d" ? "30d" : "7d";
  const summary = await getSummary(range);
  const chart = await getDailyParents(range);

  const rangeLabel = range === "30d" ? "Последние 30 дней" : "Последние 7 дней";

  return (
    <div className="flex flex-col gap-8">
      <Topbar
        title="Панель управления"
        subtitle="Метрики и состояние бота в реальном времени"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Badge>{rangeLabel}</Badge>
        <Button
          asChild
          variant={range === "7d" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/admin?range=7d">7 дней</Link>
        </Button>
        <Button
          asChild
          variant={range === "30d" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/admin?range=30d">30 дней</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Новые пользователи</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-3xl font-semibold">{summary.newParents}</div>
            <div className="text-xs text-foreground/60">
              За выбранный период
            </div>
            <Sparkline data={chart} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Всего родителей</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-3xl font-semibold">{summary.totalParents}</div>
            <div className="text-xs text-foreground/60">
              Уникальные пользователи бота
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/60">
              <div className="rounded-lg border border-foreground/10 p-3">
                Лиды
              </div>
              <div className="rounded-lg border border-foreground/10 p-3">
                Повторные
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Завершённые тесты</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-3xl font-semibold">
              {summary.completedSessions}
            </div>
            <div className="text-xs text-foreground/60">
              Количество завершённых сессий
            </div>
            <div className="text-xs text-foreground/50">
              Сигнал для менеджера: связаться с родителями по результатам.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
