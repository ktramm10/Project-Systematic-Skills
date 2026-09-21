"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      setIsLoggingOut(false);
      return;
    }

    router.push("/login");
    router.refresh();
    }

    return (
    <button className="logout" type="button" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
    );
}