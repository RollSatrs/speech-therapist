import { Topbar } from "@/components/admin/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDb } from "@/lib/db/client";
import { childrenTable, parentsTable } from "@/lib/db/schema";
import { formatDate } from "@/lib/format";

export default async function ParentsPage() {
  const db = getDb();
  const parents = await db.select().from(parentsTable).orderBy(parentsTable.createdAt);
  const children = await db.select().from(childrenTable);

  const childrenByParent = new Map<number, typeof children>();
  for (const child of children) {
    const list = childrenByParent.get(child.parentId) ?? [];
    list.push(child);
    childrenByParent.set(child.parentId, list);
  }

  return (
    <div className="flex flex-col gap-8">
      <Topbar
        title="Родители и дети"
        subtitle="Просмотр пользователей бота и привязанных детей"
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Родитель</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Дети</TableHead>
                <TableHead>Создан</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell>{parent.fullname}</TableCell>
                  <TableCell>{parent.phone}</TableCell>
                  <TableCell className="text-foreground/70">
                    {(childrenByParent.get(parent.id) ?? [])
                      .map((child) => child.fullname)
                      .join(", ") || "—"}
                  </TableCell>
                  <TableCell className="text-foreground/60">
                    {formatDate(parent.createdAt)}
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
