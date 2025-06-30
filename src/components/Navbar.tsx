"use client";

import { useTheme } from "next-themes"; // pastikan kamu sudah install next-themes
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true); // menghindari hydration mismatch
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Why Us", href: "#why" },
    { label: "Bikes", href: "#fleet" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  const logoSrc =
    !isMounted || theme === "light" ? "/logo_dark.png" : "/logo_light.png";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/60 backdrop-blur-md shadow-sm transition">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="#home" className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt="Arya Sedana Rental Logo"
            width={40}
            height={40}
            priority
          />
          <span
            className="text-lg font-semibold hidden sm:inline"
            style={{ color: "var(--foreground)" }}
          >
            Arya Sedana Rental
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:underline transition"
              style={{ color: "var(--foreground)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-white dark:bg-black px-6 pb-4 pt-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm border-b border-gray-200 dark:border-gray-700"
              style={{ color: "var(--foreground)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
