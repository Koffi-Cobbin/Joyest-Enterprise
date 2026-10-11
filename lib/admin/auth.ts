import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_NAME,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/admin/session";

/** Constant-time password compare (lengths must match to avoid timing leak). */
export function passwordMatches(expected: string, attempt: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(attempt, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (!passwordMatches(expected, password)) return false;
  const token = await createSessionToken();
  (await cookies()).set(COOKIE_NAME, token, sessionCookieOptions);
  return true;
}

export async function logoutAdmin(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

/**
 * Defense-in-depth gate for server actions and admin data components.
 * proxy.ts already blocks unauthenticated page requests; every mutation
 * and panel still calls this so a directly-invoked action can't slip through.
 */
export async function requireAdmin(): Promise<void> {
  const { verifySessionToken } = await import("@/lib/admin/session");
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) redirect("/admin/login");
}
