const getEnv = (name) => process.env[name] || "";

export const supabaseConfig = {
  url: getEnv("EXPO_PUBLIC_SUPABASE_URL"),
  anonKey: getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  enabled:
    Boolean(getEnv("EXPO_PUBLIC_SUPABASE_URL")) &&
    Boolean(getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY")),
};
