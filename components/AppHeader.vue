<template>
  <header class="site-header">
    <div class="container">
      <NuxtLink href="/" class="logo" aria-label="Home">The Dev Blog</NuxtLink>
      <nav aria-label="Main navigation">
        <NuxtLink href="/" :class="{ active: $route.path === '/' }">Home</NuxtLink>
        <NuxtLink href="/about">About</NuxtLink>
        <NuxtLink href="/archive">Archive</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped>
.site-header { background: white; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 10; }
.container { max-width: 72rem; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; gap: 2rem; height: 4rem; }
.logo { font-weight: 700; font-size: 1.125rem; text-decoration: none; color: #1e293b; }
nav { display: flex; gap: 1.5rem; margin-left: auto; }
nav a { color: #64748b; text-decoration: none; font-size: 0.9375rem; }
nav a.active, nav a:hover { color: #1e293b; }
</style>
