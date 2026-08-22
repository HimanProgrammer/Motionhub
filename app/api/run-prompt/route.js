/* MotionHub — server-side proxy that runs a prompt against Claude or OpenAI.
   The API key comes from the request body (the user's own key, entered in their browser)
   and is used only for this one call — never stored, never logged, never sent to Supabase. */

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { provider, apiKey, model, prompt } = body || {};

  if (!apiKey) return Response.json({ error: "Missing API key." }, { status: 400 });
  if (!prompt) return Response.json({ error: "Missing prompt." }, { status: 400 });

  const SYSTEM =
    "You output ONLY the complete, self-contained HTML file requested — no explanation, no markdown code fences, just raw HTML starting with <!DOCTYPE html>.";

  try {
    let text = "";

    if (provider === "claude") {
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
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await r.json();
      if (!r.ok) return Response.json({ error: data?.error?.message || "Claude API error." }, { status: r.status });
      text = (data.content || []).map((b) => b.text || "").join("");
    } else if (provider === "openai") {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: model || "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: prompt },
          ],
        }),
      });
      const data = await r.json();
      if (!r.ok) return Response.json({ error: data?.error?.message || "OpenAI API error." }, { status: r.status });
      text = data.choices?.[0]?.message?.content || "";
    } else {
      return Response.json({ error: "Unknown provider." }, { status: 400 });
    }

    // Strip markdown fences if the model added them anyway.
    const html = text.replace(/^```(?:html)?\s*\n?/i, "").replace(/\n?```\s*$/, "").trim();
    if (!html) return Response.json({ error: "The model returned an empty response." }, { status: 502 });

    return Response.json({ html });
  } catch (e) {
    return Response.json({ error: e.message || "Request failed." }, { status: 500 });
  }
}
