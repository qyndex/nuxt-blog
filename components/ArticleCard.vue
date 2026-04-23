<template>
  <article class="card">
    <NuxtLink :href="`/posts/${post.slug}`" class="card-link" :aria-label="post.title">
      <img :src="post.cover" :alt="post.title" loading="lazy" width="640" height="360" />
      <div class="body">
        <span class="category">{{ post.category }}</span>
        <h2>{{ post.title }}</h2>
        <p class="excerpt">{{ post.excerpt }}</p>
        <div class="meta">
          <span>{{ post.author }}</span>
          <span>·</span>
          <span>{{ post.readTime }} min read</span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { Post } from "~/server/api/posts.get";

defineProps<{ post: Post }>();
</script>

<style scoped>
.card { background: white; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: box-shadow 0.2s; }
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.card-link { display: block; text-decoration: none; color: inherit; }
img { width: 100%; height: 200px; object-fit: cover; }
.body { padding: 1.25rem; }
.category { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1e40af; }
h2 { font-size: 1.0625rem; font-weight: 700; margin: 0.375rem 0 0.5rem; line-height: 1.35; }
.excerpt { font-size: 0.875rem; color: #64748b; line-height: 1.6; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.meta { font-size: 0.75rem; color: #94a3b8; display: flex; gap: 0.375rem; }
</style>
