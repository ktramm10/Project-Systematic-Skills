"use client";
import {useState} from "react";
import type { Course } from "@/types/course";

export default function PurchaseButton({ course, }: { course: Course }) {
    const [error, setError] = useState("");
    async function  handlePurchase() {
        setError("");

        const response = await fetch("/api/auth/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                courseId: course.id,
            }),
        });

        if (!response.ok) {
            const body = await response.json();
            setError(body.error ?? "Unable to complete purchase.");
            return;
        }

        const body = await response.json();

        if (!body.url) {
            setError("Unable to start checkout.");
            return;
        }

        window.location.assign(body.url);
    }

    return (
        <>
            <button
                className="purchase-button"
                onClick={handlePurchase}
            >
                Purchase
            </button>
            {error && <p className="purchase-error" role="alert">{error}</p>}
        </>
    );
}
