"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Andi Pratama",
    review:
      "The service was excellent, the motorbike was clean and well-maintained. Highly recommended for exploring Bali!",
  },
  {
    name: "Jessica M.",
    review:
      "Booking was super easy via WhatsApp and the bike was delivered right to my hotel. Great experience!",
  },
  {
    name: "Made Suartika",
    review:
      "Affordable pricing and the bike was in top condition. I’ve rented here twice already.",
  },
  {
    name: "Lia Kusuma",
    review:
      "Fast response and the scooter was fuel-efficient and perfect for Bali’s roads.",
  },
  {
    name: "Michael Tan",
    review:
      "The best rental experience I’ve had in Bali. Friendly staff and flexible drop-off times.",
  },
  {
    name: "Sara Kim",
    review:
      "Clean bike, smooth engine, and very professional communication. I felt safe riding around the island.",
  },
  {
    name: "Raka Yudhistira",
    review:
      "Very satisfied! The team was helpful and the booking process was seamless.",
  },
  {
    name: "Emily Zhang",
    review:
      "From booking to return, everything went smoothly. Highly recommended for tourists!",
  },
];

export default function Testimonial() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    setSwiperReady(true);
  }, []);

  return (
    <section
      id="testimonial"
      className="py-20 px-6 max-w-6xl mx-auto text-center relative"
    >
      <h2 className="text-3xl font-bold mb-10">What Our Riders Say</h2>

      {swiperReady && (
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          autoplay={{ delay: 5000 }}
          loop
          pagination={{ clickable: true }}
          className="!px-2"
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] border border-gray-300 dark:border-gray-700 rounded-xl p-6 text-left shadow-sm hover:shadow-md transition min-h-[200px]">
                {/* ⭐ Static 5 Stars */}
                <div className="flex gap-1 text-yellow-400 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <p className="font-semibold mb-2">{t.name}</p>
                <p className="text-sm opacity-80 leading-relaxed flex-grow">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* LEFT BUTTON */}
      <div className="absolute inset-y-0 left-0 flex items-center z-10 px-2">
        <button
          ref={prevRef}
          className="bg-[var(--foreground)] text-[var(--background)] p-2 rounded-full shadow-md hover:opacity-80 active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* RIGHT BUTTON */}
      <div className="absolute inset-y-0 right-0 flex items-center z-10 px-2">
        <button
          ref={nextRef}
          className="bg-[var(--foreground)] text-[var(--background)] p-2 rounded-full shadow-md hover:opacity-80 active:scale-95 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
