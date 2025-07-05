// utils/compressImage.ts
import imageCompression from "browser-image-compression";

export async function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.8
): Promise<File> {
  const options = {
    maxWidthOrHeight: maxWidth,
    initialQuality: quality,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], `${Date.now()}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (error) {
    throw new Error("Image compression failed: " + (error as Error).message);
  }
}
