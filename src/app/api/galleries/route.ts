import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { TablesInsert } from "@/types/supabase";

type GalleryItem = {
  image_url: string;
  image_path: string;
};

type DeleteBody = {
  ids: string[];
  paths: string[];
};

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No images uploaded." }, { status: 400 });
  }

  const uploads: GalleryItem[] = await Promise.all(
    files.map(async (file) => {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("galleries")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("galleries")
        .getPublicUrl(fileName);

      return {
        image_url: publicUrlData.publicUrl,
        image_path: fileName,
      };
    })
  );

  const { error: insertError } = await supabase
    .from("galleries")
    .insert(uploads as TablesInsert<"galleries">[]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

function isValidDeleteBody(body: unknown): body is DeleteBody {
  if (typeof body !== "object" || body === null) return false;
  const maybe = body as Partial<DeleteBody>;
  return (
    Array.isArray(maybe.ids) &&
    Array.isArray(maybe.paths) &&
    maybe.ids.every((id) => typeof id === "string") &&
    maybe.paths.every((path) => typeof path === "string")
  );
}

export async function DELETE(req: NextRequest) {
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

  if (!isValidDeleteBody(body)) {
    return NextResponse.json(
      { error: "Invalid body format." },
      { status: 400 }
    );
  }

  const { ids, paths } = body;

  const { error: deleteError } = await supabase
    .from("galleries")
    .delete()
    .in("id", ids);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const { error: storageError } = await supabase.storage
    .from("galleries")
    .remove(paths);
  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
