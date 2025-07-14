"use client";

import { useRouter } from "next/navigation";

export default function ComingSoon() {
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
        Coming Soon
      </h1>
      <p className="text-center max-w-md mb-6 text-base md:text-lg opacity-80">
        We’re preparing this page. Please check back again soon.
      </p>
      <button
        onClick={() => router.back()}
        className="px-5 py-2 rounded-md font-medium shadow-sm border transition-colors"
        style={{
          background: "var(--accent)",
          color: "var(--background)",
          borderColor: "var(--accent)",
        }}
      >
        Back
      </button>
    </div>
  );
}
