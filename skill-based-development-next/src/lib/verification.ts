import "server-only";
import {randomBytes, createHash } from "node:crypto";
import prisma from "@/lib/prisma";

export async function createVerificationToken(userId: number) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.$transaction([
        prisma.emailVerificationToken.deleteMany({
            where: { userId },
        }),
        prisma.emailVerificationToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        }),
    ]);
    return token;
}