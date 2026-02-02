import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAdminSession } from "./session";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) {
    redirect("/login");
  }
  const admin = await validateAdminSession(token);
  if (!admin) {
    redirect("/login");
  }
  return admin;
}
