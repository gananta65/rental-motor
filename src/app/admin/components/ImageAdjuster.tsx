"use client";

import { useCallback, useEffect, useState } from "react";
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

  // Reset crop position when zoom changes
  useEffect(() => {
    if (zoom !== lastZoom) {
      setCrop({ x: 0, y: 0 });
      setLastZoom(zoom);
    }
  }, [zoom, lastZoom]);

  const onCropComplete = useCallback(
    async (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
      try {
        const blob = await getCroppedImg(rawImage, croppedPixels);
        const file = blobToFile(blob, `preview-${Date.now()}.jpg`);
        const compressed = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressed);
        setLivePreview(previewUrl);
      } catch (err) {
        console.error("Live preview failed", err);
      }
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
      <div className="bg-white dark:bg-black rounded-xl p-4 shadow-lg w-full max-w-4xl grid sm:grid-cols-2 gap-6">
        {/* Live Preview Card */}
        <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow bg-[#fcf1dd] max-w-sm mx-auto w-full">
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
                  className="w-full py-2 rounded-full border text-sm font-medium cursor-default bg-white text-gray-500 border-gray-300"
                >
                  {label} Rental
                </button>
              ))}

              <button
                disabled
                className="w-full py-2 rounded-full text-sm font-semibold bg-teal-500 text-white cursor-default"
              >
                📱 Book via WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Cropper Area */}
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
          <Cropper
            image={rawImage}
            crop={crop}
            zoom={zoom}
            zoomSpeed={0.05}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Buttons */}
        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={handleDone}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
