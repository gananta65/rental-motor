"use client";

import HeroManager from "@components/HeroManager";

export default function AdminHeroPage() {
  return (
    <main className="min-h-screen py-6 px-4 md:px-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Hero Sections</h1>
      <HeroManager />
    </main>
  );
}
