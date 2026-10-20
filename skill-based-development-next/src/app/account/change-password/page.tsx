import Link from "next/link";
import { verifySession } from "@/lib/auth";
import ChangePasswordForm from "../../components/ChangePasswordForm";

export default async function ChangePasswordPage() {
  await verifySession();

  return (
    <main className="edit-user-page">
      <section className="edit-user-shell" aria-labelledby="change-password-heading">
        <div className="edit-user-intro">
          <h1 id="change-password-heading" className="account-heading">Change Password</h1>
          <p className="account-summary">Verify your account with a code sent to your email, then choose a new password.</p>
        </div>

        <div className="edit-user-panel">
          <ChangePasswordForm />
          <Link className="change-password-back-link" href="/account">Back to account</Link>
        </div>
      </section>
    </main>
  );
}
