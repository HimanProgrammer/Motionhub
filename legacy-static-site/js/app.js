/* PromptMotion — UI logic. Plain JS, no framework.
   Supabase-aware: if js/config.js has a real anon key AND supabase-js is loaded,
   prompts load from the DB and premium unlocks via the signed-in account's
   profile.is_unlimited. Otherwise it falls back to the local seed + a browser flag. */
(function () {
  "use strict";

  var GOOGLE_SVG =
    '<svg viewBox="0 0 48 48" width="17" height="17" style="vertical-align:-3px" aria-hidden="true">' +
    '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>' +
    '<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>' +
    '<path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"/>' +
    '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.9 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z"/>' +
    "</svg>";

  var state = {
    prompts: window.PROMPTS || [],
    unlimited: false,
    user: null,
    isAdmin: false,
    supa: !!(window.PM && window.PM.isConfigured && window.PM.isConfigured()),
    activeCat: "all",
  };

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) toggle.addEventListener("click", function () { links.classList.toggle("open"); });

  /* ---- Scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  var grid = document.getElementById("prompt-grid");
  var overlay = document.getElementById("modal-overlay");

  /* ================= boot ================= */
  boot();

  async function boot() {
    if (state.supa) {
      try {
        state.user = await window.PM.getUser();
        if (state.user) {
          var profile = await window.PM.getProfile();
          state.unlimited = !!(profile && profile.is_unlimited);
          state.isAdmin = !!(profile && profile.is_admin);
        }
        var dbPrompts = await window.PM.getPrompts();
        if (dbPrompts && dbPrompts.length) state.prompts = dbPrompts;
      } catch (e) { console.warn("Supabase boot issue:", e); }
    } else {
      try { state.unlimited = localStorage.getItem("pm_unlimited") === "1"; } catch (e) {}
    }
    renderAuthNav();
    if (grid) { buildFilters(); render(); wireModal(); }
  }

  /* ================= auth nav ================= */
  function renderAuthNav() {
    var slot = document.getElementById("auth-slot");
    if (!slot) return;
    if (!state.supa) { slot.innerHTML = ""; return; }
    if (state.user) {
      var admin = state.isAdmin ? '<a class="btn btn-ghost btn-sm" href="admin.html">Admin</a>' : "";
      var badge = state.unlimited ? ' <span class="badge free" style="position:static">Unlimited</span>' : "";
      slot.innerHTML =
        '<span class="builders" style="margin:0 6px">' + escapeHTML(state.user.email) + badge + "</span>" +
        admin +
        ' <button class="btn btn-ghost btn-sm" id="logout-btn">Log out</button>';
      var lo = document.getElementById("logout-btn");
      if (lo) lo.addEventListener("click", async function () { await window.PM.signOut(); location.reload(); });
    } else {
      slot.innerHTML = '<button class="btn btn-ghost btn-sm" id="login-btn">Log in</button>';
      var li = document.getElementById("login-btn");
      if (li) li.addEventListener("click", function () { openAuthModal("in"); });
    }
  }

  /* ================= gallery ================= */
  function buildFilters() {
    var wrap = document.getElementById("filters");
    if (!wrap || !window.CATEGORIES) return;
    wrap.innerHTML = window.CATEGORIES.map(function (c) {
      return '<button class="chip' + (c.id === "all" ? " active" : "") + '" data-cat="' + c.id + '">' + c.label + "</button>";
    }).join("");
    wrap.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      state.activeCat = chip.getAttribute("data-cat");
      wrap.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      render();
    });
  }

  function cardHTML(p) {
    var badge = p.tier === "premium" ? '<span class="badge premium">Premium</span>' : '<span class="badge free">Free</span>';
    var grad = "linear-gradient(135deg," + p.gradient[0] + "," + p.gradient[1] + ")";
    var tags = (p.tags || []).slice(0, 3).map(function (t) { return '<span class="tag">#' + escapeHTML(t) + "</span>"; }).join("");
    var actionLabel = (p.tier === "premium" && !state.unlimited) ? "🔒 Unlock" : "Copy prompt";
    return (
      '<article class="card" data-id="' + escapeHTML(p.id) + '">' +
        '<div class="card-preview" style="background:' + grad + '"><span></span>' + badge + "</div>" +
        '<div class="card-body">' +
          "<h3>" + escapeHTML(p.title) + "</h3>" +
          '<p class="desc">' + escapeHTML(p.description) + "</p>" +
          '<div class="tags">' + tags + "</div>" +
          '<div class="card-actions">' +
            '<button class="btn btn-primary btn-sm open-prompt" data-id="' + escapeHTML(p.id) + '">' + actionLabel + "</button>" +
            '<span class="builders">' + (p.builders || []).slice(0, 3).join(" · ") + "</span>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    if (!grid) return;
    var list = state.prompts.filter(function (p) {
      return state.activeCat === "all" || p.category === state.activeCat || (p.tags || []).indexOf(state.activeCat) !== -1;
    });
    if (!list.length) { grid.innerHTML = '<p style="color:var(--muted)">No prompts yet in this category.</p>'; return; }
    grid.innerHTML = list.map(cardHTML).join("");
    grid.querySelectorAll(".card").forEach(function (c, i) { setTimeout(function () { c.classList.add("in"); }, 40 * i); });
  }

  /* ================= prompt modal ================= */
  function wireModal() {
    if (!overlay) return;
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".open-prompt");
      var card = e.target.closest(".card");
      var id = (btn && btn.getAttribute("data-id")) || (card && card.getAttribute("data-id"));
      if (!id) return;
      var p = state.prompts.find(function (x) { return x.id === id; });
      if (p) openModal(p);
    });
  }

  function openModal(p) {
    var locked = p.tier === "premium" && !state.unlimited;
    var grad = "linear-gradient(135deg," + p.gradient[0] + "," + p.gradient[1] + ")";
    var inner;
    if (locked) {
      var cta = state.supa && !state.user
        ? '<button class="btn btn-primary" id="login-cta">Log in / Sign up</button>'
        : '<a class="btn btn-primary" href="pricing.html">Go Unlimited →</a>';
      inner =
        '<div class="modal-head"><h3>' + escapeHTML(p.title) + '</h3><button class="modal-close" aria-label="Close">×</button></div>' +
        '<div class="modal-body">' +
          '<div class="prompt-box"><pre class="prompt-blur">' + escapeHTML(p.prompt.slice(0, 240)) + "…</pre></div>" +
          '<div class="paywall"><div class="lock">🔒</div><h4>This is a Premium prompt</h4>' +
            "<p>Go Unlimited to copy every premium motion &amp; Claude coding prompt, forever.</p>" + cta + "</div>" +
        "</div>";
    } else {
      inner =
        '<div class="modal-head"><h3>' + escapeHTML(p.title) + '</h3><button class="modal-close" aria-label="Close">×</button></div>' +
        '<div class="modal-body">' +
          '<p class="desc" style="color:var(--muted);margin:2px 0 0">' + escapeHTML(p.description) + "</p>" +
          '<div class="prompt-box"><pre id="prompt-text">' + escapeHTML(p.prompt) + "</pre></div>" +
          '<div class="copy-row"><button class="btn btn-primary btn-sm" id="copy-btn">📋 Copy prompt</button>' +
            '<span class="builders">Works with ' + (p.builders || []).join(", ") + "</span>" +
            '<span class="copied-note" id="copied-note">Copied!</span></div>' +
        "</div>";
    }
    paintModal(inner, grad);
    var lc = document.getElementById("login-cta");
    if (lc) lc.addEventListener("click", function () { closeModal(); openAuthModal("in"); });
    var copyBtn = document.getElementById("copy-btn");
    if (copyBtn) copyBtn.addEventListener("click", function () {
      copyText(p.prompt, function () {
        var note = document.getElementById("copied-note");
        if (note) { note.classList.add("show"); setTimeout(function () { note.classList.remove("show"); }, 1600); }
        copyBtn.textContent = "✓ Copied";
        setTimeout(function () { copyBtn.textContent = "📋 Copy prompt"; }, 1600);
      });
    });
  }

  /* ================= auth modal ================= */
  function openAuthModal(mode) {
    if (!overlay) return;
    render_auth(mode || "in");
    function render_auth(m) {
      var isIn = m === "in";
      var inner =
        '<div class="modal-head"><h3>' + (isIn ? "Log in" : "Create account") + '</h3><button class="modal-close" aria-label="Close">×</button></div>' +
        '<div class="modal-body">' +
          '<button class="btn btn-ghost" id="google-btn" style="width:100%;justify-content:center;margin:2px 0 14px">' + GOOGLE_SVG + " Continue with Google</button>" +
          '<div style="display:flex;align-items:center;gap:10px;color:var(--muted);font-size:13px;margin-bottom:12px"><span style="flex:1;height:1px;background:var(--border)"></span>or<span style="flex:1;height:1px;background:var(--border)"></span></div>' +
          '<div style="padding:2px 0 0">' +
            '<label class="builders">Email</label>' +
            '<input id="auth-email" type="email" autocomplete="email" style="width:100%;margin:6px 0 14px;padding:11px 13px;border-radius:10px;border:1px solid var(--border);background:#07070e;color:var(--text);font-size:15px" />' +
            '<label class="builders">Password</label>' +
            '<input id="auth-pass" type="password" autocomplete="' + (isIn ? "current-password" : "new-password") + '" style="width:100%;margin:6px 0 4px;padding:11px 13px;border-radius:10px;border:1px solid var(--border);background:#07070e;color:var(--text);font-size:15px" />' +
            '<p id="auth-msg" style="color:#ff8a9c;min-height:18px;margin:8px 0 0;font-size:14px"></p>' +
          "</div>" +
          '<div class="copy-row"><button class="btn btn-primary" id="auth-submit">' + (isIn ? "Log in" : "Sign up") + "</button>" +
            '<button class="btn btn-ghost btn-sm" id="auth-switch">' + (isIn ? "Need an account? Sign up" : "Have an account? Log in") + "</button></div>" +
        "</div>";
      paintModal(inner, "linear-gradient(135deg,#6d5efc,#00d4ff)");
      var gbtn = document.getElementById("google-btn");
      if (gbtn) gbtn.addEventListener("click", async function () {
        gbtn.disabled = true; gbtn.innerHTML = "Redirecting to Google…";
        try { var r = await window.PM.signInWithGoogle(); if (r && r.error) throw r.error; }
        catch (e) {
          gbtn.disabled = false; gbtn.innerHTML = GOOGLE_SVG + " Continue with Google";
          var m = document.getElementById("auth-msg");
          if (m) { m.style.color = "#ff8a9c"; m.textContent = e.message || "Google sign-in isn't enabled in Supabase yet."; }
        }
      });
      document.getElementById("auth-switch").addEventListener("click", function () { render_auth(isIn ? "up" : "in"); });
      document.getElementById("auth-submit").addEventListener("click", function () { submit(isIn); });
      overlay.querySelectorAll("input").forEach(function (inp) {
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(isIn); });
      });
    }
    async function submit(isIn) {
      var email = (document.getElementById("auth-email") || {}).value;
      var pass = (document.getElementById("auth-pass") || {}).value;
      var msg = document.getElementById("auth-msg");
      var btn = document.getElementById("auth-submit");
      if (!email || !pass) { if (msg) msg.textContent = "Enter your email and password."; return; }
      if (btn) { btn.disabled = true; btn.textContent = "…"; }
      try {
        var res = isIn ? await window.PM.signIn(email, pass) : await window.PM.signUp(email, pass);
        if (res.error) throw res.error;
        if (!isIn && res.data && res.data.user && !res.data.session) {
          if (msg) { msg.style.color = "#7dffb0"; msg.textContent = "Check your email to confirm, then log in."; }
          if (btn) { btn.disabled = false; btn.textContent = "Sign up"; }
          return;
        }
        // Signed in — send admins straight to the dashboard, everyone else back to the gallery.
        try {
          var prof = await window.PM.getProfile();
          if (prof && prof.is_admin) { window.location.href = "admin.html"; return; }
        } catch (e) {}
        location.reload();
      } catch (err) {
        if (msg) { msg.style.color = "#ff8a9c"; msg.textContent = err.message || "Something went wrong."; }
        if (btn) { btn.disabled = false; btn.textContent = isIn ? "Log in" : "Sign up"; }
      }
    }
  }

  /* ================= modal helpers ================= */
  function paintModal(inner, grad) {
    var modal = overlay.querySelector(".modal");
    modal.style.background = "linear-gradient(var(--bg-2),var(--bg-2)) padding-box," + grad + " border-box";
    modal.style.border = "1px solid transparent";
    modal.innerHTML = inner;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    var close = overlay.querySelector(".modal-close");
    if (close) close.addEventListener("click", closeModal);
  }
  function closeModal() { overlay.classList.remove("open"); document.body.style.overflow = ""; }

  /* ================= utils ================= */
  function escapeHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else { fallbackCopy(text, done); }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta); if (done) done();
  }

  // Expose for the pricing page + admin.
  window.PM_STATE = state;
  window.PM_openAuth = openAuthModal;
})();
