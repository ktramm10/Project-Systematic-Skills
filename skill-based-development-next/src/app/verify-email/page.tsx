"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("[verify-email] effect: token=", token);
    if (!token) {
      setStatus("failed");
      setMessage("Missing verification token.");
      return;
    }

    let canceled = false;
    async function run() {
      setStatus("verifying");
      console.log("[verify-email] fetching api…");
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch("/api/auth/verify-email?token=" + encodeURIComponent(token), {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeout);
        if (canceled) return;
        console.log("[verify-email] api status=", res.status);

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified. You can now log in.");
          console.log("[verify-email] set success");
          return;
        }

        let data: any = {};
        try { data = await res.json(); } catch {}
        if (canceled) return;
        setStatus("failed");
        setMessage(data?.error ?? "Verification failed or link expired.");
        console.log("[verify-email] set failed");
      } catch (e: any) {
        if (canceled) return;
        const aborted = e?.name === "AbortError";
        setStatus("failed");
        setMessage(aborted ? "Verification timed out. Please refresh this page." : "Verification failed. Please try again.");
        console.log("[verify-email] fetch error:", e);
      }
    }
    run();
    return () => {
      canceled = true;
    };
  }, [searchParams]);

  return (
    <main className="verify-email-page">
      <h1>Email Verification</h1>
      {status === "verifying" && <p>Verifying…</p>}
      {status !== "verifying" && <p>{message}</p>}
      <div className="verify-email-actions">
        {status === "success" && (
          <button className="login-submit" onClick={() => { router.push("/login"); }}>Go to Login</button>
        )}
        {status === "failed" && (
          <button className="login-submit" onClick={() => { router.push("/login"); }}>Go to Login</button>
        )}
      </div>
    </main>
  );
}
