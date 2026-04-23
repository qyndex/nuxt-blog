<template>
  <div>
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: { lang: "en" },
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charset: "utf-8" },
  ],
});
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; }
body { min-height: 100vh; background: #f8fafc; }
img { max-width: 100%; display: block; }
a { color: inherit; }
</style>
