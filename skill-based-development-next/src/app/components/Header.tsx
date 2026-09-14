// components/Header.tsx
import Link from "next/link";

import HeaderDropdowns from "./HeaderDropdowns";

export default function Header() {
    return (
    <header className="main-header">
      <Link className="website-name" href="/">
        Skill Based Development
      </Link>
      
      <HeaderDropdowns />

      <Link className="login" href="/login">
        Login
      </Link>
    </header>
  );
}