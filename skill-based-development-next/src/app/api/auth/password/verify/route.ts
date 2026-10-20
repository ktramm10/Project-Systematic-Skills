import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import {hashResetValue, generateResetToken} from "@/lib/passwordReset";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
    const session = await getSession();

    if (!session?.userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const code = body.code;

    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
        return Response.json({ error: "Invalid code format" }, { status: 400 });
    }

    const reset = await prisma.passwordReset.findFirst({
        where: {
            userId: Number(session.userId),
            verifiedAt: null,
        },
        orderBy: { createdAt: "desc" },
    });

    if (!reset || reset.expiresAt < new Date() || reset.attempts >= 5) {
        return Response.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    const submittedHash = Buffer.from(hashResetValue(code), "hex");
    const storedHash = Buffer.from(reset.codeHash, "hex");
    const valid = timingSafeEqual(submittedHash, storedHash);

    if (!valid) {
        await prisma.passwordReset.updateMany({
            where: {
                id: reset.id,
                verifiedAt: null,
                attempts: { lt: 5 },
            },
            data: { attempts: { increment: 1 } },
        });
        return Response.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    const token = generateResetToken();
    const result = await prisma.passwordReset.updateMany({
        where: {
            id: reset.id,
            codeHash: reset.codeHash,
            verifiedAt: null,
            attempts: { lt: 5 },
            expiresAt: { gt: new Date() },
        },
        data: {
            codeHash: hashResetValue(token),
            verifiedAt: new Date(),
        },
    });

    if (result.count !== 1) {
        return Response.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    const cookieStore = cookies();
    (await cookieStore).set("password_reset", `${reset.id}.${token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/password/reset",
        maxAge: 5 * 60,
    });

    return Response.json({ message: "Code verified" }, { status: 200 });
}