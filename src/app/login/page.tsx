"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FloatingButtons } from "@/components";
import LoginForm from "@/app/login/components/LoginForm";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      await supabase.auth.getSession(); // hanya cek, tidak redirect
      setHasChecked(true);
    };

    checkSession();
  }, [supabase]);

  if (!hasChecked) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <LoginForm />
      <FloatingButtons />
    </main>
  );
}
