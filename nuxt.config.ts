// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: ["@nuxt/eslint"],
  typescript: { strict: true },

  // Nitro: node-server preset is required for Docker/Coolify deployments.
  // Without this, Nuxt defaults to a preset that may not bind to 0.0.0.0.
  nitro: {
    preset: "node-server",
  },

  runtimeConfig: {
    // Server-only (not exposed to client)
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseKey: process.env.SUPABASE_KEY || "",
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || "",

    // Client-accessible
    public: {
      siteName: "The Dev Blog",
      siteDescription:
        "Insights on web development, TypeScript, and architecture.",
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseKey: process.env.SUPABASE_KEY || "",
    },
  },
});
