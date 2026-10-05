import "server-only";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
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