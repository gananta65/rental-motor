"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SessionExpired() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function logoutAndRedirect() {
      await supabase.auth.signOut();
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }

    logoutAndRedirect();
  }, [router, supabase]);

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
