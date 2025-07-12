import EditBikeForm from "@components/EditBike";
import type { Metadata } from "next";

// ✅ HARUS async dan await params (Next.js 15+)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Motor ${id}`,
  };
}

// ✅ Gunakan ENV BASE URL, bukan headers
export default async function EditBikePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/bikes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bike data.");
  }

  const bike = await res.json();

  return <EditBikeForm initialData={bike} />;
}
