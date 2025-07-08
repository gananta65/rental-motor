"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/CropImage";
import { blobToFile } from "@/utils/BlobToFile";
import { compressImage } from "@/utils/CompressImage";
import Image from "next/image";

interface ImageAdjusterProps {
  rawImage: string;
  onFinish: (file: File, previewUrl: string) => void;
}

export default function ImageAdjuster({
  rawImage,
  onFinish,
}: ImageAdjusterProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [lastZoom, setLastZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [livePreview, setLivePreview] = useState<string>(rawImage);

  const cropperRef = useRef<HTMLDivElement | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (zoom !== lastZoom) {
      setCrop({ x: 0, y: 0 });
      setLastZoom(zoom);
    }
  }, [zoom, lastZoom]);

  // Smooth zoom for slider
  useEffect(() => {
    if (cropperRef.current) {
      const transformLayer = cropperRef.current.querySelector("div > div");
      if (transformLayer instanceof HTMLElement) {
        transformLayer.style.transition = "transform 0.2s ease-out";
      }
    }
  }, [zoom]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);

      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }

      previewTimeoutRef.current = setTimeout(async () => {
        try {
          const blob = await getCroppedImg(rawImage, croppedPixels);
          const file = blobToFile(blob, `preview-${Date.now()}.jpg`);
          const compressed = await compressImage(file);
          const previewUrl = URL.createObjectURL(compressed);
          setLivePreview(previewUrl);
        } catch (err) {
          console.error("Live preview failed", err);
        }
      }, 300);
    },
    [rawImage]
  );

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(rawImage, croppedAreaPixels);
      const file = blobToFile(blob, `final-${Date.now()}.jpg`);
      const compressed = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressed);
      onFinish(compressed, previewUrl);
    } catch (err) {
      console.error("Final crop failed", err);
      alert("Failed to process image. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div
        className="rounded-xl p-4 shadow-lg w-full max-w-4xl grid sm:grid-cols-2 gap-6"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        {/* Live Preview Card */}
        <div className="rounded-xl overflow-hidden border shadow max-w-sm mx-auto w-full bg-[var(--background)] border-[var(--foreground)] text-[var(--foreground)]">
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={livePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">Bike Name</h3>
            <p className="text-lg font-bold mt-1">Rp 00.000 / day</p>

            <div className="mt-4 space-y-2">
              {["Daily", "Weekly", "Monthly"].map((label) => (
                <button
                  key={label}
                  disabled
                  className="w-full py-2 rounded-full border text-sm font-medium cursor-default bg-[var(--background)] text-[var(--foreground)] border-[var(--foreground)]"
                >
                  {label} Rental
                </button>
              ))}

              <button
                disabled
                className="w-full py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--accent)" }}
              >
                📱 Book via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Cropper Area */}
        <div className="flex flex-col gap-2">
          <div className="text-sm mb-2">
            <p>
              Drag the image to adjust its position. Use your mouse wheel,
              touchpad, or slider below to zoom in or out.
            </p>
          </div>

          <div
            ref={cropperRef}
            className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800"
          >
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              zoomSpeed={0.02}
              minZoom={1}
              maxZoom={2.5}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={true}
            />
          </div>

          <div className="mt-2">
            <label className="block text-sm mb-1">Zoom</label>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={handleDone}
            className="px-4 py-2 rounded text-white"
            style={{ background: "var(--accent)" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
