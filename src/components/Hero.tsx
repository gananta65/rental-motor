"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  order: number;
}

export default function Hero() {
  const [heroes, setHeroes] = useState<HeroData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchHeroData();
  }, []);

  useEffect(() => {
    if (heroes.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % heroes.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [heroes]);

  async function fetchHeroData() {
    try {
      const res = await fetch("/api/heroes");
      const data = await res.json();
      const sorted = [...data].sort((a, b) => a.order - b.order);
      setHeroes(sorted);
    } catch (error) {
      console.error(error);
    }
  }

  const activeHero = heroes[activeIndex];

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center text-center px-6 min-h-screen overflow-hidden"
    >
      {/* Slideshow background */}
      <div className="absolute inset-0 -z-10 transition-opacity duration-700">
        {heroes.map((hero, index) => (
          <div
            key={hero.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
              index === activeIndex ? "opacity-30 dark:opacity-40" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${hero.image_url})` }}
          />
        ))}
      </div>

      {/* Content */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 z-10 transition-opacity duration-700">
        {activeHero?.title || "RENTAL SCOOTER IN CANGGU"}
      </h1>
      <p className="text-lg md:text-xl max-w-xl mb-6 z-10 transition-opacity duration-700">
        {activeHero?.subtitle ||
          "Explore the island with comfort and freedom. Affordable daily, weekly, or monthly rentals. Book now and ride worry-free!"}
      </p>

      <a
        href="https://wa.me/6281238973985?text=Hi%20I%20want%20to%20book%20a%20motorbike"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg transition inline-flex items-center gap-2 z-10"
        aria-label="Book via WhatsApp"
      >
        <FaWhatsapp className="w-5 h-5" />
        <span>Book via WhatsApp</span>
      </a>
    </section>
  );
}
