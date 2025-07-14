"use client";

import GalleryManager from "@components/GalleryManager";

export default function GalleriesPage() {
  return (
    <main className="min-h-screen py-6 px-4 md:px-8">
      <h1 className="text-2xl font-semibold mb-6">Manage Gallery Sections</h1>
      <GalleryManager />
    </main>
  );
}
