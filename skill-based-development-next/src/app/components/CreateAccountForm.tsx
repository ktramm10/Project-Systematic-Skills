"use client";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

export default function CreateAccountForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [created, setCreated] = useState(false);
    const [resendMsg, setResendMsg] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setResendMsg(null);
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, firstName, lastName, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error ?? "Unable to create account.");
                return;
            }
            // Show verification notice instead of redirecting
            setCreated(true);
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
            const data = await res.json().catch(() => ({}));
            if (data?.devVerificationUrl) {
                setResendMsg(`Verification email sent. Dev URL: ${data.devVerificationUrl}`);
            } else {
                setResendMsg("Verification email sent. Please check your inbox.");
            }
        } catch (e) {
            console.error(e);
            setResendMsg("Unable to resend verification email.");
        } finally {
            setIsResending(false);
        }
    }

    if (created) {
        return (
            <div className="account-create-success" role="status">
                <h2>Account created!</h2>
                <p>
                    We sent a verification link to <strong>{email}</strong>. Please verify your email to log in.
                </p>
                <div className="account-create-actions">
                    <button className="account-create-submit" type="button" onClick={handleResend} disabled={isResending}>
                        {isResending ? "Resending..." : "Resend verification email"}
                    </button>
                    <button className="login-submit" type="button" onClick={() => router.push("/login")}>Go to Login</button>
                </div>
                {resendMsg && <p className="account-create-resend-msg">{resendMsg}</p>}
            </div>
        );
    }

    return (
        <form className="account-create-form" onSubmit={handleSubmit}>
            <div className="account-create-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </div>
            <div className="account-create-field">
                <label htmlFor="first-name">First Name</label>
                <input id="first-name" name="first-name" type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="First name" autoComplete="given-name" required />
            </div>
            <div className="account-create-field">
                <label htmlFor="last-name">Last Name</label>
                <input id="last-name" name="last-name" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Last name" autoComplete="family-name" required />
            </div>
            <div className="account-create-field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" autoComplete="new-password" minLength={8} required />
                <small>Password must be at least 8 characters.</small>
            </div>
            <div className="account-create-field">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input id="confirm-password" name="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" autoComplete="new-password" minLength={8} required />
            </div>

            {error && (
                <p className="account-create-error" role="alert">{error}</p>
            )}

            <button className="account-create-submit" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
            </button>
        </form>
    );
}