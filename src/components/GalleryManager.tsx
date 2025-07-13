"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddGalleryModal from "@components/AddGalleryModal";

interface GalleryItem {
  id: string;
  image_url: string;
}

export default function GalleriesManager() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const res = await fetch("/api/galleries");
      const data = await res.json();
      setImages(data);
    } catch {
      toast.error("Failed to load galleries.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    if (!confirm("Delete selected images?")) return;

    try {
      const selectedIds = Array.from(selected);
      const selectedPaths = images
        .filter((img) => selected.has(img.id))
        .map((img) => {
          const url = new URL(img.image_url);
          return decodeURIComponent(
            url.pathname.replace(
              /^\/storage\/v1\/object\/public\/galleries\//,
              ""
            )
          );
        });

      const res = await fetch("/api/galleries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, paths: selectedPaths }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      toast.success("Deleted selected images.");
      setSelected(new Set());
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error(
        `Failed to delete images: ${err instanceof Error ? err.message : err}`
      );
    }
  }

  async function handleUpload(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/galleries", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Upload failed:", errorData);
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      toast.success("Images uploaded.");
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error(`Upload failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Galleries</h1>

        <div className="flex gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              Delete Selected
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--background)]"
          >
            + Add Images
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="italic text-muted-foreground">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1">
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => toggleSelect(img.id)}
              className={`relative cursor-pointer group ${
                selected.has(img.id) ? "ring-4 ring-[var(--accent)]" : ""
              }`}
            >
              <Image
                src={img.image_url}
                alt="Gallery image"
                width={500}
                height={300}
                className="w-full aspect-[4/3] object-cover"
              />

              {selected.has(img.id) ? (
                <div className="absolute inset-0 bg-[var(--accent)]/60 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-50 transition-opacity" />
              )}
            </div>
          ))}
        </div>
      )}

      <AddGalleryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
}
