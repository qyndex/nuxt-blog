<template>
  <div class="app">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { init } = useAuth();

useHead({
  htmlAttrs: { lang: "en" },
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap",
    },
  ],
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charset: "utf-8" },
    { name: "color-scheme", content: "dark" },
  ],
});

onMounted(() => {
  init();
});
</script>

<style>
/* ── Design Tokens ─────────────────────────────────────────────────── */
:root {
  /* Surfaces */
  --bg-base:       #0d0d0f;
  --bg-raised:     #141417;
  --bg-overlay:    #1c1c21;
  --bg-subtle:     #222228;

  /* Text */
  --text-primary:  #f0ede8;
  --text-secondary: #a8a49e;
  --text-muted:    #6b6860;

  /* Accent — warm amber */
  --accent:        #f59e0b;
  --accent-hover:  #fbbf24;
  --accent-dim:    rgba(245, 158, 11, 0.12);

  /* Borders */
  --border:        rgba(240, 237, 232, 0.08);
  --border-strong: rgba(240, 237, 232, 0.15);

  /* Typography */
  --font-display: "Libre Bodoni", Georgia, serif;
  --font-body:    "Inter", system-ui, -apple-system, sans-serif;

  /* Type scale */
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
  --text-5xl:  3rem;
  --text-6xl:  3.75rem;

  /* Spacing scale (8pt grid) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;

  /* Layout */
  --max-width: 72rem;
  --container-px: 1.5rem;
}

/* ── Reset ─────────────────────────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Base ──────────────────────────────────────────────────────────── */
html {
  font-size: 16px;
  color-scheme: dark;
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100dvh;
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

/* ── App shell ─────────────────────────────────────────────────────── */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

/* ── Focus ring ────────────────────────────────────────────────────── */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
</style>
