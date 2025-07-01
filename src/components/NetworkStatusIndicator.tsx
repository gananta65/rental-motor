// src/components/NetworkStatusIndicator.tsx
"use client";

import { useEffect, useState } from "react";

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 p-3 bg-red-500 text-white rounded-md shadow-lg z-50">
      ❌ Tidak ada koneksi internet. Silakan cek jaringan Anda.
    </div>
  );
}
