"use client";

import { useState } from "react";
import BikeCard from "./BikeCard";

interface Bike {
  id: number;
  name: string;
  image?: string;
  pricePerDay: number;
}

const bikes: Bike[] = [
  {
    id: 1,
    name: "Honda Scoopy",
    image: "", // Kosong untuk simulasi
    pricePerDay: 70000,
  },
  {
    id: 2,
    name: "Yamaha NMAX",
    image: "/bikes/nmax.jpg",
    pricePerDay: 120000,
  },
  {
    id: 3,
    name: "Honda Vario",
    pricePerDay: 85000, // Tidak ada field image
  },
  {
    id: 4,
    name: "Yamaha Aerox",
    image: "/bikes/aerox.jpg",
    pricePerDay: 100000,
  },
];

export default function BikeList() {
  const [openBike, setOpenBike] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBikes = bikes.filter((bike) =>
    bike.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="fleet" className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Our Motorbike Fleet
      </h2>

      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search motorbike..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-400 rounded-full transition focus:outline-none focus:ring-2 focus:ring-green-500"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            borderColor: "var(--foreground)",
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredBikes.map((bike) => (
          <BikeCard
            key={bike.id}
            name={bike.name}
            image={
              bike.image && bike.image.trim() !== ""
                ? bike.image
                : "/bikes/placeholder.jpg"
            }
            pricePerDay={bike.pricePerDay}
            isOpen={openBike === bike.id}
            onClick={() => setOpenBike(openBike === bike.id ? null : bike.id)}
          />
        ))}
        {filteredBikes.length === 0 && (
          <p className="text-center col-span-full opacity-60">
            No bikes match your search.
          </p>
        )}
      </div>
    </section>
  );
}
