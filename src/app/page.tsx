"use client";

import { useEffect, useState } from "react";
import {
  Hero,
  ThemeToggle,
  FloatingButtons,
  Navbar,
  AboutUs,
  Testimonials,
  Footer,
} from "@components/.";
import dynamic from "next/dynamic";

const BikeList = dynamic(() => import("@components/BikeList"), { ssr: false });

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // ⛔ Hindari mismatch render saat SSR

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ThemeToggle />
      <Navbar />
      <Hero />
      <FloatingButtons />
      <BikeList />
      <AboutUs />
      <Testimonials />
      <Footer />
    </main>
  );
}
