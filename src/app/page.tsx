import { Hero, ThemeToggle, FloatingButtons, Navbar } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <ThemeToggle />
      <Navbar />
      <Hero />
      <FloatingButtons />
    </main>
  );
}
