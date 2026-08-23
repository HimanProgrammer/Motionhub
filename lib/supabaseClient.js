"use client";

/* MotionHub — Supabase browser client + data helpers.
   The anon key is SAFE in client code — it's protected by Row Level Security.
   Never put the service_role key here. */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqrrnkfihnzttppgbtq.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcXJybmtmaWhuenR0cHBnYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzY2NDEsImV4cCI6MjEwMDY1MjY0MX0.-ubJV7ysjTFPxvpJSHTaGXfzM8H4IlofIwzy8nIKdDc";

let _client = null;
export function supabase() {
  if (!_client) _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}
export function isConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/* ---------- Auth ---------- */
export async function getUser() {
  const sb = supabase();
  const { data } = await sb.auth.getUser();
  return data?.user || null;
}
export function signUp(email, password) {
  return supabase().auth.signUp({ email, password });
}
export function signIn(email, password) {
  return supabase().auth.signInWithPassword({ email, password });
}
export function signOut() {
  return supabase().auth.signOut();
}
// Requires the Google provider enabled in Supabase → Authentication → Providers.
export function signInWithGoogle(redirectTo) {
  return supabase().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectTo || window.location.href.split("#")[0] },
  });
}

/* ---------- Profile / entitlement ---------- */
export async function getProfile() {
  const user = await getUser();
  if (!user) return null;
  const { data } = await supabase().from("profiles").select("*").eq("id", user.id).single();
  return data || null;
}
export async function setUnlimited(value) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  return supabase().from("profiles").update({ is_unlimited: !!value }).eq("id", user.id);
}

/* ---------- Prompts ---------- */
function normalizePrompt(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    tags: row.tags || [],
    tier: row.tier || "free",
    gradient: row.gradient && row.gradient.length === 2 ? row.gradient : ["#6d5efc", "#00d4ff"],
    builders: row.builders || [],
    description: row.description || "",
    prompt: row.prompt || "",
  };
}
// Public browsing (home gallery, template pages) reads from the "prompts_public" VIEW,
// not the raw table. The view nulls out `prompt` server-side for premium rows unless the
// requester is unlimited/admin (see public.is_entitled() in Supabase) — so locked prompt
// text never reaches the browser at all, not just hidden in the UI.
export async function getPrompts() {
  const { data, error } = await supabase().from("prompts_public").select("*").order("created_at", { ascending: false });
  if (error) { console.warn("getPrompts:", error.message); return null; }
  return (data || []).map(normalizePrompt);
}

// Admin dashboard CRUD reads/writes the raw table directly (RLS: admin-write-only for
// mutations; admin/unlimited can also SELECT premium rows here for editing).
export async function getPromptsAdmin() {
  const { data, error } = await supabase().from("prompts").select("*").order("created_at", { ascending: false });
  if (error) { console.warn("getPromptsAdmin:", error.message); return null; }
  return (data || []).map(normalizePrompt);
}
export function addPrompt(p) {
  return supabase().from("prompts").insert([p]).select();
}
export function updatePrompt(id, patch) {
  return supabase().from("prompts").update(patch).eq("id", id).select();
}
export function deletePrompt(id) {
  return supabase().from("prompts").delete().eq("id", id);
}
export function upsertPrompts(rows) {
  return supabase().from("prompts").upsert(rows, { onConflict: "id" }).select();
}

/* ---------- Live sync ----------
   Lets the public site pick up admin add/edit/delete changes in the background,
   without a page reload. Requires Realtime enabled on the "prompts" table
   (Supabase → Database → Replication → toggle "prompts" on). */
export function subscribeToPrompts(onChange) {
  const sb = supabase();
  const channel = sb
    .channel("prompts-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "prompts" }, () => {
      onChange?.();
    })
    .subscribe();
  return () => sb.removeChannel(channel);
}
