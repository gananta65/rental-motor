"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GalleryItem {
  id: string;
  image_url: string;
}

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/galleries")
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const slides = images.map((item) => ({
    src: item.image_url,
  }));

  return (
    <section
      id="gallery"
      className="relative py-20 px-6 max-w-6xl mx-auto mt-24 border-t border-gray-300 dark:border-gray-700"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Galleries</h2>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : images.length === 0 ? (
          <p className="italic text-muted-foreground">No images found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index);
                  setOpen(true);
                }}
              >
                <Image
                  src={item.image_url}
                  alt=""
                  width={500}
                  height={300}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={currentIndex}
          slides={slides}
          controller={{
            closeOnBackdropClick: true,
          }}
        />
      )}
    </section>
  );
}
