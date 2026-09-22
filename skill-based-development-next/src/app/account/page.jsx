import {verifySession} from "@/lib/auth";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AccountPage() {
    const session = await verifySession();
    const [user, purchases] = await Promise.all([
        prisma.user.findUnique({
            where: {
                id: session.userId,
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
            },
        }),
        prisma.purchase.findMany({
            where: {
                userId: session.userId,
            },
            select: {
                id: true,
                amount: true,
                status: true,
                purchaseAt: true,
                course: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                purchaseAt: "desc",
            },
        }),
    ]);

    if (!user) {
        return <p>User not found.</p>
    }

    const displayName = user.firstName || user.email;

    return (
        <main className="account-page">
            <section className="account-shell" aria-labelledby="account-heading">
                <div className="account-hero">
                    <h1 id="account-heading" className="account-heading">Welcome, {displayName}</h1>
                    <p className="account-summary">Manage your profile details and review your course purchases.</p>
                </div>

                <div className="account-grid">
                    <section className="account-panel" aria-labelledby="account-user-information-heading">
                        <h2 id="account-user-information-heading" className="account-sub-heading">User Information</h2>
                        <div className="account-user-information-container">
                            <p className="account-user-information-text"><span>First Name</span>{user.firstName || "Not provided"}</p>
                            <p className="account-user-information-text"><span>Last Name</span>{user.lastName || "Not provided"}</p>
                            <p className="account-user-information-text"><span>Email Address</span>{user.email}</p>
                            <Link className="account-user-details-edit-button" href="/account/edit-user-details">Edit User Information</Link>
                        </div>
                    </section>

                    <section className="account-panel account-purchase-panel" aria-labelledby="account-purchase-history-heading">
                        <h2 id="account-purchase-history-heading" className="account-sub-heading">Purchase History</h2>
                        <div className="account-purchase-history-container">
                            {purchases.length > 0 ? (
                                purchases.map((purchase) => (
                                    <article key={purchase.id} className="account-purchase-card">
                                        <div>
                                            <h3>{purchase.course.name}</h3>
                                            <p>{purchase.purchaseAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                                        </div>
                                        <div className="account-purchase-meta">
                                            <span className={`account-purchase-status account-purchase-status-${purchase.status.toLowerCase()}`}>{purchase.status.toLowerCase()}</span>
                                            <strong>${Number(purchase.amount).toFixed(2)}</strong>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="account-empty-state">No purchases yet. Your completed course orders will appear here.</p>
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}