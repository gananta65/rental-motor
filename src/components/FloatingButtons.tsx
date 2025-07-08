"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";

export default function FloatingButtons() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isRootPage = pathname === "/";

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
      {/* WhatsApp Button */}
      {isRootPage && (
        <a
          href="https://wa.me/6281238973985"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center transition-colors"
          aria-label="Book via WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>
      )}

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Toggle Dark Mode"
      >
        {theme === "light" ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </button>
    </div>
  );
}
