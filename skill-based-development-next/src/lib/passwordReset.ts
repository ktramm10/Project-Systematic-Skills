import "server-only";
import { createHmac, randomInt, randomBytes } from "node:crypto";
import { sendEmail } from "./email";

const secret = process.env.RESET_CODE_SECRET;

if (!secret || secret.length < 32) {
    throw new Error("Configure RESET_CODE_SECRET with at least 32 characters in your environment.");
}

const resetSecret = secret;

export function generateCode() {
    return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function generateResetToken() {
    return randomBytes(32).toString("hex");
}

export function hashResetValue(value: string) {
    return createHmac("sha256", resetSecret).update(value).digest("hex");
}

export async function sendPasswordCode(email: string, code: string) {
    if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
        console.log("[DEV] Password reset code:", code);
        return;
    }

    await sendEmail(email, "Password Reset Code", `Your password reset code is: ${code}`);
}
