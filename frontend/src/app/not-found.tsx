"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      Page not found please go{" "}
      <Link href={"/"} className="text-[var(--primary)]">
        Home
      </Link>
    </div>
  );
}
