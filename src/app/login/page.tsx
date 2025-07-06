"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FloatingButtons } from "@/components";
import LoginForm from "@/app/login/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin");
      } else {
        setHasChecked(true);
      }
    };

    checkSession();
  }, [router, supabase]);

  if (!hasChecked) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <LoginForm />
      <FloatingButtons />
    </main>
  );
}
