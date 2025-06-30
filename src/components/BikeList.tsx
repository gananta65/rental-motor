"use client";

import { useState } from "react";
import BikeCard from "./BikeCard";
import { Search } from "lucide-react";

interface Bike {
  id: number;
  name: string;
  image?: string;
  pricePerDay: number;
}

const bikes: Bike[] = [
  { id: 1, name: "Honda Scoopy", image: "", pricePerDay: 70000 },
  { id: 2, name: "Yamaha NMAX", image: "/bikes/nmax.jpg", pricePerDay: 120000 },
  { id: 3, name: "Honda Vario", pricePerDay: 85000 },
  {
    id: 4,
    name: "Yamaha Aerox",
    image: "/bikes/aerox.jpg",
    pricePerDay: 100000,
  },
  {
    id: 5,
    name: "Vespa Matic",
    image: "/bikes/vespa.jpg",
    pricePerDay: 150000,
  },
  { id: 6, name: "Suzuki Nex", pricePerDay: 60000 },
  { id: 7, name: "Honda Beat", image: "/bikes/beat.jpg", pricePerDay: 65000 },
  { id: 8, name: "Yamaha X-Ride", pricePerDay: 70000 },
  { id: 9, name: "Honda PCX", image: "/bikes/pcx.jpg", pricePerDay: 130000 },
  { id: 10, name: "Yamaha Mio", pricePerDay: 55000 },
];

export default function BikeList() {
  const [openBike, setOpenBike] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredBikes = bikes.filter((bike) =>
    bike.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, filteredBikes.length));
  };

  const handleShowLess = () => {
    setVisibleCount(4);
  };

  const hasMoreToShow = visibleCount < filteredBikes.length;
  const hasShownMore = visibleCount > 4;

  return (
    <section id="fleet" className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">AVAILABLE BIKES</h2>

      <div className="max-w-md mx-auto mb-6 relative">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-foreground opacity-60" />
        <input
          type="text"
          placeholder="Search motorbike..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setVisibleCount(4);
          }}
          className="w-full pl-10 pr-4 py-2 border border-foreground/40 rounded-full transition focus:outline-none focus:ring-2 focus:ring-foreground"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            borderColor: "var(--foreground)",
          }}
        />
        <p className="text-sm text-center mt-2 opacity-60">
          Tap on a bike to choose your rental option.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredBikes.slice(0, visibleCount).map((bike) => (
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

      {(hasMoreToShow || hasShownMore) && (
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          {hasMoreToShow && (
            <button
              onClick={handleLoadMore}
              className="bg-foreground text-background px-6 py-2 rounded-full font-medium transition hover:opacity-80"
            >
              Load More
            </button>
          )}
          {hasShownMore && (
            <button
              onClick={handleShowLess}
              className="bg-foreground text-background px-6 py-2 rounded-full font-medium transition hover:opacity-80"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </section>
  );
}
