"use client";

import { useRef, useState } from "react";
import { formatRupiah } from "@utils/RupiahFormatter";
import { trackUploadedImage } from "@utils/CleanupOrphanImages";
import ImageAdjuster from "./ImageAdjuster";
import { prepareImageWithPadding } from "@utils/prepareImageWithPadding";
import BikePreviewCard from "./BikePreviewCard";

const defaultBike = {
  name: "",
  type: "matic",
  year: "",
  stock: "",
  price_daily: "",
  price_weekly: "",
  price_monthly: "",
  image_url: "",
  image_path: "",
  image_preview: "",
  image_file: undefined as File | undefined,
  raw_preview: "",
};

type BikeForm = typeof defaultBike;

function formatToRupiahInput(value: string) {
  const number = value.replace(/\D/g, "");
  return number ? formatRupiah(number) : "";
}

export default function MultipleBikesForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [bikes, setBikes] = useState<BikeForm[]>([
    structuredClone(defaultBike),
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, field: keyof BikeForm, value: string) => {
    setBikes((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [field]: value };
      return updated;
    });
  };

  const handleImageChange = async (file: File, index: number) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const paddedBase64 = await prepareImageWithPadding(base64);
      const updated = [...bikes];
      updated[index].raw_preview = paddedBase64;
      setBikes(updated);
      setEditingIndex(index);
    };
    reader.readAsDataURL(file);
  };

  const handleDoneEdit = async (file: File, previewUrl: string) => {
    if (editingIndex === null) return;
    const updated = [...bikes];
    updated[editingIndex].image_file = file;
    updated[editingIndex].image_preview = previewUrl;
    updated[editingIndex].raw_preview = "";
    setBikes(updated);
    setEditingIndex(null);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...bikes];
    updated[index].image_file = undefined;
    updated[index].image_preview = "";
    updated[index].raw_preview = "";
    setBikes(updated);
    const input = fileInputRefs.current[index];
    if (input) input.value = "";
  };

  const handleImageEdit = (index: number) => {
    const preview = bikes[index].image_preview;
    if (!preview) return;
    setBikes((prev) => {
      const updated = [...prev];
      updated[index].raw_preview = preview;
      return updated;
    });
    setEditingIndex(index);
  };

  const addBikeForm = () => {
    setBikes([...bikes, structuredClone(defaultBike)]);
  };

  const removeBikeForm = (index: number) => {
    const updated = [...bikes];
    updated.splice(index, 1);
    setBikes(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const uploaded = await Promise.all(
      bikes.map(async (bike) => {
        let url = "";
        let path = "";

        if (bike.image_file) {
          const formData = new FormData();
          formData.append("file", bike.image_file);

          const res = await fetch("/api/upload-image-bike", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          url = data.url;
          path = data.path;

          trackUploadedImage(path);
        }

        return {
          ...bike,
          year: Number(bike.year),
          stock: Number(bike.stock),
          price_daily: Number(bike.price_daily.replace(/\D/g, "")),
          price_weekly: Number(bike.price_weekly.replace(/\D/g, "")) || null,
          price_monthly: Number(bike.price_monthly.replace(/\D/g, "")) || null,
          image_url: url,
          image_path: path,
        };
      })
    );

    const res = await fetch("/api/bikes/add-multiple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bikes: uploaded }),
    });

    if (res.ok) {
      setSuccess(true);
      setBikes([structuredClone(defaultBike)]);
      onSuccess?.();
    } else {
      const err = await res.json();
      alert("Failed: " + (err.error || "Unknown error"));
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        {bikes.map((bike, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 bg-[var(--card)] text-[var(--foreground)] relative"
          >
            <h2 className="text-lg font-bold">Bike #{index + 1}</h2>
            <button
              type="button"
              onClick={() => removeBikeForm(index)}
              className="absolute top-3 right-3 text-red-500 text-sm"
              disabled={bikes.length === 1}
            >
              ✕ Remove
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  required
                  value={bike.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Type</label>
                <select
                  value={bike.type}
                  onChange={(e) => handleChange(index, "type", e.target.value)}
                  className="w-full p-2 border rounded bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="matic">Matic</option>
                  <option value="manual">Manual</option>
                  <option value="sport">Sport</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Year</label>
                <input
                  type="number"
                  required
                  value={bike.year}
                  onChange={(e) => handleChange(index, "year", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Stock</label>
                <input
                  type="number"
                  required
                  value={bike.stock}
                  onChange={(e) => handleChange(index, "stock", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-semibold mb-2">
                  Rental Prices
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {(
                    ["price_daily", "price_weekly", "price_monthly"] as const
                  ).map((key) => (
                    <div key={key}>
                      <label className="block font-medium mb-1">
                        {key === "price_daily"
                          ? "Daily"
                          : key === "price_weekly"
                          ? "Weekly"
                          : "Monthly"}{" "}
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--foreground)] opacity-70">
                          Rp
                        </span>
                        <input
                          inputMode="numeric"
                          value={bike[key]}
                          onChange={(e) =>
                            handleChange(
                              index,
                              key,
                              formatToRupiahInput(e.target.value)
                            )
                          }
                          className="w-full pl-10 p-2 border rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium mb-1">
                  Upload Motor Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!bike.image_file}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageChange(file, index);
                  }}
                  ref={(el) => {
                    fileInputRefs.current[index] = el;
                  }}
                  className="w-full p-2 rounded border border-gray-300 bg-[var(--background)] text-[var(--foreground)] file:bg-[var(--accent)] file:text-[var(--background)] file:rounded file:border-none file:px-4 file:py-1 file:font-medium file:cursor-pointer"
                />

                {bike.image_preview && (
                  <div className="mt-4 space-y-2">
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                      src={bike.image_preview}
                      alt="Preview"
                      className="w-full h-auto rounded border object-cover"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleImageEdit(index)}
                        className="px-3 py-1 rounded bg-yellow-500 text-white text-sm"
                      >
                        Edit Image
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={addBikeForm}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Bike
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save All"}
          </button>
        </div>

        {success && (
          <p className="text-green-600 font-medium mt-4">
            Bikes successfully added!
          </p>
        )}
      </form>

      {editingIndex !== null && bikes[editingIndex]?.raw_preview && (
        <ImageAdjuster
          rawImage={bikes[editingIndex].raw_preview}
          onFinish={handleDoneEdit}
          PreviewComponent={({ imageUrl }) => (
            <BikePreviewCard
              imageUrl={imageUrl}
              bikeName={bikes[editingIndex].name}
              priceDaily={bikes[editingIndex].price_daily}
            />
          )}
        />
      )}
    </>
  );
}
