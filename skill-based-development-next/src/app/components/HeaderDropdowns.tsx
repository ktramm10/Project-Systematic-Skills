"use client";

import { useState } from "react";
import Link from "next/link";

type DropdownName = "courses" | "about";

export default function HeaderDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<DropdownName | null>(null);

  function toggleDropdown(name: DropdownName) {
        setOpenDropdown(openDropdown === name ? null : name);
    }

    return (
        <nav className="header-nav">
      <div className="dropdown">
        <button onClick={() => toggleDropdown("courses")}>
          Courses ▼
        </button>

        {openDropdown === "courses" && (
          <div className="dropdown-content">
            <Link href="/courses/fundamentals">Fundamentals</Link>
            <Link href="/courses/categories">Categories</Link>
          </div>
        )}
      </div>

      <div className="dropdown">
        <button onClick={() => toggleDropdown("about")}>
          About Me ▼
        </button>

        {openDropdown === "about" && (
          <div className="dropdown-content">
            <Link href="/about/lineage">Lineage</Link>
            <Link href="/goals">Goals</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
