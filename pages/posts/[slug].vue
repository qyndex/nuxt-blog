<template>
  <main class="container">
    <div v-if="pending" class="loading" role="status">Loading…</div>
    <div v-else-if="error || !post" class="error" role="alert">
      <h1>Post not found</h1>
      <NuxtLink href="/">← Back to blog</NuxtLink>
    </div>
    <article v-else>
      <header class="post-header">
        <span class="category">{{ post.category }}</span>
        <h1>{{ post.title }}</h1>
        <div class="meta">
          <span>{{ post.author }}</span>
          <span>·</span>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <span>·</span>
          <span>{{ post.readTime }} min read</span>
        </div>
      </header>
      <div class="prose" v-html="post.content" />
      <footer class="post-footer">
        <NuxtLink href="/" class="back-link">← All Posts</NuxtLink>
      </footer>
    </article>
  </main>
</template>

<script setup lang="ts">
import type { Post } from "~/server/api/posts.get";

const route = useRoute();
const { data: post, pending, error } = useLazyFetch<Post>(
  `/api/posts/${route.params.slug}`
);

useHead(() => ({
  title: post.value ? `${post.value.title} — The Dev Blog` : "Post — The Dev Blog",
  meta: post.value
    ? [{ name: "description", content: post.value.excerpt }]
    : [],
}));

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

<style scoped>
.container { max-width: 48rem; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.post-header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
.category { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #1e40af; }
h1 { font-size: 2rem; font-weight: 800; margin: 0.5rem 0 1rem; line-height: 1.2; }
.meta { display: flex; gap: 0.5rem; font-size: 0.875rem; color: #94a3b8; flex-wrap: wrap; }
.prose { line-height: 1.8; color: #374151; }
.post-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
.back-link { color: #1e40af; text-decoration: none; font-weight: 500; }
.loading, .error { text-align: center; padding: 4rem; color: #94a3b8; }
</style>
