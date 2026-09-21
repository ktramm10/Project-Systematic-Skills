"use client";
import {SubmitEvent, useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {0
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setError("Invalid email or password.");
                return;
            }
            window.location.href = "/account";

        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
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

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-submit" type="submit" disabled={isLoading}>{isLoading ? "Logging in..." : "Log In"}</button>
        </form>
    );
};