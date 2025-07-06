"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errorMessageMap: Record<string, string> = {
    "Invalid login credentials": "Invalid email or password.",
    "Invalid login": "Invalid email or password.",
    "Email not confirmed": "Please confirm your email before logging in.",
    "fetch failed": "No internet connection.",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message =
        errorMessageMap[error.message] || error.message || "Login failed.";
      setErrorMsg(message);
    } else {
      router.replace("/admin");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 rounded-xl shadow-md border border-[color:var(--border)] bg-[var(--card)]"
      >
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        {errorMsg && (
          <p className="text-red-600 mb-4 text-sm font-medium">{errorMsg}</p>
        )}

        <label className="block mb-2 text-sm">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded border border-gray-300 bg-[var(--background)] text-[var(--foreground)]"
        />

        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded border border-gray-300 bg-[var(--background)] text-[var(--foreground)]"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 rounded font-semibold bg-[var(--accent)] text-[var(--background)] disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
