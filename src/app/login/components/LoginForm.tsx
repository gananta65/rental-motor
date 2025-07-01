"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/admin");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResetMessage("");

    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      resetEmail,
      {
        redirectTo:
          process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_TO ||
          `${window.location.origin}/auth/reset-password`,
      }
    );

    if (error) {
      setResetMessage(`Error: ${error.message}`);
    } else {
      setResetMessage("Link reset password telah dikirim ke email Anda");
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail("");
        setResetMessage("");
      }, 2500);
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Main Login Form */}
      <div className="w-full max-w-md p-6 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 bg-[var(--background)] text-[var(--foreground)]">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        {errorMsg && <p className="text-sm text-red-500 mb-4">{errorMsg}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md bg-[var(--background)] border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md bg-[var(--background)] border-gray-300 dark:border-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-[var(--accent)] text-[var(--background)] font-semibold disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Login"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(true);
              setResetEmail("");
              setResetMessage("");
            }}
            className="mt-4 text-sm text-[var(--accent)] hover:underline w-full text-center"
          >
            Lupa password?
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-[var(--background)] p-6 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                  setResetMessage("");
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">Reset Password</h2>
            </div>

            {resetMessage && (
              <p
                className={`p-3 mb-4 rounded-md ${
                  resetMessage.includes("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {resetMessage}
              </p>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-[var(--background)] border-gray-300 dark:border-gray-600"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-md bg-[var(--accent)] text-[var(--background)] font-semibold disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Kirim Reset Link"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
