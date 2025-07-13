import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TablesInsert } from "@/types/supabase";

type HeroBody = {
  title?: string;
  subtitle?: string;
  image_url: string;
  image_path: string;
};

function validateHeroBody(body: unknown): body is HeroBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "image_url" in body &&
    typeof (body as Record<string, unknown>).image_url === "string" &&
    "image_path" in body &&
    typeof (body as Record<string, unknown>).image_path === "string"
  );
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (!validateHeroBody(body)) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const { data: lastHero } = await supabase
    .from("hero_slides")
    .select("order")
    .order("order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (lastHero?.order ?? 0) + 1;
  const castBody = body as HeroBody;

  const payload: TablesInsert<"hero_slides"> = {
    title: castBody.title ?? "",
    subtitle: castBody.subtitle ?? "",
    image_url: castBody.image_url,
    image_path: castBody.image_path,
    order: nextOrder,
  };

  const { error } = await supabase.from("hero_slides").insert([payload]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Hero ID is required." },
      { status: 400 }
    );
  }

  const { data: hero, error: fetchError } = await supabase
    .from("hero_slides")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !hero) {
    return NextResponse.json(
      { error: fetchError?.message || "Hero not found." },
      { status: 404 }
    );
  }

  const { error: deleteError } = await supabase
    .from("hero_slides")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (hero.image_path) {
    const { error: storageError } = await supabase.storage
      .from("hero-images") // Ganti dengan nama bucket storage Anda khusus hero
      .remove([hero.image_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError.message);
    }
  }

  return NextResponse.json({ success: true });
}
