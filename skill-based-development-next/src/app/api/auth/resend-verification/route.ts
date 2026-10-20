import prisma from "@/lib/prisma";
import { createVerificationToken } from "@/lib/verification";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (typeof email !== "string") {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const cleanedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanedEmail } });

    // Do not leak whether a user exists
    if (!user) return Response.json({ ok: true });

    if (user.emailVerified) return Response.json({ ok: true });

    const token = await createVerificationToken(user.id);
    const url = new URL("/verify-email", process.env.NEXT_PUBLIC_APP_URL!);
    url.searchParams.set("token", token);

    await sendEmail(
      user.email,
      "Verify your Skill Based Development account",
      `<p>Click to verify your email:</p><p><a href="${url.toString()}">Verify Email</a></p>`
    );

    return Response.json({ ok: true });
  } catch (e) {
    console.error("Resend verification error:", e);
    return Response.json({ error: "Unable to resend verification." }, { status: 500 });
  }
}
