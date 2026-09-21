"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignOutButton } from "@/components/sign-out-button";

const baseLinks = [
  { href: "/", label: "Library" },
  { href: "/new", label: "New piece" },
  { href: "/topics", label: "Topics" },
];

function NavLinks({
  onNavigate,
  isAdmin,
}: {
  onNavigate?: () => void;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const links = isAdmin
    ? [...baseLinks, { href: "/admin", label: "Admin" }]
    : baseLinks;
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function NavShell({
  children,
  userEmail,
  isAdmin,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
  isAdmin?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 md:hidden">
        <span className="text-lg font-bold tracking-tight">Content Studio</span>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </header>

      {mobileOpen && (
        <div className="space-y-3 border-b border-neutral-200 px-4 py-3 md:hidden">
          <NavLinks onNavigate={() => setMobileOpen(false)} isAdmin={isAdmin} />
          {userEmail && (
            <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm text-neutral-500">
              <span className="truncate">{userEmail}</span>
              <SignOutButton />
            </div>
          )}
        </div>
      )}

      <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-200 px-4 py-6 md:flex">
        <div className="mb-6 text-lg font-bold tracking-tight">Content Studio</div>
        <NavLinks isAdmin={isAdmin} />
        {userEmail && (
          <div className="mt-auto space-y-2 border-t border-neutral-200 pt-4">
            <p className="truncate text-xs text-neutral-500">{userEmail}</p>
            <SignOutButton />
          </div>
        )}
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
