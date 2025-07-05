// app/api/bikes/update/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    const {
      id,
      name,
      type,
      year,
      stock,
      price_daily,
      price_weekly,
      price_monthly,
      image_url,
      image_path,
    } = data;

    // Basic validation
    if (!id || !name || !type || !image_url || !image_path) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Type check
    const yearNum = Number(year);
    const stockNum = Number(stock);
    const daily = Number(price_daily);
    const weekly = price_weekly ? Number(price_weekly) : null;
    const monthly = price_monthly ? Number(price_monthly) : null;

    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear + 1) {
      return NextResponse.json(
        { error: "Year must be between 2000 and next year" },
        { status: 400 }
      );
    }

    if (isNaN(stockNum) || stockNum < 1) {
      return NextResponse.json(
        { error: "Stock must be at least 1" },
        { status: 400 }
      );
    }

    if (isNaN(daily) || daily < 10000) {
      return NextResponse.json(
        { error: "Daily price must be a number ≥ Rp 10.000" },
        { status: 400 }
      );
    }

    if (weekly !== null && (isNaN(weekly) || weekly < 50000)) {
      return NextResponse.json(
        { error: "Weekly price must be ≥ Rp 50.000 or left blank" },
        { status: 400 }
      );
    }

    if (monthly !== null && (isNaN(monthly) || monthly < 100000)) {
      return NextResponse.json(
        { error: "Monthly price must be ≥ Rp 100.000 or left blank" },
        { status: 400 }
      );
    }

    try {
      new URL(image_url);
    } catch {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    // Pastikan data motor dengan ID ini memang ada (opsional, untuk ketepatan)
    const { data: existing, error: findError } = await supabase
      .from("bikes")
      .select("id")
      .eq("id", id)
      .single();

    if (findError || !existing) {
      return NextResponse.json({ error: "Bike not found" }, { status: 404 });
    }

    // Update ke Supabase
    const { error } = await supabase
      .from("bikes")
      .update({
        name,
        type,
        year: yearNum,
        stock: stockNum,
        price_daily: daily,
        price_weekly: weekly,
        price_monthly: monthly,
        image_url,
        image_path,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Bike updated successfully" });
  } catch (error) {
    console.error("PUT /api/bikes/update error:", error);
    return NextResponse.json(
      { error: "Invalid request body or server error." },
      { status: 500 }
    );
  }
}
