import { createHash } from "node:crypto";
import prisma from "@/lib/prisma";

async function verifyWithToken(token: string) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return { ok: false, status: 400 as const, body: { error: "Invalid verification token." } };
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  try {
    const verified = await prisma.$transaction(async (tx) => {
      const record = await tx.emailVerificationToken.findUnique({ where: { tokenHash } });
      if (!record || record.expiresAt <= new Date()) return false;

      const claimed = await tx.emailVerificationToken.deleteMany({
        where: { id: record.id, expiresAt: { gt: new Date() } },
      });
      if (claimed.count !== 1) return false;

      await tx.user.update({ where: { id: record.userId }, data: { emailVerified: true } });
      await tx.emailVerificationToken.deleteMany({ where: { userId: record.userId } });
      return true;
    });
    if (!verified) {
      return {
        ok: false,
        status: 400 as const,
        body: { error: "Verification token is invalid or expired." },
      };
    }
    return { ok: true, status: 200 as const, body: { verified: true } };
  } catch {
    return { ok: false, status: 500 as const, body: { error: "Failed to verify email." } };
  }
}

const noStore = { headers: { "Cache-Control": "no-store" } } as const;

export async function POST(request: Request) {
  const { token } = await request.json();
  const result = await verifyWithToken(token);
  return Response.json(result.body, { status: result.status, ...noStore });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const result = await verifyWithToken(token);
  return Response.json(result.body, { status: result.status, ...noStore });
}
