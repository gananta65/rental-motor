import Image from "next/image";

export default function BikePreviewCard({
  imageUrl,
  bikeName,
  priceDaily,
}: {
  imageUrl: string;
  bikeName: string;
  priceDaily: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border shadow w-full">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={imageUrl}
          alt="Bike Preview"
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 text-sm">
        <h3 className="text-lg font-semibold">{bikeName}</h3>
        <p className="text-base font-bold mt-1">Rp {priceDaily} / day</p>
      </div>
    </div>
  );
}
