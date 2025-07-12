import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Pastikan hanya dipakai di server route
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are allowed." },
      { status: 400 }
    );
  }

  let imageBuffer: Buffer;
  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());

    imageBuffer = await sharp(inputBuffer)
      .resize({ width: 1920, height: 1080, fit: "cover" }) // Khusus untuk Hero 16:9
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image." },
      { status: 500 }
    );
  }

  const fileName = `hero-${Date.now()}.jpg`;

  const uploadResult = await supabase.storage
    .from("hero-images") // Ganti bucket sesuai kebutuhan
    .upload(fileName, imageBuffer, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadResult.error) {
    return NextResponse.json(
      { error: uploadResult.error.message },
      { status: 500 }
    );
  }

  const publicUrlResult = supabase.storage
    .from("hero-images")
    .getPublicUrl(fileName);

  return NextResponse.json({
    url: publicUrlResult.data.publicUrl,
    path: uploadResult.data.path,
  });
}
