
import Link from "next/link";
import CreateAccountForm from "../components/CreateAccountForm.tsx";

export default function createAccountPage() {
    return (
        <main className="create-account-page">
            <section className="create-account-container" aria-labelledby="create-account-heading">
                <div className="create-account-intro">
                    <p className="create-account-eyebrow">Start learning today</p>
                    <h1 id="create-account-heading" className="create-account-heading">Create your account</h1>
                    <p className="create-account-subheading">Build your profile and keep your course progress, purchases, and training goals in one place.</p>
                </div>

                <div className="create-account-panel">
                    <CreateAccountForm />
                    <p className="create-account-text">Already have an account? <Link href="/login" className="create-account-link">Log in</Link></p>
                </div>
            </section>
        </main>
    );
}