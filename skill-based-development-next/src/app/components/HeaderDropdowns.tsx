"use client";

import { useState } from "react";
import Link from "next/link";

type DropdownName = "courses" | "about" | "more";

export default function HeaderDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null);

  function toggleDropdown(name: DropdownName) {
        setOpenDropdown(openDropdown === name ? null : name);
    }
    function clearDropdown() {
        setOpenDropdown(null);
    }

    return (
        <nav className="header-nav">
      <div className="dropdown">
        <button onClick={() => toggleDropdown("courses")}>
          Courses ▼
        </button>

        {openDropdown === "courses" && (
          <div className="dropdown-content">
            <Link href="/fundamentals" onClick={clearDropdown}>
              Fundamentals
            </Link>
            <Link href="/categories" onClick={clearDropdown}>
              Categories
            </Link>
          </div>
        )}
      </div>

      <div className="dropdown">
        <button onClick={() => toggleDropdown("about")}>
          About Me ▼
        </button>

        {openDropdown === "about" && (
          <div className="dropdown-content">
            <Link href="/lineage" onClick={clearDropdown}>
              Lineage
            </Link>
            <Link href="/goals" onClick={clearDropdown}>
              Goals
            </Link>
          </div>
        )}
      </div>

      <div className="dropdown">
        <button onClick={() => toggleDropdown("more")}>More ▼</button>

        {openDropdown === "more" && (
          <div className="dropdown-content">
            <Link href="/user-guide" onClick={clearDropdown}>User Guide</Link>
            <Link href="/privacy-policy" onClick={clearDropdown}>Privacy Policy</Link>
          </div>
        )}
        </div>
    </nav>
  );
}
