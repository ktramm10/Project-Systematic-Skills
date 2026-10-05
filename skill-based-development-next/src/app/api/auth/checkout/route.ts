import prisma from "@/lib/prisma";
import {getSession} from "@/lib/session";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function createIntegrationIdentifier() {
    const randomSuffix = Array.from({ length: 8 }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ).join("");

    return `skillbaseddevelop_checkout_${randomSuffix}`;
}

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

        // query db for course
        const body = await request.json();
        const course = await prisma.course.findUnique({
            where: {
                id: Number(body.courseId),
            },
        });

        // ensure the course exists
        if (!course) {
            return Response.json(
                { error: "Course not found."},
                { status: 404}
            );
        }

        // ensure valid info
        if (!Number.isInteger(course.id) || !Number.isInteger(course.priceCents)) {
            return Response.json(
                { error: "A valid course id and course price is required."},
                { status: 400}
            );
        }

        // check to see the user has already bought the instructional
        const isAlreadyPurchased = await prisma.enrollment.findFirst({
            where: {
                userId: Number(session.userId),
                courseId: course.id,
            },
        });

        if (isAlreadyPurchased) {
            return Response.json(
                { error: "You have already purchased this course."},
                { status: 409}
            );
        }

        // create stripe session for payment processing
        const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

        if (!origin) {
            return Response.json(
                { error: "Unable to determine checkout return URL." },
                { status: 500 },
            );
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            client_reference_id: `${session.userId}:${course.id}`,
            customer_email: typeof session.email === "string" ? session.email : undefined,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: course.name,
                            description: course.description,
                        },
                        unit_amount: course.priceCents,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: String(session.userId),
                courseId: String(course.id),
            },
            success_url: `${origin}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/courses/${course.slug}?checkout=cancelled`,
            integration_identifier: createIntegrationIdentifier(),
        });

        if (!checkoutSession.url) {
            return Response.json(
                { error: "Unable to create checkout session." },
                { status: 500 },
            );
        }

        return Response.json(
            {
                url: checkoutSession.url,
            },
            { status: 201},
        );
    } catch (error) {
        console.error("Payment error:", error);
        return Response.json(
            { error: "Unable to complete purchase."},
            { status: 500}
        );
    }
}