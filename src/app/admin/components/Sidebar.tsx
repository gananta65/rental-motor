"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Sidebar({ email }: { email: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie = "logged_in=; Max-Age=0; path=/";
      localStorage.removeItem("logged_in");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/bikes", label: "Bikes" },
  ];

  return (
    <>
      {/* Hamburger Button (mobile only, fixed so it doesn't scroll) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-3 left-4 z-[70] bg-[var(--background)] border px-2 py-1.5 rounded shadow"
          aria-label="Open sidebar"
        >
          <Menu className="text-[var(--foreground)]" size={20} />
        </button>
      )}

      {/* Backdrop Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--background)] text-[var(--foreground)] border-r p-4 z-[61] transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:block`}
      >
        {/* Email Admin */}
        <div className="mt-14 mb-4 text-sm font-semibold break-words">
          {email}
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded transition ${
                    pathname === item.href
                      ? "bg-[var(--accent)] text-white"
                      : "hover:bg-[var(--accent)] hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)} // auto-close mobile
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-600/20 dark:hover:bg-red-900"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
