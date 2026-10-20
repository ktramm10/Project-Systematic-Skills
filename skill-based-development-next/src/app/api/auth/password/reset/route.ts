import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import  argon2  from "argon2";
import { hashResetValue } from "@/lib/passwordReset";
import { getSession, killSession } from "@/lib/session";
import {sendEmail} from "@/lib/email";

export async function POST(request: Request) {
    const session = await getSession();

    if (!session?.userId) {
        return Response.json({ error: "Unauthorized User"}, { status: 401 });
    }

    const cookieStore = await cookies();
    const resetCookie = cookieStore.get("password_reset")?.value;

    if (!resetCookie) {
        return Response.json({ error: "Missing password reset token" }, { status: 403 });
    }

    const [resetId, token] = resetCookie.split(".");

    if (!resetId || !/^[0-9a-fA-F]{64}$/.test(token ?? "")) {
        return Response.json({ error: "Invalid password reset session" }, { status: 400 });
    }

    const {password, confirmPassword} = await request.json();

    if (typeof password !== "string" || typeof confirmPassword !== "string" || password.length < 8 || password !== confirmPassword) {
        return Response.json({ error: "Invalid password format" }, { status: 400 });
    }

    const hashedPassword = await argon2.hash(password);

    try {
        await prisma.$transaction(async (tx) => {
            const claimed = await tx.passwordReset.deleteMany({
                where: {
                    id: resetId,
                    userId: Number(session.userId),
                    codeHash: hashResetValue(token),
                    verifiedAt: {not: null},
                    expiresAt: {gt: new Date()},
                },
            });

            if (claimed.count !== 1) {
                throw new Error("Invalid or expired password reset session");
            }

            await tx.user.update({
                where: {
                    id: Number(session.userId),
                },
                data: {
                    passwordHash: hashedPassword,
                },
            });
        });
    } catch {
        return Response.json({ error: "Invalid or expired password reset session" }, {status : 400});
    }
    cookieStore.delete("password_reset");
    const email = await prisma.user.findUnique({
        where: { id: Number(session.userId) },
        select: { email: true },
    });
    if (email?.email) await sendEmail(email?.email, "Password Changed", "Your password has been changed successfully. If you did not initiate this change, please contact support immediately.");
    killSession();
    return Response.json({ message: "Password updated successfully" }, { status: 200 });
    
}

