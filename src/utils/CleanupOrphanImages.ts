// utils/cleanupOrphanImages.ts

export function trackUploadedImage(path: string) {
  if (!path) return;
  const saved = JSON.parse(
    localStorage.getItem("temp_uploaded_images") || "[]"
  );
  localStorage.setItem(
    "temp_uploaded_images",
    JSON.stringify([...saved, path])
  );
}

export function clearUploadedImage(path: string) {
  if (!path) return;
  const saved = JSON.parse(
    localStorage.getItem("temp_uploaded_images") || "[]"
  );
  const updated = saved.filter((p: string) => p !== path);
  localStorage.setItem("temp_uploaded_images", JSON.stringify(updated));
}

export async function cleanupOrphanImages(existingPaths: string[]) {
  const saved = JSON.parse(
    localStorage.getItem("temp_uploaded_images") || "[]"
  );
  const toDelete = saved.filter(
    (path: string) => !existingPaths.includes(path)
  );

  await Promise.all(
    toDelete.map(async (path: string) => {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    })
  );

  localStorage.removeItem("temp_uploaded_images");
}

export async function deleteImageByPath(path: string) {
  if (!path) return;

  await fetch("/api/delete-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
}
