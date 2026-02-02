"use client";

import { useRouter } from "next/navigation";
import { TestWizard, type TestForm } from "@/components/admin/test-wizard";

export default function TestEditClient({
  testId,
  initial,
}: {
  testId: number;
  initial: TestForm;
}) {
  const router = useRouter();

  async function handleSubmit(data: TestForm) {
    const res = await fetch(`/api/tests/${testId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      return;
    }
    router.push("/admin/tests");
  }

  return <TestWizard submitLabel="Сохранить изменения" onSubmit={handleSubmit} initial={initial} />;
}
