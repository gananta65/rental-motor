"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionExpired() {
  const router = useRouter();

  useEffect(() => {
    async function logoutAndRedirect() {
      await fetch("/api/auth/logout", { method: "POST" });
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }

    logoutAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="text-center px-6 py-8 rounded-xl shadow-lg border border-[var(--foreground)] max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Session Expired</h1>
        <p className="text-base">
          Your session has expired for security reasons. Redirecting to the
          login page...
        </p>
      </div>
    </div>
  );
}
