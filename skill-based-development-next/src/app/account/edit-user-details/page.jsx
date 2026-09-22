import {verifySession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import EditForm from "../../components/EditForm";

export default async function EditUserDetailsPage() {
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
        return <p>User not Found</p>;
    }

    return (
        <main className="edit-user-page">
            <section className="edit-user-shell" aria-labelledby="edit-user-heading">
                <div className="edit-user-intro">
                    <h1 id="edit-user-heading" className="account-heading">Edit User Details</h1>
                    <p className="account-summary">Update the profile information connected to your account.</p>
                </div>

                <div className="edit-user-panel">
                    <EditForm
                        prevEmail={user.email}
                        prevFirstName={user.firstName}
                        prevLastName={user.lastName}
                    />
                </div>
            </section>
        </main>
    );
    
}