import { NextResponse, type NextRequest } from "next/server";
import { logoutAdmin } from "@/lib/admin/auth";

/** Plain form POST — clears the session cookie and returns to login. */
export async function POST(request: NextRequest) {
  await logoutAdmin();
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}
