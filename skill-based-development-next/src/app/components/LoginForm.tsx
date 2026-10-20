"use client";
import {useRouter} from "next/navigation";
import {SubmitEvent, useState } from "react";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [needsVerification, setNeedsVerification] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMsg, setResendMsg] = useState<string | null>(null);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setResendMsg(null);
        setNeedsVerification(false);
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            });

            if (response.status === 403) {
                const data = await response.json().catch(() => ({}));
                setNeedsVerification(true);
                setError(data.error ?? "Please verify your email before logging in.");
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                setError(data.error ?? "Invalid email or password.");
                return;
            }

            router.push("/account");
            router.refresh();

        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }

    }

    async function handleResend() {
        setIsResending(true);
        setResendMsg(null);
        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setResendMsg(data.error ?? "Unable to resend verification email.");
                return;
            }
            setResendMsg("Verification email sent. Please check your inbox.");
        } catch (e) {
            console.error(e);
            setResendMsg("Unable to resend verification email.");
        } finally {
            setIsResending(false);
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </div>

            <div className="login-field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
            </div>

            {error && (
                <div className="login-error" role="alert">
                    <p>{error}</p>
                    {needsVerification && (
                        <div className="login-resend">
                            <button className="resend-button" type="button" onClick={handleResend} disabled={isResending || !email}>
                                {isResending ? "Resending..." : "Resend verification email"}
                            </button>
                            {resendMsg && <p className="login-resend-msg">{resendMsg}</p>}
                        </div>
                    )}
                </div>
            )}

            <button className="login-submit" type="submit" disabled={isLoading}>{isLoading ? "Logging in..." : "Log In"}</button>
        </form>
    );
};