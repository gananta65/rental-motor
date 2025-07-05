"use client";

import { useEffect, useState } from "react";

export function NetworkStatusIndicator() {
  const [, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Hilangkan banner 2 detik setelah online
      setTimeout(() => setShowBanner(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cek status awal saat load
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 p-3 bg-red-500 text-white rounded-md shadow-lg z-50 transition-opacity duration-500">
      ❌ No Connection, Check Your Network
    </div>
  );
}
