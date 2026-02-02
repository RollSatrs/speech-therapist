import Link from "next/link";
import { sql } from "drizzle-orm";
import { Topbar } from "@/components/admin/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDb } from "@/lib/db/client";
import { questionsTable, testsTable } from "@/lib/db/schema";

export default async function TestsPage() {
  const db = getDb();
  const rows = await db.execute<{
    id: number;
    name: string;
    ageFrom: number;
    ageTo: number;
    questionCount: number;
  }>(
    sql`
      select t.id, t.name, t.age_from as "ageFrom", t.age_to as "ageTo",
      count(q.id)::int as "questionCount"
      from ${testsTable} t
      left join ${questionsTable} q on q.text_id = t.id
      group by t.id
      order by t.created_at desc
    `
  );

  return (
    <div className="flex flex-col gap-8">
      <Topbar
        title="Тесты"
        subtitle="Создавайте и редактируйте модули скрининга"
      />
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/tests/new">+ Новый тест</Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Возраст</TableHead>
                <TableHead>Вопросов</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-foreground/60">{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {row.ageFrom}–{row.ageTo}
                  </TableCell>
                  <TableCell>{row.questionCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" asChild>
                      <Link href={`/admin/tests/${row.id}`}>Редактировать</Link>
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
