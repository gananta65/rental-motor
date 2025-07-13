import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID parameter required." },
      { status: 400 }
    );
  }

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
      { error: "Invalid JSON format." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("title" in body) ||
    !("image_url" in body) ||
    !("image_path" in body)
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const { title, subtitle, image_url, image_path } = body as {
    title: string;
    subtitle?: string;
    image_url: string;
    image_path: string;
  };

  const { data: existingHero, error: fetchError } = await supabase
    .from("hero_slides")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existingHero) {
    return NextResponse.json(
      { error: fetchError?.message || "Hero not found." },
      { status: 404 }
    );
  }

  if (existingHero.image_path && existingHero.image_path !== image_path) {
    const { error: storageError } = await supabase.storage
      .from("hero-images")
      .remove([existingHero.image_path]);

    if (storageError) {
      console.error(
        "Storage delete error:",
        storageError.message,
        existingHero.image_path
      );
    }
  }

  const { error: updateError } = await supabase
    .from("hero_slides")
    .update({
      title,
      subtitle: subtitle ?? "",
      image_url,
      image_path,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
