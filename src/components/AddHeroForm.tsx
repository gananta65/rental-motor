"use client";

import { useState, FormEvent } from "react";
import { trackUploadedImage } from "@utils/CleanupOrphanImages";
import { prepareImageWithPadding } from "@utils/prepareImageWithPadding";
import ImageAdjuster from "./ImageAdjuster";
import { HeroPreviewCard } from "./HeroPreviewCard";

export default function AddHeroForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileInput = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = typeof reader.result === "string" ? reader.result : "";
      const padded = await prepareImageWithPadding(base64);
      setRawPreview(padded);
    };
    reader.readAsDataURL(file);
  };

  const handleDoneEdit = async (file: File, previewUrl: string) => {
    setNewImageFile(file);
    setImagePreview(previewUrl);
    setRawPreview(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newImageFile) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", newImageFile);

      const uploadRes = await fetch("/api/upload-image-hero", {
        method: "POST",
        body: formData,
      });

      const uploadData: { url: string; path: string; error?: string } =
        await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      trackUploadedImage(uploadData.path);

      const payload = {
        title,
        subtitle,
        image_url: uploadData.url,
        image_path: uploadData.path,
      };

      const saveRes = await fetch("/api/heroes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!saveRes.ok) {
        const errorData = await saveRes.json().catch(() => ({}));
        throw new Error(errorData?.error || "Failed to save hero");
      }

      onSuccess();
    } catch (err) {
      const error = err as Error;
      console.error("Error saving hero:", error);
      alert(error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-[var(--card)] p-6 rounded-lg"
    >
      <div>
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block font-semibold">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await handleFileInput(file);
          }}
          required
          className="w-full p-2 rounded border border-gray-300 file:bg-[var(--accent)] file:text-[var(--background)] file:rounded file:border-none file:px-4 file:py-1 file:font-medium file:cursor-pointer"
        />
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full mt-4 rounded border object-cover"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Hero"}
      </button>

      {rawPreview && (
        <ImageAdjuster
          rawImage={rawPreview}
          onFinish={handleDoneEdit}
          PreviewComponent={HeroPreviewCard}
        />
      )}
    </form>
  );
}
