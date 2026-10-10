import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTransactionalEmail } from "@/lib/email/send";
import { getRequestIp, checkRateLimit } from "@/lib/security/rate-limit";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

const orderSchema = z.object({
  website: z.string().max(0).optional(),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().regex(/^[+\d][\d\s().-]{5,30}$/),
    email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
    address: z.string().trim().max(500).optional()
  }),
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().nullable().optional(),
    quantity: z.number().int().min(1).max(50)
  })).min(1).max(30)
});

export async function POST(request: Request) {
  const rate = checkRateLimit(`order:${getRequestIp(request)}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Please wait a moment before trying again." }, {
      status: 429,
      headers: { "Retry-After": String(rate.retryAfter) }
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Order details could not be read." }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Check the customer details and cart items." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ error: "Unable to submit this request." }, { status: 400 });

  try {
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.rpc("submit_order", {
      p_name: parsed.data.customer.name,
      p_phone: parsed.data.customer.phone,
      p_email: parsed.data.customer.email || null,
      p_address: parsed.data.customer.address || null,
      p_items: parsed.data.items.map(({ productId, variantId, quantity }) => ({
        productId,
        variantId: variantId ?? null,
        quantity
      }))
    });
    if (error) {
      console.error("Order persistence failed:", error.message);
      return NextResponse.json({ error: "We couldn't save this order. Please try again or contact us on WhatsApp." }, { status: 503 });
    }

    const order = data as { ref: string; total: number; items: { name: string; unitPrice: number; quantity: number }[] };
    const lines = order.items.map((item) => `${item.quantity} × ${item.name} — GH₵${Number(item.unitPrice).toFixed(2)}`).join("\n");
    const total = `GH₵${Number(order.total).toFixed(2)}`;
    const customerEmail = parsed.data.customer.email;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const messages = [
      ...(adminEmail ? [{
        to: adminEmail,
        subject: `New Joyest order ${order.ref}`,
        text: `New order ${order.ref}\n${parsed.data.customer.name}\n${parsed.data.customer.phone}\n${lines}\nTotal: ${total}`,
        html: `<h1>New order ${order.ref}</h1><p>${escapeHtml(parsed.data.customer.name)} · ${escapeHtml(parsed.data.customer.phone)}</p><pre>${escapeHtml(lines)}</pre><strong>Total: ${total}</strong>`
      }] : []),
      ...(customerEmail ? [{
        to: customerEmail,
        subject: `We received your Joyest order ${order.ref}`,
        text: `Thank you for your order request.\nReference: ${order.ref}\n${lines}\nTotal: ${total}\nWe will confirm availability and delivery details with you.`,
        html: `<h1>Thank you</h1><p>We received order <strong>${order.ref}</strong>.</p><pre>${escapeHtml(lines)}</pre><strong>Total: ${total}</strong><p>We will confirm availability and delivery details with you.</p>`
      }] : [])
    ];
    for (const message of messages) {
      try {
        await sendTransactionalEmail(message);
      } catch (emailError) {
        console.error("Order email could not be delivered:", emailError);
      }
    }

    const whatsappNumber = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "");
    const whatsappMessage = encodeURIComponent(`Hello, I submitted order ${order.ref}.\n${lines}\nTotal: ${total}`);
    const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : null;
    return NextResponse.json({ ref: order.ref, total: Number(order.total), whatsappUrl }, { status: 201 });
  } catch (error) {
    console.error("Order submission failed:", error);
    return NextResponse.json({ error: "Order submission is not configured yet." }, { status: 503 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character] ?? character);
}
