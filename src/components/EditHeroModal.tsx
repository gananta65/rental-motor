"use client";

import { useState } from "react";
import ImageAdjuster from "./ImageAdjuster";
import { HeroPreviewCard } from "./HeroPreviewCard";
import { prepareImageWithPadding } from "@utils/prepareImageWithPadding";
import { trackUploadedImage } from "@utils/CleanupOrphanImages";

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_path: string;
}

export default function EditHeroModal({
  hero,
  onClose,
  onSuccess,
}: {
  hero: HeroData;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(hero.title);
  const [subtitle, setSubtitle] = useState(hero.subtitle);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(hero.image_url);
  const [rawPreview, setRawPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [finalImageUrl] = useState(hero.image_url);
  const [finalImagePath] = useState(hero.image_path);

  const handleFileInput = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const padded = await prepareImageWithPadding(base64);
      setRawPreview(padded);
    };
    reader.readAsDataURL(file);
  };

  const handleDoneEdit = async (file: File, previewUrl: string) => {
    setImageFile(file);
    setImagePreview(previewUrl);
    setRawPreview(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    let currentImageUrl = finalImageUrl;
    let currentImagePath = finalImagePath;

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload-image-hero", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

        currentImageUrl = uploadData.url;
        currentImagePath = uploadData.path;

        trackUploadedImage(uploadData.path);
      }

      const patchRes = await fetch(`/api/heroes/${hero.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          image_url: currentImageUrl,
          image_path: currentImagePath,
        }),
      });

      if (!patchRes.ok) {
        const errData = await patchRes.json();
        throw new Error(errData?.error || "Failed to update hero");
      }

      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Edit error:", error);

      if (error instanceof Error) {
        alert(error.message || "Failed to update hero");
      } else {
        alert("Failed to update hero");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">Edit Hero</h2>

        <div>
          <label className="block font-semibold">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Subtitle</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFileInput(file);
            }}
            className="w-full p-2 border rounded file:border-none file:bg-[var(--accent)] file:text-[var(--background)]"
          />
          {imagePreview && (
            /* eslint-disable @next/next/no-img-element */
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full mt-2 rounded border object-cover"
            />
          )}
        </div>

        {rawPreview && (
          <ImageAdjuster
            rawImage={rawPreview}
            onFinish={handleDoneEdit}
            PreviewComponent={HeroPreviewCard}
          />
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
