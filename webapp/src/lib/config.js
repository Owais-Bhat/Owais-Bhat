export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY || "",
  openRouterModel: import.meta.env.VITE_OPENROUTER_MODEL || "openrouter/auto",
};

export const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey);
export const hasOpenRouterConfig = Boolean(config.openRouterApiKey);
