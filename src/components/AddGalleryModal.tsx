"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function AddGalleryModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  }

  function handleRemove(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  function handleUpload() {
    if (files.length === 0) return;
    onSubmit(files);
    setFiles([]);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/50" />
      <Dialog.Panel className="relative bg-[var(--background)] p-6 max-w-lg w-full rounded shadow-lg z-10">
        <div className="flex justify-between items-center mb-4">
          <Dialog.Title className="text-lg font-bold">Add Images</Dialog.Title>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-400 rounded p-4 text-center cursor-pointer"
        >
          <p className="text-sm mb-2">Drag & drop images here</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer underline">
            Or click to select
          </label>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="aspect-square object-cover rounded"
                />
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--background)] disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
