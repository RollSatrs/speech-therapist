import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/session";

export async function requireAdminApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return validateAdminSession(token);
}
