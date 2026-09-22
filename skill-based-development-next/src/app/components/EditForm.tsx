"use client";
import {SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

type EditFormProps = {
    prevEmail: string;
    prevFirstName: string | null;
    prevLastName: string | null;
};

export default function EditForm({prevEmail, prevFirstName, prevLastName} : EditFormProps) {


    const router = useRouter();
    const [email, setEmail] = useState(prevEmail);
    const [firstName, setFirstName] = useState(prevFirstName ?? "");
    const [lastName, setLastName] = useState(prevLastName ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/edit-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, firstName, lastName}),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error ?? "Unable to update user information.");
                return;
            }
            router.push("/account");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="user-edit-form" onSubmit={handleSubmit}>
            <div className="user-edit-field">
                <label htmlFor="first-name">First Name</label>
                <input id="first-name" name="first-name" type="text" value={firstName} onChange={(event)=> setFirstName(event.target.value)} placeholder={String(prevFirstName)} autoComplete="given-name" required />
            </div>
            <div className="user-edit-field">
                <label htmlFor="last-name">Last Name</label>
                <input id="last-name" name="last-name" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder={String(prevLastName)} autoComplete="family-name" required />
            </div>
            <div className="user-edit-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={email} onChange={(event)=> setEmail(event.target.value)} placeholder={prevEmail} autoComplete="email" required />
            </div>

            {error && (
                <p className="edit-user-error" role="alert">{error}</p>
            )}

            <button className="edit-user-submit" type="submit" disabled={isLoading}>{isLoading? "Saving Changes..." : "Save Changes"}</button>
        </form>


    );
}