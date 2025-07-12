import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical } from "lucide-react"; // pakai lucide-react atau ikon lain sesuai project Anda

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

export default function SortableHeroCard({
  hero,
  index,
  activeHeroId,
  setActiveHeroId,
  onEdit,
  onDelete,
}: {
  hero: HeroData;
  index: number;
  activeHeroId: string | null;
  setActiveHeroId: (id: string | null) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: hero.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="relative rounded-xl overflow-hidden border shadow-md bg-[var(--background)]"
        onClick={() =>
          setActiveHeroId(activeHeroId === hero.id ? null : hero.id)
        }
      >
        <div className="relative w-full h-56 flex">
          <div
            {...attributes}
            {...listeners}
            className="w-10 bg-black/20 flex justify-center items-center cursor-grab"
          >
            <GripVertical size={18} className="text-white opacity-60" />
          </div>

          <div className="relative flex-1">
            <Image
              src={hero.image_url}
              alt={hero.title}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[var(--background)] opacity-60 pointer-events-none" />

            <div className="absolute top-2 left-2 z-20 px-3 py-1 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-bold shadow-md">
              {index + 1}
            </div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 pointer-events-none">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {hero.title}
              </h2>
              <p className="text-sm mt-2 max-w-lg text-[var(--foreground)]">
                {hero.subtitle}
              </p>
            </div>
          </div>

          {activeHeroId === hero.id && (
            <div className="absolute inset-0 bg-black/70 flex justify-center items-center transition">
              <div className="flex flex-col gap-4 w-full max-w-[200px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="w-full px-4 py-2 rounded bg-[var(--accent)] text-[var(--background)] hover:brightness-110 transition"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="w-full px-4 py-2 rounded bg-red-600 text-white hover:brightness-110 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
