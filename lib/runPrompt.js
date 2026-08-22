"use client";

/* Calls the /api/run-prompt proxy with the user's own API key.
   The key is read from / saved to localStorage in the browser only —
   it never touches Supabase and is sent to our server just for this one request. */

export function getSavedKey(provider) {
  try { return localStorage.getItem(`mh_api_key_${provider}`) || ""; } catch { return ""; }
}
export function saveKey(provider, key) {
  try { localStorage.setItem(`mh_api_key_${provider}`, key); } catch {}
}

export async function runPrompt({ provider, apiKey, model, prompt }) {
  const res = await fetch("/api/run-prompt", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ provider, apiKey, model, prompt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data.html;
}
