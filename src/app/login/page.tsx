"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { FloatingButtons } from "@/components";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (session) router.replace("/admin");
    };

    checkSession();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <LoginForm />
      <FloatingButtons />
    </main>
  );
}
