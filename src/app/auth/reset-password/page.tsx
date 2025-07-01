"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Handle token yang dikirim via URL oleh Supabase
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          setCheckingSession(false);
        }
      }
    );

    // Cek apakah user sudah login
    supabaseClient.auth.getUser().then(({ data, error }) => {
      if (!data.user || error) {
        setErrorMsg("Session expired or invalid reset link.");
        setCheckingSession(false);
      } else {
        setCheckingSession(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await supabaseClient.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message || "Failed to update password.");
    } else {
      setSuccessMsg("Password updated successfully!");
      setTimeout(() => router.push("/login"), 2500);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-xl shadow-md border border-gray-300 dark:border-gray-700 bg-[var(--background)] text-[var(--foreground)]">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-1 mb-4 text-sm text-[var(--accent)] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Set New Password</h1>

        {checkingSession ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-5 w-5 text-[var(--accent)]" />
          </div>
        ) : successMsg ? (
          <div className="p-3 mb-4 rounded-md bg-green-50 text-green-600 border border-green-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{successMsg}</p>
              <p className="text-sm mt-1">Redirecting to login page...</p>
            </div>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3 mb-4 rounded-md bg-red-50 border border-red-200 text-red-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border rounded-md bg-[var(--background)] border-gray-300 dark:border-gray-600"
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border rounded-md bg-[var(--background)] border-gray-300 dark:border-gray-600"
                  placeholder="Re-enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-md bg-[var(--accent)] text-[var(--background)] font-semibold disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
