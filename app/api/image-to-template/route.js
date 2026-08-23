/* MotionHub — image → motion-site template.
   Sends a design screenshot to Claude's vision API and gets back a complete,
   ready-to-publish template record: title, category, tags, tier (auto-decided),
   gradient, description and a full master-prompt that rebuilds the design.

   The API key comes from the request body (the admin's own key, entered in the
   browser) and is used only for this one call — never stored, logged, or sent
   to Supabase. */

const SYSTEM = `You are MotionHub's template author. You are shown a screenshot of a website or app UI.

Produce ONE catalog entry that would let another AI rebuild that design from scratch.

Return ONLY a raw JSON object — no prose, no markdown fences — with exactly these keys:

{
  "id": kebab-case slug, 2-4 words, unique-sounding, no generic words like "website" alone,
  "title": "BRANDNAME — Short Descriptive Label" (invent a fitting brand name if none is visible),
  "category": one of "motion" | "coding" | "saas" | "agency" | "portfolio" | "ecommerce" | "ai",
  "tags": array of exactly 3 short lowercase tags,
  "tier": "free" or "premium",
  "gradient": [dark base hex, accent hex] sampled from the actual screenshot,
  "builders": subset of ["Claude","Cursor","v0","Lovable"],
  "description": one sentence, max 22 words, describing the design,
  "prompt": the full master prompt (see below)
}

TIER RULE — decide it yourself from the screenshot, do not ask:
- "premium" if the design is complex or commercially valuable: multi-section marketing
  site, dashboard/app UI, e-commerce, custom illustration, video/3D, or intricate layout.
- "free" if it is a single simple section, a basic landing hero, or a common pattern
  (plain pricing table, simple feature grid, basic contact page).

The "prompt" value must be a complete master prompt in this exact shape, as one string
with real newlines:

# BRANDNAME — Label (Master Prompt)

One paragraph describing what to build and the intended mood.

## Tech Stack (IMPORTANT: plain CSS only — NO Tailwind, NO CSS framework)
- HTML5 semantic layout.
- Hand-written CSS with :root custom properties. No utility classes, no build step.
- Google Fonts: (pick two that match the screenshot).
- Icons: Remix Icon CDN (https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css).
- Vanilla JavaScript.

## Palette
(exact hex values you can see in the screenshot, with what each is used for)

## Sections, in order
(numbered list — one item per visible section, describing layout, copy, imagery and
component detail precisely enough to rebuild it without seeing the image)

## Interactions & polish
(scroll reveals, hovers, responsive collapse behaviour, 60fps note, accessibility)

Output a single self-contained index.html (inline <style> + <script>).

Rules: plain CSS only, never Tailwind. Never TypeScript. Use only real, working image
URLs from images.unsplash.com. Be specific about layout and copy — vague prompts produce
vague rebuilds.`;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { apiKey, model, imageBase64, mediaType, notes } = body || {};
  if (!apiKey) return Response.json({ error: "Missing API key." }, { status: 400 });
  if (!imageBase64) return Response.json({ error: "No image provided." }, { status: 400 });

  const type = mediaType || "image/png";
  if (!/^image\/(png|jpeg|webp|gif)$/.test(type)) {
    return Response.json({ error: `Unsupported image type: ${type}. Use PNG, JPEG, WebP or GIF.` }, { status: 400 });
  }

  const userText = notes?.trim()
    ? `Analyse this design and produce the catalog entry. Extra direction from the admin: ${notes.trim()}`
    : "Analyse this design and produce the catalog entry.";

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-5",
        max_tokens: 8000,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: type, data: imageBase64 } },
              { type: "text", text: userText },
            ],
          },
        ],
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return Response.json({ error: data?.error?.message || "Claude API error." }, { status: r.status });
    }

    let text = (data.content || []).map((b) => b.text || "").join("").trim();
    // Strip markdown fences if the model added them anyway.
    text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "").trim();

    let tpl;
    try {
      tpl = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Claude did not return valid JSON. Try again, or add a note describing the design." },
        { status: 502 }
      );
    }

    // Normalise so the admin form can consume it directly.
    const CATS = ["motion", "coding", "saas", "agency", "portfolio", "ecommerce", "ai"];
    const slug = String(tpl.id || "")
      .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const hex = (v, fb) => (/^#[0-9a-f]{6}$/i.test(String(v)) ? v : fb);

    const clean = {
      id: slug || "untitled-template",
      title: String(tpl.title || "Untitled Template").trim(),
      category: CATS.includes(tpl.category) ? tpl.category : "motion",
      tags: Array.isArray(tpl.tags) ? tpl.tags.slice(0, 3).map((s) => String(s).toLowerCase().trim()) : [],
      tier: tpl.tier === "premium" ? "premium" : "free",
      gradient: [hex(tpl.gradient?.[0], "#0d0d14"), hex(tpl.gradient?.[1], "#6d5efc")],
      builders: Array.isArray(tpl.builders) && tpl.builders.length ? tpl.builders : ["Claude", "Cursor", "v0"],
      description: String(tpl.description || "").trim(),
      prompt: String(tpl.prompt || "").trim(),
    };

    if (!clean.prompt) {
      return Response.json({ error: "Claude returned an entry with no prompt text." }, { status: 502 });
    }

    return Response.json({ template: clean });
  } catch (e) {
    return Response.json({ error: e.message || "Request failed." }, { status: 500 });
  }
}
