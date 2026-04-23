<template>
  <footer class="site-footer">
    <div class="container">
      <p>&copy; {{ year }} The Dev Blog. Built with Nuxt 3.</p>
      <nav aria-label="Footer links">
        <a href="/rss.xml">RSS</a>
        <a href="https://github.com" rel="noopener noreferrer">GitHub</a>
        <a href="/privacy">Privacy</a>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped>
.site-footer { border-top: 1px solid #f1f5f9; padding: 1.5rem 0; background: white; }
.container { max-width: 72rem; margin: 0 auto; padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
p { font-size: 0.875rem; color: #94a3b8; }
nav { display: flex; gap: 1.25rem; }
a { color: #94a3b8; text-decoration: none; font-size: 0.875rem; }
a:hover { color: #475569; }
</style>
