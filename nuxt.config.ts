// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  typescript: { strict: true },
  runtimeConfig: {
    public: {
      siteName: "The Dev Blog",
      siteDescription: "Insights on web development, TypeScript, and architecture.",
    },
  },
});
