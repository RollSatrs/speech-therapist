import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { adminsTable } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createAdminSession } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const db = getDb();
  const existingAdmins = await db.select().from(adminsTable).limit(1);

  if (!existingAdmins.length) {
    const defaultEmail = "admin@example.com";
    const defaultPassword = "12345678";
    const envEmail = process.env.ADMIN_EMAIL ?? defaultEmail;
    const envPassword = process.env.ADMIN_PASSWORD ?? defaultPassword;
    if (email !== envEmail || password !== envPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const passwordHash = await hashPassword(password);
    const [created] = await db
      .insert(adminsTable)
      .values({ email, passwordHash })
      .returning({ id: adminsTable.id });
    const session = await createAdminSession(created.id);
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  }

  const admins = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.email, email))
    .limit(1);
  const admin = admins[0];
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await db
    .update(adminsTable)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminsTable.id, admin.id));

  const session = await createAdminSession(admin.id);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
