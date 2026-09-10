"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";

// --- Lib ---
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const sendContactMessage = async (
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!(await checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000))) {
    return {
      status: "error",
      message: "נשלחו יותר מדי הודעות. נסו שוב מאוחר יותר.",
    };
  }

  // strip CR/LF so form input can't inject extra SMTP headers
  const sanitize = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

  const name = sanitize((formData.get("name") as string | null) ?? "");
  const email = sanitize((formData.get("email") as string | null) ?? "");
  const subject = sanitize((formData.get("subject") as string | null) ?? "");
  const message = ((formData.get("message") as string | null) ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { status: "error", message: "יש למלא את כל השדות." };
  }

  if (name.length > 100 || subject.length > 150 || message.length > 5000) {
    return { status: "error", message: "אחד השדות ארוך מדי." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "כתובת האימייל אינה תקינה." };
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error(
      "Contact form submitted but EMAIL_USER/EMAIL_PASS are not configured",
    );
    return {
      status: "error",
      message: "שליחת ההודעה נכשלה, נסו שוב מאוחר יותר.",
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      type: "OAuth2",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  try {
    await transporter.sendMail({
      from: emailUser,
      to: emailUser,
      replyTo: email,
      subject: `[יצירת קשר] ${subject}`,
      text: `שם: ${name}\nאימייל: ${email}\n\n${message}`,
    });
  } catch (err) {
    console.error("Failed to send contact email", err);
    return {
      status: "error",
      message: "שליחת ההודעה נכשלה, נסו שוב מאוחר יותר.",
    };
  }

  return { status: "success" };
};
