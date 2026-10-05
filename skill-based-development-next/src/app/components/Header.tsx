// components/Header.tsx
import Image from "next/image";
import Link from "next/link";
import {getSession} from "@/lib/session";
import LogOutButton from "./LogoutButton";

import HeaderDropdowns from "./HeaderDropdowns";

export default async function Header() {
  const isLoggedIn : boolean = await getSession() !== null;
    return (
    <header className="main-header">
      <Link className="website-name" href="/">
        <Image
          className="site-logo"
          src="/content/images/skill-based-development-icon.png"
          alt="Skill Based Development mark"
          width={32}
          height={32}
          priority
        />
        <span>Skill Based Development</span>
      </Link>
      
      <HeaderDropdowns />


      <div className="header-actions">
        {isLoggedIn && <LogOutButton />}
        {isLoggedIn && (
          <Link className="course-library" href="/course-library">Course Library</Link>
        )}
        <Link className="login" href={isLoggedIn ? "/account" : "/login"}>
          {isLoggedIn ? "Account" : "Login"}
        </Link>
      </div>


      
    </header>
  );
}