import crypto from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "./db/client";
import { adminSessionsTable, adminsTable } from "./db/schema";

const SESSION_DAYS = 7;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createAdminSession(adminId: number) {
  const db = getDb();
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(adminSessionsTable).values({
    adminId,
    tokenHash,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function validateAdminSession(token: string) {
  const db = getDb();
  const tokenHash = hashToken(token);
  const sessions = await db
    .select()
    .from(adminSessionsTable)
    .where(eq(adminSessionsTable.tokenHash, tokenHash))
    .limit(1);

  const session = sessions[0];
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const admins = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, session.adminId))
    .limit(1);

  return admins[0] ?? null;
}

export async function revokeAdminSession(token: string) {
  const db = getDb();
  const tokenHash = hashToken(token);
  await db
    .delete(adminSessionsTable)
    .where(eq(adminSessionsTable.tokenHash, tokenHash));
}
