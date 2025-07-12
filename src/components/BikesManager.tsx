"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import AddMultipleBikesForm from "./MultipleBikesForm";
import Image from "next/image";

interface Bike {
  id: number;
  name: string;
  type: string;
  year: number;
  price_daily: number;
  stock: number;
  image_url: string;
}

const ITEMS_PER_PAGE = 4;

export default function BikesManager() {
  const [showAddBike, setShowAddBike] = useState(false);
  const [search, setSearch] = useState("");
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    fetchBikes();
  }, []);

  async function fetchBikes() {
    setLoading(true);
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

  const filteredBikes = bikes.filter((bike) =>
    bike.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBikes.length / ITEMS_PER_PAGE);
  const paginatedBikes = filteredBikes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Header */}
      <div className="sticky top-14 z-40 bg-[var(--background)] py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 md:px-0">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Search bike name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-md border bg-[var(--background)] text-[var(--foreground)] border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            />
          </div>

          <button
            onClick={() => setShowAddBike(!showAddBike)}
            className="px-4 py-2 rounded font-medium bg-[var(--accent)] text-[var(--background)] hover:brightness-110 transition"
          >
            {showAddBike ? "Cancel" : "+ New Bike"}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddBike && (
        <div className="mb-6 mt-4">
          <AddMultipleBikesForm
            onSuccess={() => {
              fetchBikes();
              setShowAddBike(false);
            }}
          />
        </div>
      )}

      {/* Pagination */}
      {!showAddBike && filteredBikes.length > ITEMS_PER_PAGE && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded hover:opacity-90 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded hover:opacity-90 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Bike List */}
      {!showAddBike && (
        <div className="space-y-4 mt-6 min-h-[700px]">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : filteredBikes.length === 0 ? (
            <div className="text-center italic text-muted-foreground">
              No bike available.
            </div>
          ) : (
            paginatedBikes.map((bike) => (
              <div
                key={bike.id}
                className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl shadow border bg-[var(--background)] text-[var(--foreground)]"
              >
                <div className="w-full md:w-48 aspect-video relative rounded-lg overflow-hidden border">
                  <Image
                    src={bike.image_url}
                    alt={bike.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1 text-left">
                  <h3 className="text-lg font-semibold">{bike.name}</h3>
                  <p className="text-sm capitalize">Type: {bike.type}</p>
                  <p className="text-sm">Year: {bike.year}</p>
                  <p className="text-sm">
                    Daily Price: Rp {bike.price_daily.toLocaleString()}
                  </p>
                  <p className="text-sm">Stock: {bike.stock}</p>
                </div>

                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => router.push(`/admin/bikes/${bike.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this bike?"
                        )
                      ) {
                        try {
                          const res = await fetch(`/api/bikes/${bike.id}`, {
                            method: "DELETE",
                          });
                          if (!res.ok) throw new Error("Failed to delete bike");
                          fetchBikes();
                        } catch (error) {
                          alert("Failed to delete bike " + error);
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
