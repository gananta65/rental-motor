"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { formatRupiah } from "@/utils/RupiahFormatter";
import {
  trackUploadedImage,
  deleteImageByPath,
} from "@/utils/CleanupOrphanImages";

interface Bike {
  id: string;
  name: string;
  type: string;
  year: number;
  stock: number;
  price_daily: number;
  price_weekly: number | null;
  price_monthly: number | null;
  image_url: string;
  image_path: string;
}

type PriceKey = "price_daily" | "price_weekly" | "price_monthly";

export default function EditBikeForm({ initialData }: { initialData: Bike }) {
  const router = useRouter();

  const [form, setForm] = useState({
    ...initialData,
    price_daily: formatRupiah(initialData.price_daily.toString()),
    price_weekly: initialData.price_weekly
      ? formatRupiah(initialData.price_weekly.toString())
      : "",
    price_monthly: initialData.price_monthly
      ? formatRupiah(initialData.price_monthly.toString())
      : "",
  });

  const [imagePreview, setImagePreview] = useState<string>(
    initialData.image_url
  );
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatToRupiahInput = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number ? formatRupiah(number) : "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.startsWith("price_") ? formatToRupiahInput(value) : value,
    }));
  };

  const handleImageChange = async (file: File) => {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight: 800,
      maxSizeMB: 1,
      useWebWorker: true,
    });

    const preview = URL.createObjectURL(compressed);
    setNewImageFile(compressed);
    setImagePreview(preview);
  };

  const parseRupiahToNumber = (value: string) =>
    Number(value.replace(/\D/g, "") || 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let image_url = initialData.image_url;
    let image_path = initialData.image_path;

    try {
      if (newImageFile) {
        const formData = new FormData();
        formData.append("file", newImageFile);

        const res = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        image_url = data.url;
        image_path = data.path;

        trackUploadedImage(image_path);

        if (initialData.image_path) {
          await deleteImageByPath(initialData.image_path);
        }
      }

      const payload = {
        id: initialData.id,
        name: form.name,
        type: form.type,
        year: Number(form.year),
        stock: Number(form.stock),
        price_daily: parseRupiahToNumber(form.price_daily),
        price_weekly: form.price_weekly
          ? parseRupiahToNumber(form.price_weekly)
          : null,
        price_monthly: form.price_monthly
          ? parseRupiahToNumber(form.price_monthly)
          : null,
        image_url,
        image_path,
      };

      const res = await fetch(`/api/bikes/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error");
      }

      setSuccess(true);
      router.push("/admin/bikes");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to update: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[var(--card)] p-6 rounded-lg"
    >
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-[var(--background)] text-[var(--foreground)]"
        >
          <option value="matic">Matic</option>
          <option value="manual">Manual</option>
          <option value="sport">Sport</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold">Year</label>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(["price_daily", "price_weekly", "price_monthly"] as PriceKey[]).map(
          (key) => (
            <div key={key}>
              <label className="block font-semibold capitalize">
                {key.replace("price_", "")} Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--foreground)] opacity-70">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  name={key}
                  value={form[key] || ""}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border rounded"
                />
              </div>
            </div>
          )
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Upload New Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await handleImageChange(file);
          }}
          className="w-full p-2 rounded border border-gray-300 file:bg-[var(--accent)] file:text-[var(--background)] file:rounded file:border-none file:px-4 file:py-1 file:font-medium file:cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-[800px] h-auto rounded border object-cover"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Saving..." : "Update Bike"}
      </button>

      {success && (
        <p className="text-green-600 font-medium">Bike updated successfully!</p>
      )}
    </form>
  );
}
