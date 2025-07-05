"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingButtons } from "@/components";
import LoginForm from "@/app/login/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const loggedIn =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("logged_in="))
          ?.split("=")[1] === "true";

      if (loggedIn) {
        router.replace("/admin");
      } else {
        setHasChecked(true);
      }
    };

    checkSession();
  }, [router]);

  if (!hasChecked) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <LoginForm />
      <FloatingButtons />
    </main>
  );
}
