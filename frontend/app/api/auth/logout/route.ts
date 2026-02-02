import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeAdminSession } from "@/lib/session";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (token) {
    await revokeAdminSession(token);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
