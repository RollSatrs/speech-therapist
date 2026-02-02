import { sql } from "drizzle-orm";
import { Topbar } from "@/components/admin/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  answersTable,
  childrenTable,
  parentsTable,
  sessonAnswerTable,
  sessionsTable,
  testsTable,
} from "@/lib/db/schema";
import { getDb } from "@/lib/db/client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

function getLevel(score: number) {
  if (score >= 8) return "Норма";
  if (score >= 5) return "Пограничная зона";
  return "Риск";
}

export default async function ResultsPage() {
  const db = getDb();
  const rows = await db.execute<{
    id: number;
    parentName: string;
    childName: string;
    testName: string;
    completedAt: Date | null;
    score: number;
  }>(
    sql`
      select s.id,
      p.fullname as "parentName",
      c.fullname as "childName",
      t.name as "testName",
      s.completed_at as "completedAt",
      coalesce(sum(a.points), 0)::int as score
      from ${sessionsTable} s
      left join ${parentsTable} p on p.id = s.parent_id
      left join ${childrenTable} c on c.id = s.children_id
      left join ${testsTable} t on t.id = s.test_id
      left join ${sessonAnswerTable} sa on sa.session_id = s.id
      left join ${answersTable} a on a.id = sa.answer_id
      where s.completed_at is not null
      group by s.id, p.fullname, c.fullname, t.name, s.completed_at
      order by s.completed_at desc
    `
  );

  return (
    <div className="flex flex-col gap-8">
      <Topbar
        title="Результаты"
        subtitle="Итоги тестов для связи с родителями"
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Родитель</TableHead>
                <TableHead>Ребёнок</TableHead>
                <TableHead>Тест</TableHead>
                <TableHead>Баллы</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.parentName}</TableCell>
                  <TableCell>{row.childName}</TableCell>
                  <TableCell>{row.testName}</TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>
                    <Badge>{getLevel(row.score)}</Badge>
                  </TableCell>
                  <TableCell className="text-foreground/60">
                    {formatDate(row.completedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
