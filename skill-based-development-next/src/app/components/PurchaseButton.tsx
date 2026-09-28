"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import type { Course } from "@/types/course";

export default function PurchaseButton({ course, }: { course: Course }) {
    const router = useRouter();
    const [error, setError] = useState("");
    async function  handlePurchase() {
        setError("");

        const response = await fetch("/api/auth/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                courseId: course.id,
                priceCents: course.priceCents,
            }),
        });

        if (!response.ok) {
            const body = await response.json();
            setError(body.error ?? "Unable to complete purchase.");
            return;
        }
        router.push("/account");
        console.log("Course purchased successfully.");
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
