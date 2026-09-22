import prisma from "@/lib/prisma";
import {verifySession} from "@/lib/auth";
export async function POST(request: Request) {
    const session = await verifySession();
    try {
        const body = await request.json();
        const {firstName, lastName, email} = body;
        if (!firstName || !lastName || !email) {
            return Response.json(
                { error: "First name, last name, and email address are required."},
                { status: 400}
            );
        }
        if (typeof email !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string") {
            return Response.json(
                {error: "Invalid user information."},
                {status: 400}
            );
        }

        const cleanedEmail = email.trim().toLowerCase();
        const cleanedFirstName = firstName.trim();
        const cleanedLastName = lastName.trim();

        const existingUser = await prisma.user.findFirst({
            where: {
                email: cleanedEmail,
            NOT: {
                id: session.userId,
            },
        },
        });

        if (existingUser) {
            return Response.json(
                { error: "An account with that email already exists."},
                { status: 409}
            );
        }

        const user = await prisma.user.update({
            where: {
                id: session.userId,
            },
            data: {
                firstName: cleanedFirstName,
                lastName: cleanedLastName,
                email: cleanedEmail,
            },
        });

        return Response.json(
            {
                message: "User information sucessfully changed.",
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
        console.error("Account information error:", error);
        return Response.json(
            {error: "Unable to modify user information."},
            {status: 500}
        );
    }
}