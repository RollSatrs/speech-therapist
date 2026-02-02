import { eq } from "drizzle-orm";
import { Topbar } from "@/components/admin/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  answersTable,
  childrenTable,
  parentsTable,
  questionsTable,
  sessonAnswerTable,
  sessionsTable,
  testsTable,
} from "@/lib/db/schema";
import { getDb } from "@/lib/db/client";

export default async function SessionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const db = getDb();

  const sessionRows = await db
    .select({
      id: sessionsTable.id,
      testName: testsTable.name,
      parentName: parentsTable.fullname,
      childName: childrenTable.fullname,
      createdAt: sessionsTable.createdAt,
      completedAt: sessionsTable.completedAt,
    })
    .from(sessionsTable)
    .leftJoin(parentsTable, eq(parentsTable.id, sessionsTable.parentId))
    .leftJoin(childrenTable, eq(childrenTable.id, sessionsTable.childrenId))
    .leftJoin(testsTable, eq(testsTable.id, sessionsTable.testId))
    .where(eq(sessionsTable.id, id))
    .limit(1);

  const session = sessionRows[0];
  if (!session) {
    return <Topbar title="Сессия не найдена" />;
  }

  const answers = await db
    .select({
      questionRu: questionsTable.textRu,
      questionKz: questionsTable.textKz,
      answerText: sessonAnswerTable.answerText,
      points: answersTable.points,
    })
    .from(sessonAnswerTable)
    .leftJoin(questionsTable, eq(questionsTable.id, sessonAnswerTable.questionId))
    .leftJoin(answersTable, eq(answersTable.id, sessonAnswerTable.answerId))
    .where(eq(sessonAnswerTable.sessonId, id));

  const totalScore = answers.reduce((sum, row) => sum + (row.points ?? 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <Topbar
        title="Детали сессии"
        subtitle={`${session.parentName} → ${session.childName}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Сводка</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-foreground/70 sm:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/50">
              Тест
            </div>
            <div>{session.testName}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/50">
              Баллы
            </div>
            <div>{totalScore}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-foreground/50">
              Статус
            </div>
            <div>{session.completedAt ? "Завершено" : "В процессе"}</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ответы</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Вопрос (RU)</TableHead>
                <TableHead>Ответ</TableHead>
                <TableHead>Баллы</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {answers.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.questionRu}</TableCell>
                  <TableCell>{row.answerText}</TableCell>
                  <TableCell>{row.points ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
