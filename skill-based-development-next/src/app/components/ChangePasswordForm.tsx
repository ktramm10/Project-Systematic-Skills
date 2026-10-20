"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type Step = "request-code" | "verify-code" | "set-password" | "complete";

type ApiResponse = {
  error?: string;
  message?: string;
};

async function postJson(url: string, body?: Record<string, string>): Promise<{ ok: boolean; data: ApiResponse }> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let data: ApiResponse = {};
  try {
    data = await response.json();
  } catch {
    if (response.ok) {
      throw new Error("The server returned an unreadable response.");
    }
  }
  return { ok: response.ok, data };
}

export default function ChangePasswordForm() {
  const [step, setStep] = useState<Step>("request-code");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequestCode() {
    setError("");
    setStatus("");
    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/request");
      if (!ok) {
        setError(data.error ?? "Unable to send a password reset code.");
        return;
      }
      setStep("verify-code");
      setStatus("A verification code was sent to the email address on your account.");
    } catch (requestError) {
      console.error(requestError);
      setError(requestError instanceof Error ? requestError.message : "Unable to send a password reset code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/password/verify", { code });
      if (!ok) {
        setError(data.error ?? "That code is invalid or expired.");
        return;
      }
      setStep("set-password");
      setStatus("Code verified. Choose a new password.");
    } catch (requestError) {
      console.error(requestError);
      setError(requestError instanceof Error ? requestError.message : "Unable to verify the code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/password/reset", { password, confirmPassword });
      if (!ok) {
        setError(data.error ?? "Unable to change your password. Request a new code and try again.");
        return;
      }
      setStep("complete");
      setStatus("Your password has been changed. Please log in again with your new password.");
    } catch (requestError) {
      console.error(requestError);
      setError(requestError instanceof Error ? requestError.message : "Unable to change your password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "complete") {
    return (
      <div className="change-password-complete" role="status">
        <p>{status}</p>
        <Link className="edit-user-submit" href="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="change-password-form">
      {step === "request-code" && (
        <div className="change-password-step">
          <p>We’ll email a one-time code to the email address on your account.</p>
          <button className="edit-user-submit" type="button" onClick={handleRequestCode} disabled={isSubmitting}>
            {isSubmitting ? "Sending code..." : "Send verification code"}
          </button>
        </div>
      )}

      {step === "verify-code" && (
        <form className="change-password-step" onSubmit={handleVerifyCode}>
          <div className="change-password-field">
            <label htmlFor="password-reset-code">Verification code</label>
            <input
              id="password-reset-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              aria-describedby="password-reset-code-help"
              required
            />
            <small id="password-reset-code-help">Enter the 6-digit code from your email.</small>
          </div>
          <button className="edit-user-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify code"}
          </button>
          <button className="change-password-secondary-button" type="button" onClick={handleRequestCode} disabled={isSubmitting}>
            Send a new code
          </button>
        </form>
      )}

      {step === "set-password" && (
        <form className="change-password-step" onSubmit={handleSetPassword}>
          <div className="change-password-field">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              name="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <small>Password must be at least 8 characters.</small>
          </div>
          <div className="change-password-field">
            <label htmlFor="confirm-new-password">Confirm new password</label>
            <input
              id="confirm-new-password"
              name="confirm-new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          <button className="edit-user-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Changing password..." : "Change password"}
          </button>
        </form>
      )}

      {error && <p className="edit-user-error" role="alert">{error}</p>}
      {status && <p className="change-password-status" role="status">{status}</p>}
    </div>
  );
}
