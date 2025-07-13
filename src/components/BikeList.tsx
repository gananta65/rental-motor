"use client";

import { useEffect, useState } from "react";
import BikeCard from "./BikeCard";
import { Search } from "lucide-react";

interface Bike {
  id: number;
  name: string;
  image_url?: string;
  price_daily: number;
  price_weekly: number;
  price_monthly: number;
}

export default function BikeList() {
  const [openBike, setOpenBike] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBikes() {
      try {
        const res = await fetch("/api/bikes");
        if (!res.ok) throw new Error("Failed to fetch bikes");
        const data = await res.json();
        setBikes(data);
      } catch (error) {
        console.error(error);
        setBikes([]);
      }
      setLoading(false);
    }

    fetchBikes();
  }, []);

  const filteredBikes = bikes.filter((bike) =>
    bike.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const ITEMS_PER_PAGE = 6;
  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, filteredBikes.length)
    );
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const hasMoreToShow = visibleCount < filteredBikes.length;
  const hasShownMore = visibleCount > ITEMS_PER_PAGE;

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

      {loading ? (
        <p className="text-center opacity-60">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredBikes.slice(0, visibleCount).map((bike) => (
              <BikeCard
                key={bike.id}
                name={bike.name}
                image={
                  bike.image_url && bike.image_url.trim() !== ""
                    ? bike.image_url
                    : "/bikes/placeholder.jpg"
                }
                pricePerDay={bike.price_daily}
                pricePerWeek={bike.price_weekly}
                pricePerMonth={bike.price_monthly}
                isOpen={openBike === bike.id}
                onClick={() =>
                  setOpenBike(openBike === bike.id ? null : bike.id)
                }
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
        </>
      )}
    </section>
  );
}
