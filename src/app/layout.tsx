// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ThemeClientWrapper from "@/components/ThemeClientWrapper"; // Masih aman dipanggil di dalam <body>

export const metadata: Metadata = {
  title: "Rental Motor",
  description: "Sewa motor mudah dan cepat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <ThemeClientWrapper>{children}</ThemeClientWrapper>
      </body>
    </html>
  );
}
