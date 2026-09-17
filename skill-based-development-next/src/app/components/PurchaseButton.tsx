"use client";

import type { Course } from "@/types/course";

export default function PurchaseButton({ course, }: { course: Course }) {
    function handlePurchase() {
        // Implement purchase logic here
        console.log(course.id);
    }

    return (
        <button
            className="purchase-button"
            onClick={handlePurchase}
        >
            Purchase
        </button>
    );
}
