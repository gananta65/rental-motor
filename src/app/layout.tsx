// app/layout.tsx (SERVER COMPONENT, tanpa "use client")
import "./globals.css";
import type { Metadata } from "next";
import ThemeClientWrapper from "@/components/ThemeClientWrapper";

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
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeClientWrapper>{children}</ThemeClientWrapper>
      </body>
    </html>
  );
}
