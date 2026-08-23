"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/prompts";
import { PROMPTS as SEED_PROMPTS } from "@/lib/prompts";
import {
  isConfigured, signIn, signUp, signInWithGoogle, signOut,
  getUser, getProfile, getPromptsAdmin, addPrompt, updatePrompt, deletePrompt, upsertPrompts,
} from "@/lib/supabaseClient";
import { runPrompt, getSavedKey, saveKey } from "@/lib/runPrompt";
import { fileToBase64, imageToTemplate } from "@/lib/imageToTemplate";
import PreviewModal from "@/components/PreviewModal";

const MODELS = {
  claude: ["claude-sonnet-5", "claude-opus-5", "claude-fable-5", "claude-haiku-4-5-20251001"],
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4.1"],
};

const GOOGLE_SVG = (
  <svg viewBox="0 0 48 48" width="17" height="17" style={{ verticalAlign: "-3px" }} aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.9 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

const EMPTY_FORM = { id: "", title: "", category: "motion", tier: "free", tags: "", builders: "", g1: "#6d5efc", g2: "#00d4ff", description: "", prompt: "" };

export default function AdminPage() {
  const [phase, setPhase] = useState("loading"); // loading | needs-config | login | no-profile | not-admin | dashboard
  const [user, setUser] = useState(null);

  useEffect(() => { boot(); }, []);

  async function boot() {
    if (!isConfigured()) { setPhase("needs-config"); return; }
    const u = await getUser();
    if (!u) { setPhase("login"); return; }
    setUser(u);
    const profile = await getProfile();
    if (!profile) { setPhase("no-profile"); return; }
    if (!profile.is_admin) { setPhase("not-admin"); return; }
    setPhase("dashboard");
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" href="/"><span className="logo-dot" /> MotionHub</Link>
          <nav className="nav-links">
            <Link href="/#gallery">Prompts</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/admin">Admin</Link>
          </nav>
          <div className="nav-cta">
            <Link className="btn btn-ghost btn-sm" href="/">← Back to site</Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 26 }}>
            <h2>Admin</h2>
            <p>Add prompts to the live gallery. Only accounts with <code>is_admin</code> can write.</p>
          </div>

          {phase === "loading" && <p className="builders" style={{ textAlign: "center" }}>Loading…</p>}
          {phase === "needs-config" && <Notice title="Supabase isn't configured yet" body={<>Add your anon key in <code>lib/supabaseClient.js</code> or env vars, then reload.</>} />}
          {phase === "login" && <LoginCard onDone={boot} />}
          {phase === "no-profile" && (
            <Notice
              title="Profile not found"
              body={<>Did you run <code>supabase-schema.sql</code>? It creates the profiles table + signup trigger.<div style={{ marginTop: 16 }}><LogoutBtn onDone={boot} /></div></>}
            />
          )}
          {phase === "not-admin" && (
            <Notice
              title="You're signed in, but not an admin"
              body={
                <>
                  Signed in as <b>{user?.email}</b>. Ask the site owner to run:<br /><br />
                  <code>update public.profiles set is_admin = true, is_unlimited = true where email = &apos;{user?.email}&apos;;</code>
                  <br /><br />Then reload.
                  <div style={{ marginTop: 16 }}><LogoutBtn onDone={boot} /></div>
                </>
              }
            />
          )}
          {phase === "dashboard" && <Dashboard user={user} onLogout={boot} />}
        </div>
      </section>
    </>
  );
}

function Notice({ title, body }) {
  return (
    <div className="card in" style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="card-body"><h3>{title}</h3><p className="desc">{body}</p></div>
    </div>
  );
}

function LogoutBtn({ onDone }) {
  return <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); onDone(); }}>Log out</button>;
}

