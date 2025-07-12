import Image from "next/image";

export function HeroPreviewCard({
  imageUrl,
  title,
  subtitle,
}: {
  imageUrl: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full max-w-[90vw] sm:max-w-4xl mx-auto">
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border shadow bg-[var(--background)] text-[var(--foreground)]">
        <Image
          src={imageUrl}
          alt={title ?? "Hero Preview"}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay warna mengikuti tema */}
        <div className="absolute inset-0 bg-[var(--background)] opacity-60" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            {title ?? "Hero Title"}
          </h2>
          <p className="text-sm mt-2 max-w-lg text-[var(--foreground)]">
            {subtitle ?? "Hero subtitle here"}
          </p>
        </div>
      </div>
    </div>
  );
}
