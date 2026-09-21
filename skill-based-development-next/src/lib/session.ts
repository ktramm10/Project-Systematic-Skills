import "server-only";
import {cookies} from "next/headers";
import {SignJWT, jwtVerify} from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: number) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    const token = await new SignJWT({userId}).setProtectedHeader({alg: "HS256"})
    .setIssuedAt().setExpirationTime("7d").sign(secret);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return null;
    }

    try {
        const {payload} = await jwtVerify(
            token,
            secret
        );
        return payload;
    } catch {
        return null;
    }
}

export async function killSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}