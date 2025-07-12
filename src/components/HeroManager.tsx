"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import AddHeroForm from "./AddHeroForm";
import EditHeroModal from "./EditHeroModal";
import SortableHeroCard from "./SortableHeroCard";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  image_path: string;
  order: number;
}

export default function HeroManager() {
  const [heroes, setHeroes] = useState<HeroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [activeHeroId, setActiveHeroId] = useState<string | null>(null);
  const [editHero, setEditHero] = useState<HeroData | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchHeroData();
  }, []);

  async function fetchHeroData() {
    setLoading(true);
    try {
      const res = await fetch("/api/heroes");
      const data = await res.json();
      setHeroes([...data].sort((a, b) => a.order - b.order));
      setOrderChanged(false);
      setActiveHeroId(null);
    } catch {
      setHeroes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOrder() {
    try {
      const updatedPayload = heroes.map((hero, index) => ({
        id: hero.id,
        order: index + 1,
      }));

      const res = await fetch("/api/heroes/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroes: updatedPayload }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      setOrderChanged(false);
      fetchHeroData();
      toast.success("Hero order updated.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order.");
    }
  }

  async function handleDelete(id: string) {
    if (heroes.length <= 1) {
      toast.error("At least one hero is required.");
      return;
    }

    if (!confirm("Are you sure you want to delete this hero?")) return;
    try {
      const res = await fetch(`/api/heroes?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete hero");

      toast.success("Hero deleted successfully.");
      fetchHeroData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete hero.");
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = heroes.findIndex((h) => h.id === active.id);
      const newIndex = heroes.findIndex((h) => h.id === over?.id);
      setHeroes(arrayMove(heroes, oldIndex, newIndex));
      setOrderChanged(true);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Hero Manager</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--background)] hover:brightness-110 transition"
        >
          {showAddForm ? "Cancel" : "+ New Hero"}
        </button>
      </div>

      {orderChanged && (
        <div className="flex justify-end gap-3">
          <button
            onClick={fetchHeroData}
            className="px-4 py-2 rounded bg-gray-600 text-white font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateOrder}
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
          >
            Confirm New Order
          </button>
        </div>
      )}

      {showAddForm && (
        <AddHeroForm
          onSuccess={() => {
            fetchHeroData();
            setShowAddForm(false);
          }}
        />
      )}

      {!showAddForm &&
        (loading ? (
          <p className="text-muted-foreground">Loading hero sections...</p>
        ) : heroes.length === 0 ? (
          <p className="italic text-muted-foreground">
            No hero section available.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={heroes.map((h) => h.id)}
              strategy={verticalListSortingStrategy}
            >
              {heroes.map((hero, index) => (
                <SortableHeroCard
                  key={hero.id}
                  hero={hero}
                  index={index}
                  activeHeroId={activeHeroId}
                  setActiveHeroId={setActiveHeroId}
                  onDelete={() => handleDelete(hero.id)}
                  onEdit={() => setEditHero(hero)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ))}

      {editHero && (
        <EditHeroModal
          hero={editHero}
          onClose={() => setEditHero(null)}
          onSuccess={fetchHeroData}
        />
      )}
    </div>
  );
}
