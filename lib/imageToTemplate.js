"use client";

/* Reads an image File into base64 and asks /api/image-to-template for a complete
   template record (title, category, auto-decided tier, gradient, master prompt). */

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result);
      const comma = s.indexOf(",");
      resolve({ base64: comma >= 0 ? s.slice(comma + 1) : s, dataUrl: s, mediaType: file.type });
    };
    fr.onerror = () => reject(new Error("Could not read that file."));
    fr.readAsDataURL(file);
  });
}

export async function imageToTemplate({ apiKey, model, imageBase64, mediaType, notes }) {
  const res = await fetch("/api/image-to-template", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ apiKey, model, imageBase64, mediaType, notes }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data.template;
}
