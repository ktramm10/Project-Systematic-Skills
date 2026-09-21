import {verifySession} from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function AccountPage() {
    const session = await verifySession();
    const user = await prisma.user.findUnique({
        where: {
            id: session.userId,
        },
        select: {
            firstName: true,
            lastName: true,
            email: true,
        },
    });
    if (!user) {
        return <p>User not Found.</p>
    }

    return (
        <main>
            <h1 className="account-heading">Welcome, {user.firstName}</h1>
            <p className="account-text">{user.email}</p>
        </main>
    );
}