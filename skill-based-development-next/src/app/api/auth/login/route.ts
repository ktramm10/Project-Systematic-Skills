import prisma from "@/lib/prisma"
import argon2 from "argon2"
import {createSession} from "@/lib/session";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {email, password} = body;

        if (!email || !password) {
            return Response.json(
                { error: "Email and password are required."},
                { status: 400}
            );
        }
        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return Response.json(
                { error: "Invalid login information."},
                { status: 400}
            );
        }

        const cleanedEmail = email.trim().toLowerCase();
        const user = await prisma.user.findUnique({
            where: {
                email: cleanedEmail,
            },
        });

        if (!user) {
            return Response.json(
            { error: "Invalid email or password."},
            { status: 401}
            );
        }

        const passwordIsValid = await argon2.verify(user.passwordHash, password);
        if (!passwordIsValid) {
            return Response.json(
                { error: "Invalid email or password."},
                { status: 401}
            );
        }

        await createSession(user.id);

        return Response.json(
            {
                message: "Login successful.",
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            },
            { status: 200}
        );
    } catch (error) {
        console.error("Login error:", error);
        return Response.json(
            { error: "Unable to log in."},
            { status: 500}
        );
    }

}