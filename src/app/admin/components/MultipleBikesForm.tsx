"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { formatRupiah } from "@/utils/RupiahFormatter";
import { trackUploadedImage } from "@/utils/CleanupOrphanImages";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (i: number, field: keyof BikeForm, value: string) => {
    setBikes((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [field]: value };
      return updated;
    });
  };

  const handleImageChange = async (file: File, index: number) => {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight: 800,
      maxSizeMB: 1,
      useWebWorker: true,
    });

    const preview = URL.createObjectURL(compressed);
    const updated = [...bikes];
    updated[index].image_preview = preview;
    updated[index].image_file = compressed;
    setBikes(updated);
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

          const res = await fetch("/api/upload-image", {
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

          <div className="grid sm:grid-cols-2 gap-4">
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

            {/* Rental Prices Section */}
            <div className="sm:col-span-2">
              <label className="block text-lg font-semibold mb-2">
                Rental Prices
              </label>
              <div className="grid sm:grid-cols-3 gap-4">
                {(
                  [
                    ["price_daily", "Daily Price"],
                    ["price_weekly", "Weekly Price"],
                    ["price_monthly", "Monthly Price"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="block font-medium mb-1">{label}</label>
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

            {/* Upload Image */}
            <div className="sm:col-span-2">
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
                className="w-full p-2 rounded border border-gray-300 bg-[var(--background)] text-[var(--foreground)]
                file:bg-[var(--accent)] file:text-[var(--background)] file:rounded file:border-none file:px-4 file:py-1 file:font-medium file:cursor-pointer"
              />
              {bike.image_preview && (
                <div className="mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bike.image_preview}
                    alt="Preview"
                    className="max-w-[800px] h-auto rounded border object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
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
  );
}
