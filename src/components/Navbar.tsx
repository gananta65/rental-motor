"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Bikes", href: "#fleet" },
    { label: "Contact", href: "#contact" },
    { label: "Login", href: "/login" },
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
          <span className="text-lg font-semibold hidden sm:inline text-foreground">
            Arya Sedana Rental
          </span>
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:underline transition text-foreground"
            >
              {item.label}
            </Link>
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

      {/* Mobile Nav Animated */}
      <div
        className={`md:hidden px-6 pt-2 pb-4 bg-white dark:bg-black transition-all duration-300 ease-out overflow-hidden
        ${
          isOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
        }`}
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="block py-2 text-sm border-b border-gray-200 dark:border-gray-700 text-black dark:text-white hover:underline"
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
