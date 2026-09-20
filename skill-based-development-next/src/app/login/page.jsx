import Link from "next/link";
import LoginForm from "../components/LoginForm";

export default function loginPage() {


    return (
        <main className="login-page">
            <section className="login-container" aria-labelledby="login-heading">
                <div className="login-intro">
                    <h1 id="login-heading" className="login-heading">Welcome Back</h1>
                    <p className="login-subheading">Please enter your details to access your account.</p>
                </div>

                <div className="login-panel">
                    <LoginForm />

                    <p className="create-account-text">Don't have an account? <Link href="/create-account" className="create-account-link">Create one</Link></p>
                </div>
            </section>
        </main>


    );
}