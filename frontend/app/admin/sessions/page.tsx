import Link from "next/link";
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
import { Button } from "@/components/ui/button";

export default async function SessionsPage() {
  const db = getDb();
  const rows = await db.execute<{
    id: number;
    parentName: string;
    childName: string;
    testName: string;
    createdAt: Date;
    completedAt: Date | null;
    score: number;
  }>(
    sql`
      select s.id,
      p.fullname as "parentName",
      c.fullname as "childName",
      t.name as "testName",
      s.created_at as "createdAt",
      s.completed_at as "completedAt",
      coalesce(sum(a.points), 0)::int as score
      from ${sessionsTable} s
      left join ${parentsTable} p on p.id = s.parent_id
      left join ${childrenTable} c on c.id = s.children_id
      left join ${testsTable} t on t.id = s.test_id
      left join ${sessonAnswerTable} sa on sa.session_id = s.id
      left join ${answersTable} a on a.id = sa.answer_id
      group by s.id, p.fullname, c.fullname, t.name
      order by s.created_at desc
    `
  );

  return (
    <div className="flex flex-col gap-8">
      <Topbar
        title="Сессии"
        subtitle="Кто, когда и как проходил тесты"
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
                <TableHead />
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
                    {row.completedAt ? "Завершено" : "В процессе"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" asChild>
                      <Link href={`/admin/sessions/${row.id}`}>
                        Детали
                      </Link>
                    </Button>
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
