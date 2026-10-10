import "server-only";
import { ReplitConnectors } from "@replit/connectors-sdk";

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendTransactionalEmail(message: EmailMessage) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) return { sent: false as const, reason: "RESEND_FROM_EMAIL is not configured." };

  const connectors = new ReplitConnectors();
  const response = await connectors.proxy("resend", "/emails", {
    method: "POST",
    body: {
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html
    }
  });
  if (!response.ok) {
    const responseText = await response.text();
    console.error("Resend delivery failed:", response.status, responseText);
    return { sent: false as const, reason: "Resend did not accept the email." };
  }
  return { sent: true as const };
}
