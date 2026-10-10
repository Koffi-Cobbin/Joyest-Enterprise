import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getRequestIp } from "@/lib/security/rate-limit";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email/send";

const inquirySchema = z.object({
  website: z.string().max(0).optional(),
  name: z.string().trim().min(2).max(100),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  phone: z.string().trim().max(32).optional(),
  message: z.string().trim().min(10).max(3000)
});

export async function POST(request: Request) {
  const rate = checkRateLimit(`inquiry:${getRequestIp(request)}`, 5, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Please wait before sending another message." }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Message details could not be read." }, { status: 400 });
  }
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Check the form and try again." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ error: "Unable to send this message." }, { status: 400 });

  try {
    const { error } = await getAdminSupabaseClient().from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message
    });
    if (error) throw error;

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (adminEmail) {
      try {
        await sendTransactionalEmail({
          to: adminEmail,
          subject: `New website inquiry from ${parsed.data.name}`,
          text: `${parsed.data.name}\n${parsed.data.email || parsed.data.phone || "No reply details"}\n\n${parsed.data.message}`,
          html: `<h1>New inquiry</h1><p>${escapeHtml(parsed.data.name)} · ${escapeHtml(parsed.data.email || parsed.data.phone || "No reply details")}</p><p>${escapeHtml(parsed.data.message)}</p>`
        });
      } catch (emailError) {
        console.error("Inquiry email could not be delivered:", emailError);
      }
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Inquiry persistence failed:", error);
    return NextResponse.json({ error: "We couldn't save your message. Please try again later." }, { status: 503 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character] ?? character);
}
