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
    
    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        
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
                // need a specific response based on the error that occurred
                setError(data.error ?? "Unable to create account.");
                return;
            }
            router.push("/login");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
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