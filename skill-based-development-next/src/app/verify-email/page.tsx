"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    console.log("[verify-email] effect: token=", token);
    if (!token) return;
    const verificationToken = token;

    let canceled = false;
    async function run() {
      setStatus("verifying");
      console.log("[verify-email] fetching api…");
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch("/api/auth/verify-email?token=" + encodeURIComponent(verificationToken), {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);
        if (canceled) return;
        console.log("[verify-email] api status=", res.status);

        let data: { verified?: boolean; error?: string } = {};
        try {
          data = await res.json();
        } catch {}
        if (canceled) return;

        if (res.ok && data.verified === true) {
          setStatus("success");
          setMessage("Your email has been verified. You can now log in.");
          console.log("[verify-email] set success");
          return;
        }

        setStatus("failed");
        setMessage(data?.error ?? "Verification failed or link expired.");
        console.log("[verify-email] set failed");
      } catch (error) {
        if (canceled) return;
        const aborted = error instanceof Error && error.name === "AbortError";
        setStatus("failed");
        setMessage(aborted ? "Verification timed out. Please refresh this page." : "Verification failed. Please try again.");
        console.log("[verify-email] fetch error:", error);
      }
    }
    run();
    return () => {
      canceled = true;
    };
  }, [token]);

  const displayedStatus = token ? status : "failed";
  const displayedMessage = token ? message : "Missing verification token.";

  return (
    <main className="verify-email-page">
      <h1>Email Verification</h1>
      {displayedStatus === "verifying" && <p>Verifying…</p>}
      {displayedStatus !== "verifying" && <p>{displayedMessage}</p>}
      <div className="verify-email-actions">
        {displayedStatus === "success" && (
          <button className="login-submit" onClick={() => { router.push("/login"); }}>Go to Login</button>
        )}
        {displayedStatus === "failed" && (
          <button className="login-submit" onClick={() => { router.push("/login"); }}>Go to Login</button>
        )}
      </div>
    </main>
  );
}
