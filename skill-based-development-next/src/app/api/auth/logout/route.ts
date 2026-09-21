import {killSession} from "@/lib/session";

export async function POST() {
    try {
        await killSession();

        return Response.json(
            {message: "Logout successful."},
            {status: 200}
        );
    } catch (error) {
        console.error("Logout error:", error);
        return Response.json(
            {error: "Unable to log out."},
            {status: 500}
        );
    }
}