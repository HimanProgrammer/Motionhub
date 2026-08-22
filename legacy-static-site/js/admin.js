/* PromptMotion — admin dashboard. Write / edit / delete prompts + raw code editor.
   Requires config.js, supabase-client.js, prompts.js. Admin accounts only (RLS enforced). */
(function () {
  "use strict";

  var root = document.getElementById("admin-root");
  var editingId = null;   // null = creating a new prompt; else = editing that id
  var cache = [];         // last loaded prompt list

  var GOOGLE_SVG =
    '<svg viewBox="0 0 48 48" width="17" height="17" style="vertical-align:-3px" aria-hidden="true">' +
    '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>' +
    '<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>' +
    '<path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"/>' +
    '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.9 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z"/>' +
    "</svg>";

  function show(html) { root.innerHTML = html; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(id) { return document.getElementById(id); }
  function val(id) { var e = el(id); return e ? e.value.trim() : ""; }
  function toList(id) { return val(id) ? val(id).split(",").map(function (s) { return s.trim(); }).filter(Boolean) : []; }

  boot();

  async function boot() {
    if (!(window.PM && window.PM.isConfigured())) {
      show(notice("Supabase isn't configured yet", "Add your anon key in <code>js/config.js</code>, then reload."));
      return;
    }
    var user = await window.PM.getUser();
    if (!user) return renderLogin();
    var profile = await window.PM.getProfile();
    if (!profile) {
      show(notice("Profile not found", "Did you run <code>supabase-schema.sql</code>? It creates the profiles table + signup trigger.<br><br>" +
        '<button class="btn btn-ghost btn-sm" id="logout">Log out</button>'));
      bindLogout(); return;
    }
    if (!profile.is_admin) {
      show(notice("You're signed in, but not an admin",
        "Signed in as <b>" + esc(user.email) + "</b>. In Supabase SQL editor run:<br><br>" +
        "<code>update public.profiles set is_admin = true, is_unlimited = true where email = '" + esc(user.email) + "';</code><br><br>" +
        "Then reload." + '<div style="margin-top:16px"><button class="btn btn-ghost btn-sm" id="logout">Log out</button></div>'));
      bindLogout(); return;
    }
    renderDashboard(user);
  }

  function notice(title, body) {
    return '<div class="card in" style="opacity:1;transform:none;max-width:620px;margin:0 auto">' +
      '<div class="card-body"><h3>' + esc(title) + "</h3><p class='desc'>" + body + "</p></div></div>";
  }
  function bindLogout() {
    var b = el("logout");
    if (b) b.addEventListener("click", async function () { await window.PM.signOut(); location.reload(); });
  }

  /* ---------------- login ---------------- */
  function renderLogin() {
    show(
      '<div class="card in" style="opacity:1;transform:none;max-width:420px;margin:0 auto"><div class="card-body">' +
        "<h3>Admin login</h3>" +
        '<button class="btn btn-ghost" id="google" style="width:100%;justify-content:center;margin:6px 0 14px">' + GOOGLE_SVG + " Continue with Google</button>" +
        '<div style="display:flex;align-items:center;gap:10px;color:var(--muted);font-size:13px;margin-bottom:12px"><span style="flex:1;height:1px;background:var(--border)"></span>or<span style="flex:1;height:1px;background:var(--border)"></span></div>' +
        '<label class="builders">Email</label><input id="email" type="email" class="fld" />' +
        '<label class="builders">Password</label><input id="pass" type="password" class="fld" />' +
        '<p id="msg" style="color:#ff8a9c;min-height:18px;font-size:14px;margin:8px 0 0"></p>' +
        '<div class="card-actions"><button class="btn btn-primary btn-sm" id="go">Log in</button>' +
        '<button class="btn btn-ghost btn-sm" id="signup">Create account</button></div>' +
      "</div></div>"
    );
    styleFields();
    el("go").addEventListener("click", function () { submit(true); });
    el("signup").addEventListener("click", function () { submit(false); });
    el("google").addEventListener("click", async function () {
      var g = el("google"); g.disabled = true; g.innerHTML = "Redirecting to Google…";
      try { var r = await window.PM.signInWithGoogle(); if (r && r.error) throw r.error; }
      catch (e) { g.disabled = false; g.innerHTML = GOOGLE_SVG + " Continue with Google"; el("msg").textContent = e.message || "Google sign-in isn't enabled in Supabase yet."; }
    });
    root.querySelectorAll("input").forEach(function (i) { i.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(true); }); });
    async function submit(isIn) {
      var email = val("email"), pass = val("pass"), msg = el("msg");
      if (!email || !pass) { msg.textContent = "Enter email and password."; return; }
      try {
        var res = isIn ? await window.PM.signIn(email, pass) : await window.PM.signUp(email, pass);
        if (res.error) throw res.error;
        if (!isIn && res.data && !res.data.session) { msg.style.color = "#7dffb0"; msg.textContent = "Check your email to confirm, then log in."; return; }
        location.reload();
      } catch (e) { msg.style.color = "#ff8a9c"; msg.textContent = e.message || "Failed."; }
    }
  }

  /* ---------------- dashboard ---------------- */
  function renderDashboard(user) {
    show(
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px">' +
        '<div class="builders">Signed in as <b>' + esc(user.email) + "</b> · admin</div>" +
        '<div style="display:flex;gap:10px"><button class="btn btn-ghost btn-sm" id="seed">⬆ Seed starter prompts</button>' +
        '<button class="btn btn-ghost btn-sm" id="logout">Log out</button></div></div>' +
      '<p id="admin-msg" style="min-height:20px;font-size:14px;color:var(--muted)"></p>' +

      '<div class="card in" style="opacity:1;transform:none;max-width:760px"><div class="card-body">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">' +
          '<h3 id="form-title" style="margin:0">Write a new prompt</h3>' +
          '<button class="btn btn-ghost btn-sm" id="toggle-code">⌨ Code view</button></div>' +

        '<div id="fields">' +
          field("id", "Unique id (kebab-case)", "e.g. summit-video-hero") +
          field("title", "Title", "SUMMIT — Background Video Hero") +
          selectRow() + tierRow() +
          field("tags", "Tags (comma-separated)", "hero, video, travel") +
          field("builders", "Builders (comma-separated)", "Claude, Cursor, v0") +
          '<div style="display:flex;gap:12px">' +
            '<div style="flex:1">' + field("g1", "Gradient 1", "#6d5efc") + "</div>" +
            '<div style="flex:1">' + field("g2", "Gradient 2", "#00d4ff") + "</div></div>" +
          area("description", "Short description", "One sentence describing the design.", 2) +
          area("prompt", "The prompt text (master-prompt format)", "Paste the full prompt users will copy…", 10) +
        "</div>" +

        '<div id="code-wrap" style="display:none">' +
          '<label class="builders">Prompt as JSON — edit and apply</label>' +
          '<textarea id="codebox" class="fld" rows="16" spellcheck="false" style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px"></textarea>' +
          '<div class="card-actions"><button class="btn btn-ghost btn-sm" id="code-apply">Apply code → fields</button></div>' +
        "</div>" +

        '<div class="card-actions" style="margin-top:8px">' +
          '<button class="btn btn-primary" id="save">Add prompt</button>' +
          '<button class="btn btn-ghost btn-sm" id="cancel" style="display:none">Cancel edit</button></div>' +
      "</div></div>" +

      '<div id="list" style="margin-top:24px"></div>'
    );
    styleFields();
    bindLogout();
    el("seed").addEventListener("click", seedPrompts);
    el("save").addEventListener("click", save);
    el("cancel").addEventListener("click", resetForm);
    el("toggle-code").addEventListener("click", toggleCode);
    el("code-apply").addEventListener("click", applyCode);
    loadList();
  }

  function field(id, label, ph) { return '<label class="builders">' + esc(label) + '</label><input id="' + id + '" class="fld" placeholder="' + esc(ph) + '" />'; }
  function area(id, label, ph, rows) { return '<label class="builders">' + esc(label) + '</label><textarea id="' + id + '" class="fld" rows="' + (rows || 2) + '" placeholder="' + esc(ph) + '"></textarea>'; }
  function selectRow() {
    var opts = (window.CATEGORIES || []).filter(function (c) { return c.id !== "all"; })
      .map(function (c) { return '<option value="' + c.id + '">' + esc(c.label) + "</option>"; }).join("");
    return '<label class="builders">Category</label><select id="category" class="fld">' + opts + "</select>";
  }
  function tierRow() { return '<label class="builders">Tier</label><select id="tier" class="fld"><option value="free">Free</option><option value="premium">Premium</option></select>'; }

  /* ---------------- form data <-> object ---------------- */
  function gather() {
    return {
      id: val("id"), title: val("title"), category: val("category"), tier: val("tier"),
      tags: toList("tags"), builders: toList("builders"),
      gradient: [val("g1") || "#6d5efc", val("g2") || "#00d4ff"],
      description: val("description"), prompt: val("prompt"),
    };
  }
  function fill(p) {
    p = p || {};
    setV("id", p.id); setV("title", p.title); setV("category", p.category || "motion"); setV("tier", p.tier || "free");
    setV("tags", (p.tags || []).join(", ")); setV("builders", (p.builders || []).join(", "));
    setV("g1", (p.gradient && p.gradient[0]) || "#6d5efc"); setV("g2", (p.gradient && p.gradient[1]) || "#00d4ff");
    setV("description", p.description || ""); setV("prompt", p.prompt || "");
  }
  function setV(id, v) { var e = el(id); if (e) e.value = v == null ? "" : v; }

  /* ---------------- code editor ---------------- */
  function toggleCode() {
    var codeWrap = el("code-wrap"), fields = el("fields");
    if (codeWrap.style.display === "none") {
      el("codebox").value = JSON.stringify(gather(), null, 2);
      codeWrap.style.display = ""; fields.style.display = "none";
      el("toggle-code").textContent = "▤ Form view";
    } else {
      codeWrap.style.display = "none"; fields.style.display = "";
      el("toggle-code").textContent = "⌨ Code view";
    }
  }
  function applyCode() {
    var msg = el("admin-msg");
    try {
      var obj = JSON.parse(el("codebox").value);
      fill(obj);
      el("code-wrap").style.display = "none"; el("fields").style.display = "";
      el("toggle-code").textContent = "⌨ Code view";
      msg.style.color = "#7dffb0"; msg.textContent = "Applied code to the form.";
    } catch (e) { msg.style.color = "#ff8a9c"; msg.textContent = "Invalid JSON: " + e.message; }
  }

  /* ---------------- CRUD ---------------- */
  async function save() {
    var msg = el("admin-msg");
    // If the code view is open, apply it first so nothing is lost.
    if (el("code-wrap").style.display !== "none") applyCode();
    var p = gather();
    if (!p.id || !p.title || !p.prompt) { msg.style.color = "#ff8a9c"; msg.textContent = "id, title and prompt are required."; return; }
    try {
      var res;
      if (editingId) {
        var patch = { title: p.title, category: p.category, tier: p.tier, tags: p.tags, builders: p.builders, gradient: p.gradient, description: p.description, prompt: p.prompt };
        // allow changing the id too
        if (p.id !== editingId) patch.id = p.id;
        res = await window.PM.updatePrompt(editingId, patch);
        if (res.error) throw res.error;
        msg.style.color = "#7dffb0"; msg.textContent = "Saved changes to “" + p.title + "”.";
      } else {
        res = await window.PM.addPrompt(p);
        if (res.error) throw res.error;
        msg.style.color = "#7dffb0"; msg.textContent = "Added “" + p.title + "”.";
      }
      resetForm();
      loadList();
    } catch (e) { msg.style.color = "#ff8a9c"; msg.textContent = e.message || "Save failed (are you admin? is the id unique?)."; }
  }

  function startEdit(id) {
    var p = cache.find(function (x) { return x.id === id; });
    if (!p) return;
    editingId = id;
    fill(p);
    el("form-title").textContent = "Edit: " + p.title;
    el("save").textContent = "Save changes";
    el("cancel").style.display = "";
    el("code-wrap").style.display = "none"; el("fields").style.display = "";
    el("toggle-code").textContent = "⌨ Code view";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    editingId = null;
    fill({});
    el("form-title").textContent = "Write a new prompt";
    el("save").textContent = "Add prompt";
    el("cancel").style.display = "none";
  }

  async function del(id, title) {
    if (!window.confirm('Delete "' + title + '"? This cannot be undone.')) return;
    var msg = el("admin-msg");
    try {
      var res = await window.PM.deletePrompt(id);
      if (res.error) throw res.error;
      msg.style.color = "#7dffb0"; msg.textContent = "Deleted “" + title + "”.";
      if (editingId === id) resetForm();
      loadList();
    } catch (e) { msg.style.color = "#ff8a9c"; msg.textContent = e.message || "Delete failed."; }
  }

  async function seedPrompts() {
    var msg = el("admin-msg");
    if (!window.PROMPTS || !window.PROMPTS.length) { msg.textContent = "No starter prompts found."; return; }
    msg.style.color = "var(--muted)"; msg.textContent = "Seeding " + window.PROMPTS.length + " prompts…";
    try {
      var rows = window.PROMPTS.map(function (p) {
        return { id: p.id, title: p.title, category: p.category, tier: p.tier, tags: p.tags || [], builders: p.builders || [], gradient: p.gradient || [], description: p.description || "", prompt: p.prompt };
      });
      var res = await window.PM.upsertPrompts(rows);
      if (res.error) throw res.error;
      msg.style.color = "#7dffb0"; msg.textContent = "Seeded " + rows.length + " starter prompts.";
      loadList();
    } catch (e) { msg.style.color = "#ff8a9c"; msg.textContent = e.message || "Seed failed."; }
  }

  async function loadList() {
    var wrap = el("list");
    if (!wrap) return;
    var prompts = await window.PM.getPrompts();
    cache = prompts || [];
    if (!cache.length) { wrap.innerHTML = '<p class="builders">No prompts in the database yet. Use “Seed starter prompts” or write one above.</p>'; return; }
    wrap.innerHTML = '<h3 style="margin:0 0 12px">In database (' + cache.length + ")</h3>" +
      '<div class="grid">' + cache.map(function (p) {
        var grad = "linear-gradient(135deg," + p.gradient[0] + "," + p.gradient[1] + ")";
        var badge = p.tier === "premium" ? '<span class="badge premium">Premium</span>' : '<span class="badge free">Free</span>';
        return '<article class="card in" style="opacity:1;transform:none">' +
          '<div class="card-preview" style="height:64px;background:' + grad + '"><span></span>' + badge + "</div>" +
          '<div class="card-body"><h3 style="font-size:1rem">' + esc(p.title) + '</h3>' +
          '<p class="desc" style="font-size:12.5px">' + esc(p.id) + " · " + esc(p.category) + "</p>" +
          '<div class="card-actions"><button class="btn btn-ghost btn-sm" data-edit="' + esc(p.id) + '">Edit</button>' +
          '<button class="btn btn-ghost btn-sm" data-del="' + esc(p.id) + '" style="color:#ff8a9c">Delete</button></div>' +
          "</div></article>";
      }).join("") + "</div>";
    wrap.querySelectorAll("[data-edit]").forEach(function (b) { b.addEventListener("click", function () { startEdit(b.getAttribute("data-edit")); }); });
    wrap.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-del"); var p = cache.find(function (x) { return x.id === id; });
        del(id, p ? p.title : id);
      });
    });
  }

  function styleFields() {
    root.querySelectorAll(".fld").forEach(function (e) {
      e.style.width = "100%"; e.style.margin = "6px 0 14px"; e.style.padding = "11px 13px";
      e.style.borderRadius = "10px"; e.style.border = "1px solid var(--border)";
      e.style.background = "#07070e"; e.style.color = "var(--text)"; e.style.fontSize = "14px"; e.style.fontFamily = "inherit";
    });
  }
})();
