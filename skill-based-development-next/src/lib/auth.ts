import "server-only";
import {redirect} from "next/navigation";
import {getSession} from "./session";

export async function verifySession() {
    const session = await getSession();
    if (!session?.userId) {
        redirect("/login");
    }
    return {
        userId: Number(session.userId),
    };
}