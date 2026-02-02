import { requireAdmin } from "@/lib/require-admin";
import { Sidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="grain min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-[240px_1fr] gap-8 px-6 py-8">
        <Sidebar />
        <main className="rounded-3xl border border-foreground/10 bg-background/70 p-8 shadow-xl backdrop-blur">
          {children}
        </main>
      </div>
    </div>
  );
}
