// components/Header.tsx
import Link from "next/link";
import {getSession} from "@/lib/session";
import LogOutButton from "./LogoutButton";

import HeaderDropdowns from "./HeaderDropdowns";

export default async function Header() {
  const isLoggedIn : boolean = await getSession() !== null;
    return (
    <header className="main-header">
      <Link className="website-name" href="/">
        Skill Based Development
      </Link>
      
      <HeaderDropdowns />


      <div className="header-actions">
        {isLoggedIn && <LogOutButton />}
        <Link className="login" href={isLoggedIn ? "/account" : "/login"}>
          {isLoggedIn ? "Account" : "Login"}
        </Link>
      </div>
      
    </header>
  );
}