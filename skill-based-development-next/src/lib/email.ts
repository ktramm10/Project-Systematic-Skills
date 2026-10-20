import "server-only";
import { Resend } from "resend";

export async function sendEmail(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured.");
    }

    const from = process.env.EMAIL_FROM;
    if (!from) {
        throw new Error("EMAIL_FROM is not configured.");
    }

    const resend = new Resend(apiKey);
    const {data, error} = await resend.emails.send({
        from,
        to,
        subject,
        html,
    });
    if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
    return data;
}