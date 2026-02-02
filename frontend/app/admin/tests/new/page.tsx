"use client";

import { useRouter } from "next/navigation";
import { TestWizard, type TestForm } from "@/components/admin/test-wizard";
import { Topbar } from "@/components/admin/topbar";

export default function NewTestPage() {
  const router = useRouter();

  async function handleSubmit(data: TestForm) {
    const res = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      return;
    }
    router.push("/admin/tests");
  }

  return (
    <div className="flex flex-col gap-8">
      <Topbar
        title="Новый тест"
        subtitle="Пошаговый конструктор с вопросами и баллами"
      />
      <TestWizard submitLabel="Создать тест" onSubmit={handleSubmit} />
    </div>
  );
}
