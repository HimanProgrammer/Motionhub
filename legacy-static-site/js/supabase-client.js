/* PromptMotion — Supabase helper layer.
   Exposes a small `window.PM` API used by app.js, auth, and admin.
   Requires config.js (URL + anon key) and the supabase-js UMD bundle loaded before this file. */
(function () {
  "use strict";

  var PM = {};
  window.PM = PM;

  var url = window.SUPABASE_URL;
  var key = window.SUPABASE_ANON_KEY;

  PM.isConfigured = function () {
    return !!(url && key && key.indexOf("PASTE_") !== 0 && window.supabase && window.supabase.createClient);
  };

  var client = null;
  PM.client = function () {
    if (!client && PM.isConfigured()) {
      client = window.supabase.createClient(url, key);
    }
    return client;
  };

  /* ---------- Auth ---------- */
  PM.getUser = function () {
    var sb = PM.client();
    if (!sb) return Promise.resolve(null);
    return sb.auth.getUser().then(function (r) { return (r.data && r.data.user) || null; })
      .catch(function () { return null; });
  };

  PM.signUp = function (email, password) {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return sb.auth.signUp({ email: email, password: password });
  };

  PM.signIn = function (email, password) {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return sb.auth.signInWithPassword({ email: email, password: password });
  };

  // Google OAuth. Redirects to Google, then back to the page it was called from.
  // Requires the Google provider to be enabled in Supabase → Authentication → Providers.
  PM.signInWithGoogle = function () {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href.split("#")[0] },
    });
  };

  PM.signOut = function () {
    var sb = PM.client();
    if (!sb) return Promise.resolve();
    return sb.auth.signOut();
  };

  /* ---------- Profile / entitlement ---------- */
  PM.getProfile = function () {
    var sb = PM.client();
    if (!sb) return Promise.resolve(null);
    return PM.getUser().then(function (user) {
      if (!user) return null;
      return sb.from("profiles").select("*").eq("id", user.id).single()
        .then(function (r) { return r.data || null; })
        .catch(function () { return null; });
    });
  };

  PM.isUnlimited = function () {
    return PM.getProfile().then(function (p) { return !!(p && p.is_unlimited); });
  };

  PM.isAdmin = function () {
    return PM.getProfile().then(function (p) { return !!(p && p.is_admin); });
  };

  // Demo "Go Unlimited" — flips the logged-in user's own profile flag.
  // Replace with a Stripe webhook that sets is_unlimited server-side in phase 2.
  PM.setUnlimited = function (value) {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return PM.getUser().then(function (user) {
      if (!user) throw new Error("Not signed in");
      return sb.from("profiles").update({ is_unlimited: !!value }).eq("id", user.id);
    });
  };

  /* ---------- Prompts ---------- */
  PM.getPrompts = function () {
    var sb = PM.client();
    if (!sb) return Promise.resolve(null);
    return sb.from("prompts").select("*").order("created_at", { ascending: false })
      .then(function (r) {
        if (r.error) { console.warn("getPrompts:", r.error.message); return null; }
        return (r.data || []).map(normalizePrompt);
      })
      .catch(function () { return null; });
  };

  PM.addPrompt = function (p) {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return sb.from("prompts").insert([p]).select();
  };

  PM.upsertPrompts = function (rows) {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return sb.from("prompts").upsert(rows, { onConflict: "id" }).select();
  };

  PM.updatePrompt = function (id, patch) {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return sb.from("prompts").update(patch).eq("id", id).select();
  };

  PM.deletePrompt = function (id) {
    var sb = PM.client();
    if (!sb) return Promise.reject(new Error("Supabase not configured"));
    return sb.from("prompts").delete().eq("id", id);
  };

  // Ensure DB rows have the shape app.js expects (arrays never null).
  function normalizePrompt(row) {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      tags: row.tags || [],
      tier: row.tier || "free",
      gradient: (row.gradient && row.gradient.length === 2) ? row.gradient : ["#6d5efc", "#00d4ff"],
      builders: row.builders || [],
      description: row.description || "",
      prompt: row.prompt || "",
    };
  }
})();
