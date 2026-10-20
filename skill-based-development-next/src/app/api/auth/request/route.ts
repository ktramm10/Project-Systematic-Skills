import prisma from "@/lib/prisma";
import {generateCode, hashResetValue, sendPasswordCode} from "@/lib/passwordReset";

import {getSession} from "@/lib/session";

export async function POST() {
    const session = await getSession();

    if (!session?.userId) {
        return new Response("Unauthorized", {status: 401});
    }

    const user = await prisma.user.findUnique({
        where: { id : Number(session.userId) },
        select: {
            id: true,
            email: true,
        },
    });

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    // ensure that we at some point at rate limiting per user or per ip address to prevent abuse of this endpoint. ie allow 1 code every 10 seconds or something

    const code = generateCode();
    await prisma.$transaction(async (tx) => {
        await tx.passwordReset.deleteMany({
            where: {userId: user.id},
        });
        await tx.passwordReset.create({
            data: {
                userId: user.id,
                codeHash: hashResetValue(code),
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
    });

    try {
        await sendPasswordCode(user.email, code);
    } catch (error) {
        console.error("Failed to send password reset code:", error);
        return Response.json({ error: "Failed to send password reset code" }, { status: 503 });
    }

    return Response.json({ message: "Password reset code sent" }, { status: 200 });
}