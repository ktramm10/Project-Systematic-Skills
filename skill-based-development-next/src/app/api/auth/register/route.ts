import prisma from "@/lib/prisma";
import argon2 from "argon2";
import { createVerificationToken } from "@/lib/verification";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {firstName, lastName, email, password} = body;
    

    if (!firstName || !lastName || !email || !password) {
        return Response.json(
            {error: "All account fields are required."},
            {status: 400}
        );
    }
    if (
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return Response.json(
            {error: "Invalid account information."},
            {status: 400}
        );
    }

    const cleanedFirstName = firstName.trim();
    const cleanedLastName = lastName.trim();
    const cleanedEmail = email.trim().toLowerCase();

    if (cleanedFirstName.length === 0 || cleanedLastName.length === 0) {
        return Response.json(
            { error: "First and Last name are required."},
            {status: 400}
        );
    }

    if (password.length < 8) {
        return Response.json(
            { error: "Password must be at least 8 characters."},
            { status: 400}
        );
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: cleanedEmail,
        },
    });
    if (existingUser) {
        return Response.json(
            { error: "An account with that email already exists."},
            { status: 409}
        );
    }

    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({
        data: {
            firstName: cleanedFirstName,
            lastName: cleanedLastName,
            email: cleanedEmail,
            passwordHash: passwordHash,
        },
    });

    const token = await createVerificationToken(user.id);

    const verificationUrl = new URL(
    "/verify-email",
    process.env.NEXT_PUBLIC_APP_URL!
    );

    verificationUrl.searchParams.set("token", token);

    await sendEmail(
        user.email,
        "Verify your Skill Based Development account",
        `
        <h2>Welcome to Skill Based Development!</h2>

        <p>
            Please verify your email address to
            finish setting up your account.
        </p>

        <a href="${verificationUrl.toString()}">
            Verify Email Address
        </a>

        <p>This link expires in 24 hours.</p>

        <p>
            If you didn't create this account,
            you can ignore this email.
        </p>
    `
    );


    return Response.json(
        {
            message: "Account created successfully.",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        },
        {status: 201}
    );
    } catch (error) {
        console.error("Account creation failed:", error);
        return Response.json(
            { error: "Unable to create account."},
            { status: 500}
        );
    }
} 