function LoginCard({ onDone }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState({ text: "", color: "#ff8a9c" });
  const [busy, setBusy] = useState(false);
  const [gBusy, setGBusy] = useState(false);

  async function submit(isIn) {
    if (!email || !pass) { setMsg({ text: "Enter email and password.", color: "#ff8a9c" }); return; }
    setBusy(true);
    try {
      const res = isIn ? await signIn(email, pass) : await signUp(email, pass);
      if (res.error) throw res.error;
      if (!isIn && res.data && !res.data.session) {
        setMsg({ text: "Check your email to confirm, then log in.", color: "#7dffb0" });
        setBusy(false); return;
      }
      onDone();
    } catch (e) {
      setMsg({ text: e.message || "Failed.", color: "#ff8a9c" });
      setBusy(false);
    }
  }

  async function google() {
    setGBusy(true);
    try {
      const r = await signInWithGoogle();
      if (r?.error) throw r.error;
    } catch (e) {
      setGBusy(false);
      setMsg({ text: e.message || "Google sign-in isn't enabled in Supabase yet.", color: "#ff8a9c" });
    }
  }

  return (
    <div className="card in" style={{ maxWidth: 420, margin: "0 auto" }}>
      <div className="card-body">
        <h3>Admin login</h3>
        <button className="btn btn-ghost google-btn" onClick={google} disabled={gBusy}>
          {gBusy ? "Redirecting to Google…" : <>{GOOGLE_SVG} Continue with Google</>}
        </button>
        <div className="auth-divider"><span className="line" />or<span className="line" /></div>
        <label className="builders">Email</label>
        <input className="fld" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit(true)} />
        <label className="builders">Password</label>
        <input className="fld" type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit(true)} />
        <p style={{ color: msg.color, minHeight: 18, fontSize: 14, margin: "8px 0 0" }}>{msg.text}</p>
        <div className="card-actions">
          <button className="btn btn-primary btn-sm" onClick={() => submit(true)} disabled={busy}>Log in</button>
          <button className="btn btn-ghost btn-sm" onClick={() => submit(false)} disabled={busy}>Create account</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [codeMode, setCodeMode] = useState(false);
  const [codeText, setCodeText] = useState("");
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState({ text: "", color: "var(--muted)" });

  // Live "Preview with AI" — runs whatever prompt text is currently in the form
  // (or the code-view JSON) through Claude/OpenAI and shows the actual rendered
  // result, animations and all, before saving.
  const [showRunPanel, setShowRunPanel] = useState(false);
  const [provider, setProvider] = useState("claude");
  const [model, setModel] = useState(MODELS.claude[0]);
  const [apiKey, setApiKey] = useState("");
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState("");
  const [resultHtml, setResultHtml] = useState("");
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Image → motion site: drop a design screenshot, Claude reads it and fills in
  // the whole template (including deciding free vs premium), ready to preview & publish.
  const [img, setImg] = useState(null);          // { base64, dataUrl, mediaType, name }
  const [imgNotes, setImgNotes] = useState("");
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState("");
  const [autoTier, setAutoTier] = useState("");  // tier Claude chose, for the badge

  useEffect(() => { loadList(); }, []);

  async function loadList() {
    const prompts = (await getPromptsAdmin()) || [];
    setList(prompts);
  }

  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function toObj(f) {
    return {
      id: f.id.trim(), title: f.title.trim(), category: f.category, tier: f.tier,
      tags: f.tags ? f.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
      builders: f.builders ? f.builders.split(",").map((s) => s.trim()).filter(Boolean) : [],
      gradient: [f.g1 || "#6d5efc", f.g2 || "#00d4ff"],
      description: f.description.trim(), prompt: f.prompt.trim(),
    };
  }
  function fromObj(p) {
    return {
      id: p.id || "", title: p.title || "", category: p.category || "motion", tier: p.tier || "free",
      tags: (p.tags || []).join(", "), builders: (p.builders || []).join(", "),
      g1: p.gradient?.[0] || "#6d5efc", g2: p.gradient?.[1] || "#00d4ff",
      description: p.description || "", prompt: p.prompt || "",
    };
  }

  function toggleCode() {
    if (!codeMode) setCodeText(JSON.stringify(toObj(form), null, 2));
    else {
      try { setForm(fromObj(JSON.parse(codeText))); }
      catch (e) { setMsg({ text: "Invalid JSON: " + e.message, color: "#ff8a9c" }); return; }
    }
    setCodeMode((v) => !v);
  }

  function currentPromptText() {
    if (codeMode) {
      try { return (JSON.parse(codeText).prompt || "").trim(); }
      catch { return ""; }
    }
    return form.prompt.trim();
  }

  async function pickImage(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) { setConvertError("That's not an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setConvertError("Image is over 5MB — please use a smaller screenshot."); return; }
    setConvertError("");
    try {
      const r = await fileToBase64(file);
      setImg({ ...r, name: file.name });
    } catch (e) { setConvertError(e.message); }
  }

  async function convertImage() {
    if (!img) { setConvertError("Choose a design screenshot first."); return; }
    const key = apiKey.trim() || getSavedKey("claude");
    if (!key) { setConvertError("Enter your Anthropic API key below first."); setShowRunPanel(true); return; }
    saveKey("claude", key);
    setApiKey(key);
    setConverting(true); setConvertError(""); setAutoTier("");
    try {
      const tpl = await imageToTemplate({
        apiKey: key,
        model: provider === "claude" ? model : MODELS.claude[0], // vision = Claude only
        imageBase64: img.base64, mediaType: img.mediaType, notes: imgNotes,
      });
      setForm(fromObj(tpl));
      setEditingId(null);
      setCodeMode(false);
      setAutoTier(tpl.tier);
      setMsg({ text: `Claude built "${tpl.title}" from your image and marked it ${tpl.tier.toUpperCase()}. Review it, preview it, then save.`, color: "#7dffb0" });
    } catch (e) {
      setConvertError(e.message || "Conversion failed.");
    } finally { setConverting(false); }
  }

  function switchProvider(pr) { setProvider(pr); setModel(MODELS[pr][0]); setApiKey(getSavedKey(pr)); }
  function openRunPanel() {
    const text = currentPromptText();
    if (!text) { setMsg({ text: "Write or paste a prompt first.", color: "#ff8a9c" }); return; }
    setApiKey(getSavedKey(provider));
    setRunError("");
    setShowRunPanel(true);
  }
  async function runPreview() {
    const text = currentPromptText();
    if (!text) { setRunError("No prompt text to run."); return; }
    if (!apiKey.trim()) { setRunError("Enter your API key first."); return; }
    saveKey(provider, apiKey.trim());
    setRunning(true); setRunError("");
    try {
      const html = await runPrompt({ provider, apiKey: apiKey.trim(), model, prompt: text });
      setResultHtml(html);
      setShowLivePreview(true);
    } catch (e) { setRunError(e.message || "Run failed."); }
    finally { setRunning(false); }
  }

  async function save() {
    let obj = toObj(form);
    if (codeMode) {
      try { obj = toObj(fromObj(JSON.parse(codeText))); }
      catch (e) { setMsg({ text: "Invalid JSON: " + e.message, color: "#ff8a9c" }); return; }
    }
    if (!obj.id || !obj.title || !obj.prompt) { setMsg({ text: "id, title and prompt are required.", color: "#ff8a9c" }); return; }
    try {
      if (editingId) {
        const patch = { ...obj };
        const res = await updatePrompt(editingId, patch);
        if (res.error) throw res.error;
        setMsg({ text: `Saved changes to "${obj.title}".`, color: "#7dffb0" });
      } else {
        const res = await addPrompt(obj);
        if (res.error) throw res.error;
        setMsg({ text: `Added "${obj.title}".`, color: "#7dffb0" });
      }
      resetForm();
      loadList();
    } catch (e) {
      setMsg({ text: e.message || "Save failed (are you admin? is the id unique?).", color: "#ff8a9c" });
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm(fromObj(p));
    setCodeMode(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setCodeMode(false);
  }

  async function del(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      const res = await deletePrompt(p.id);
      if (res.error) throw res.error;
      setMsg({ text: `Deleted "${p.title}".`, color: "#7dffb0" });
      if (editingId === p.id) resetForm();
      loadList();
    } catch (e) { setMsg({ text: e.message || "Delete failed.", color: "#ff8a9c" }); }
  }

  async function seed() {
    setMsg({ text: `Seeding ${SEED_PROMPTS.length} prompts…`, color: "var(--muted)" });
    try {
      const rows = SEED_PROMPTS.map((p) => ({
        id: p.id, title: p.title, category: p.category, tier: p.tier,
        tags: p.tags || [], builders: p.builders || [], gradient: p.gradient || [],
        description: p.description || "", prompt: p.prompt,
      }));
      const res = await upsertPrompts(rows);
      if (res.error) throw res.error;
      setMsg({ text: `Seeded ${rows.length} starter prompts.`, color: "#7dffb0" });
      loadList();
    } catch (e) { setMsg({ text: e.message || "Seed failed.", color: "#ff8a9c" }); }
  }

  const catOptions = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div className="builders">Signed in as <b>{user?.email}</b> · admin</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={seed}>⬆ Seed starter prompts</button>
          <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); onLogout(); }}>Log out</button>
        </div>
      </div>
      <p style={{ minHeight: 20, fontSize: 14, color: msg.color }}>{msg.text}</p>

      <div className="card in" style={{ maxWidth: 760, marginBottom: 20 }}>
        <div className="card-body">
          <h3 style={{ margin: "0 0 4px" }}>🖼 Image → motion site</h3>
          <p className="desc" style={{ margin: "0 0 16px" }}>
            Drop a design screenshot. Claude reads it, writes the full master prompt, picks the
            category and colours, and decides Free vs Premium on its own — then you preview and publish.
          </p>

          <label
            htmlFor="tpl-image"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); pickImage(e.dataTransfer.files?.[0]); }}
            style={{
              display: "block", border: "1px dashed var(--border)", borderRadius: 14, padding: img ? 12 : 30,
              textAlign: "center", cursor: "pointer", background: "var(--surface-2)", marginBottom: 12,
            }}
          >
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.dataUrl} alt="" style={{ maxHeight: 220, maxWidth: "100%", borderRadius: 10, margin: "0 auto" }} />
            ) : (
              <>
                <div style={{ fontSize: 26, marginBottom: 6 }}>⬆</div>
                <b style={{ fontSize: 14.5 }}>Drop a screenshot, or click to choose</b>
                <p className="builders" style={{ margin: "6px 0 0" }}>PNG, JPEG, WebP or GIF · up to 5MB</p>
              </>
            )}
          </label>
          <input
            id="tpl-image" type="file" accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: "none" }} onChange={(e) => pickImage(e.target.files?.[0])}
          />
          {img && (
            <p className="builders" style={{ margin: "0 0 12px" }}>
              {img.name} · <button className="btn btn-ghost btn-sm" style={{ padding: "2px 10px" }} onClick={() => { setImg(null); setAutoTier(""); }}>remove</button>
            </p>
          )}

          <Field
            label="Anything specific? (optional)"
            placeholder="e.g. call the brand Propertix, make the CTA gold"
            value={imgNotes} onChange={setImgNotes}
          />

          {convertError && <p style={{ color: "#ff8a9c", fontSize: 14, margin: "0 0 10px" }}>{convertError}</p>}

          <div className="card-actions">
            <button className="btn btn-primary" onClick={convertImage} disabled={converting || !img}>
              {converting ? "Claude is reading your image…" : "✨ Convert to motion site"}
            </button>
            {autoTier && (
              <span className={"badge " + (autoTier === "premium" ? "premium" : "free")}>
                Claude chose: {autoTier}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card in" style={{ maxWidth: 760 }}>
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: 0 }}>{editingId ? `Edit: ${form.title}` : "Write a new prompt"}</h3>
            <button className="btn btn-ghost btn-sm" onClick={toggleCode}>{codeMode ? "▤ Form view" : "⌨ Code view"}</button>
          </div>

          {!codeMode ? (
            <div>
              <Field label="Unique id (kebab-case)" placeholder="e.g. summit-video-hero" value={form.id} onChange={(v) => setField("id", v)} />
              <Field label="Title" placeholder="SUMMIT — Background Video Hero" value={form.title} onChange={(v) => setField("title", v)} />
              <label className="builders">Category</label>
              <select className="fld" value={form.category} onChange={(e) => setField("category", e.target.value)}>
                {catOptions.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <label className="builders">Tier</label>
              <select className="fld" value={form.tier} onChange={(e) => setField("tier", e.target.value)}>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <Field label="Tags (comma-separated)" placeholder="hero, video, travel" value={form.tags} onChange={(v) => setField("tags", v)} />
              <Field label="Builders (comma-separated)" placeholder="Claude, Cursor, v0" value={form.builders} onChange={(v) => setField("builders", v)} />
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}><Field label="Gradient 1" placeholder="#6d5efc" value={form.g1} onChange={(v) => setField("g1", v)} /></div>
                <div style={{ flex: 1 }}><Field label="Gradient 2" placeholder="#00d4ff" value={form.g2} onChange={(v) => setField("g2", v)} /></div>
              </div>
              <Area label="Short description" placeholder="One sentence describing the design." rows={2} value={form.description} onChange={(v) => setField("description", v)} />
              <Area label="The prompt text (master-prompt format)" placeholder="Paste the full prompt users will copy…" rows={10} value={form.prompt} onChange={(v) => setField("prompt", v)} />
            </div>
          ) : (
            <div>
              <label className="builders">Prompt as JSON — edit and apply</label>
              <textarea
                className="fld" rows={16} spellCheck={false}
                style={{ fontFamily: "ui-monospace,Menlo,Consolas,monospace", fontSize: 13 }}
                value={codeText} onChange={(e) => setCodeText(e.target.value)}
              />
            </div>
          )}

          <div className="card-actions" style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={save}>{editingId ? "Save changes" : "Add prompt"}</button>
            <button className="btn btn-ghost btn-sm" onClick={openRunPanel}>👁 Preview with AI</button>
            {editingId && <button className="btn btn-ghost btn-sm" onClick={resetForm}>Cancel edit</button>}
          </div>

          {showRunPanel && (
            <div className="prompt-box" style={{ marginTop: 16 }}>
              <label className="builders">Provider</label>
              <div style={{ display: "flex", gap: 8, margin: "6px 0 14px" }}>
                <button className={"chip" + (provider === "claude" ? " active" : "")} onClick={() => switchProvider("claude")}>Claude</button>
                <button className={"chip" + (provider === "openai" ? " active" : "")} onClick={() => switchProvider("openai")}>OpenAI</button>
              </div>
              <label className="builders">Model</label>
              <select className="fld" value={model} onChange={(e) => setModel(e.target.value)}>
                {MODELS[provider].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <label className="builders">Your {provider === "claude" ? "Anthropic" : "OpenAI"} API key</label>
              <input
                className="fld" type="password" placeholder={provider === "claude" ? "sk-ant-…" : "sk-…"}
                value={apiKey} onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="builders" style={{ margin: "-8px 0 12px" }}>
                Renders exactly what's currently in {codeMode ? "the code view's" : "the form's"} prompt field — with all
                animations/effects — before you save it live. Stored only in your browser.
              </p>
              {runError && <p style={{ color: "#ff8a9c", fontSize: 14, margin: "0 0 10px" }}>{runError}</p>}
              <div className="card-actions">
                <button className="btn btn-primary btn-sm" onClick={runPreview} disabled={running}>
                  {running ? "Running…" : "▶ Run & preview"}
                </button>
                {resultHtml && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowLivePreview(true)}>👁 View last result</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => setShowRunPanel(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLivePreview && resultHtml && (
        <PreviewModal html={resultHtml} title={form.title || "Preview"} onClose={() => setShowLivePreview(false)} />
      )}

      <div style={{ marginTop: 24 }}>
        {list.length === 0 ? (
          <p className="builders">No prompts in the database yet. Use &quot;Seed starter prompts&quot; or write one above.</p>
        ) : (
          <>
            <h3 style={{ margin: "0 0 12px" }}>In database ({list.length})</h3>
            <div className="grid">
              {list.map((p) => {
                const grad = `linear-gradient(135deg,${p.gradient[0]},${p.gradient[1]})`;
                return (
                  <article className="card in" key={p.id}>
                    <div className="card-preview" style={{ height: 64, background: grad }}>
                      <span />
                      <span className={"badge " + (p.tier === "premium" ? "premium" : "free")}>{p.tier === "premium" ? "Premium" : "Free"}</span>
                    </div>
                    <div className="card-body">
                      <h3 style={{ fontSize: "1rem" }}>{p.title}</h3>
                      <p className="desc" style={{ fontSize: 12.5 }}>{p.id} · {p.category}</p>
                      <div className="card-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: "#ff8a9c" }} onClick={() => del(p)}>Delete</button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Field({ label, placeholder, value, onChange }) {
  return (
    <>
      <label className="builders">{label}</label>
      <input className="fld" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </>
  );
}
function Area({ label, placeholder, rows, value, onChange }) {
  return (
    <>
      <label className="builders">{label}</label>
      <textarea className="fld" rows={rows} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </>
  );
}
