export async function prepareImageWithPadding(
  base64: string,
  padding = 300
): Promise<string> {
  const img = await createImage(base64);
  const canvas = document.createElement("canvas");
  canvas.width = img.width + padding * 2;
  canvas.height = img.height + padding * 2;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create canvas");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, padding, padding);

  return canvas.toDataURL("image/jpeg");
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}
