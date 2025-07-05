// app/api/bikes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase"; // Pastikan path-nya benar

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET handler
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("bikes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Bike not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

// DELETE handler
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Ambil image_path sebelum delete
  const { data: bike, error: fetchError } = await supabase
    .from("bikes")
    .select("image_path")
    .eq("id", id)
    .single();

  if (fetchError || !bike) {
    return NextResponse.json({ error: "Bike not found" }, { status: 404 });
  }

  // Hapus image dari storage
  if (bike.image_path) {
    const { error: storageError } = await supabase.storage
      .from("bike-images")
      .remove([bike.image_path]);

    if (storageError) {
      console.error("Failed to delete image:", storageError.message);
    }
  }

  // Hapus row dari tabel
  const { error: deleteError } = await supabase
    .from("bikes")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Bike deleted successfully" });
}
