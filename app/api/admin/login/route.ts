import { NextResponse, type NextRequest } from "next/server";
import { loginAdmin } from "@/lib/admin/auth";

/**
 * Plain form POST from /admin/login — no JS required.
 * Success → 303 to /admin; failure → 303 back with ?error=1.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = form.get("password");
  const ok =
    typeof password === "string" && password.length > 0
      ? await loginAdmin(password)
      : false;

  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), {
      status: 303,
    });
  }
  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
