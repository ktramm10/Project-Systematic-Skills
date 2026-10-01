import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status === "unpaid") {
    return;
  }

  const userId = Number(session.metadata?.userId);
  const courseId = Number(session.metadata?.courseId);

  if (!Number.isInteger(userId) || !Number.isInteger(courseId)) {
    throw new Error("Checkout session is missing valid fulfillment metadata.");
  }

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
  });

  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      paymentId: session.id,
    },
  });

  if (existingPurchase) {
    return;
  }

  await prisma.purchase.create({
    data: {
      userId,
      courseId,
      amount: session.amount_total ?? 0,
      status: "COMPLETED",
      paymentId: session.id,
    },
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return Response.json(
      { error: "Invalid Stripe webhook signature" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfillCheckoutSession(event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        console.warn("Stripe checkout async payment failed:", event.data.object.id);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook fulfillment failed:", error);
    return Response.json(
      { error: "Webhook fulfillment failed" },
      { status: 500 },
    );
  }

  return Response.json({ received: true });
}