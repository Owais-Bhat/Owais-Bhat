import { supabaseConfig } from "./api";

export const signInWithEmail = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // Phase-0 fallback login until Supabase Auth SDK is wired.
  // Replace with supabase.auth.signInWithPassword in next iteration.
  return {
    id: `local-${email}`,
    email,
    tenantId: "demo-tenant",
    role: "super_admin",
    provider: supabaseConfig.enabled ? "supabase-pending" : "local-mock",
  };
};

export const signOutUser = async () => true;
