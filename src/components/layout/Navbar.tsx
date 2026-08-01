"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/listing", label: "Unit Tersedia" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Hubungi Kami" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-td-surface-bright shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-2xl font-heading font-bold text-td-primary"
          >
            Teridox Property
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-td-primary border-b-2 border-td-primary pb-1 font-bold"
                    : "text-td-on-secondary-container hover:text-td-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="bg-td-primary text-td-on-primary px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase hover:bg-td-primary-container transition-all active:opacity-80"
          >
            Masuk
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <MaterialIcon name={mobileOpen ? "close" : "menu"} className="text-td-primary text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-td-surface-container-lowest border-t border-td-outline-variant px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-td-primary-fixed text-td-primary font-bold"
                  : "text-td-on-surface-variant hover:bg-td-surface-container-high"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
