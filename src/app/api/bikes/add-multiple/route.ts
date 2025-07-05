import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TablesInsert } from "@/types/supabase";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: authError?.message || "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  if (!Array.isArray(body.bikes)) {
    return NextResponse.json({ error: "Invalid bikes data" }, { status: 400 });
  }

  const formattedBikes: TablesInsert<"bikes">[] = body.bikes.map(
    (bike: Partial<TablesInsert<"bikes">>) => ({
      name: bike.name ?? "",
      type: bike.type ?? null,
      year: bike.year ? Number(bike.year) : null,
      stock: bike.stock ? Number(bike.stock) : 0,
      price_daily: bike.price_daily ? Number(bike.price_daily) : null,
      price_weekly: bike.price_weekly ? Number(bike.price_weekly) : null,
      price_monthly: bike.price_monthly ? Number(bike.price_monthly) : null,
      image_url: bike.image_url ?? null,
      image_path: bike.image_path ?? null,
    })
  );

  const { error } = await supabase.from("bikes").insert(formattedBikes);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
