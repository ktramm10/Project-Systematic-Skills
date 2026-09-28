import prisma from "@/lib/prisma";
import {getSession} from "@/lib/session";


export async function POST(request: Request) {
    try {
        const session = await getSession();

        // ensure the user is logged into an account
        if (!session?.userId) {
            return Response.json(
                { error: "No valid user session detected."},
                { status: 401},
            );
        }

        const body = await request.json();
        const courseId = Number(body.courseId);
        const priceCents = Number(body.priceCents);


        if (!Number.isInteger(courseId) || !Number.isInteger(priceCents)) {
            return Response.json(
                { error: "A valid course id and course price is required."},
                { status: 400}
            );
        }

        // check to see the user has already bought the instructional
        const isAlreadyPurchased = await prisma.enrollment.findFirst({
            where: {
                userId: Number(session.userId),
                courseId: courseId,
            },
        });

        if (isAlreadyPurchased) {
            return Response.json(
                { error: "You have already purchased this course."},
                { status: 409}
            );
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: Number(session.userId),
                courseId: courseId,
            },
        });

        const purchase = await prisma.purchase.create({
            data: {
                userId: Number(session.userId),
                courseId: courseId,
                status: "COMPLETED",
                amount: priceCents,
            },
        });

        return Response.json(
            {
                message: "Course purchased successfully.",
                enrollment,
                purchase,
            },
            { status: 201}
        );
    } catch (error) {
        console.error("Payment error:", error);
        return Response.json(
            { error: "Unable to complete purchase."},
            { status: 500}
        );
    }
}