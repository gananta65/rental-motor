import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TablesInsert } from "@/types/supabase";

interface BikePayload {
  name?: string;
  type?: string | null;
  year?: number | string | null;
  stock?: number | string | null;
  price_daily?: number | string | null;
  price_weekly?: number | string | null;
  price_monthly?: number | string | null;
  image_url?: string | null;
  image_path?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await req.json();

    const isBikeArray = (input: unknown): input is BikePayload[] =>
      Array.isArray(input) &&
      input.every((item) => typeof item === "object" && item !== null);

    const bikesInput: BikePayload[] = isBikeArray(
      (body as { bikes?: unknown }).bikes
    )
      ? (body as { bikes: BikePayload[] }).bikes
      : [body as BikePayload];

    const formattedBikes: TablesInsert<"bikes">[] = bikesInput.map((bike) => ({
      name: bike.name ?? "",
      type: bike.type ?? null,
      year:
        bike.year !== undefined && bike.year !== null
          ? Number(bike.year)
          : null,
      stock:
        bike.stock !== undefined && bike.stock !== null
          ? Number(bike.stock)
          : 0,
      price_daily:
        bike.price_daily !== undefined && bike.price_daily !== null
          ? Number(bike.price_daily)
          : null,
      price_weekly:
        bike.price_weekly !== undefined && bike.price_weekly !== null
          ? Number(bike.price_weekly)
          : null,
      price_monthly:
        bike.price_monthly !== undefined && bike.price_monthly !== null
          ? Number(bike.price_monthly)
          : null,
      image_url: bike.image_url ?? null,
      image_path: bike.image_path ?? null,
    }));

    const insertResult = await supabase.from("bikes").insert(formattedBikes);

    if (insertResult.error) {
      return NextResponse.json(
        { error: insertResult.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
