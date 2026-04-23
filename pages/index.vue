<template>
  <main class="container">
    <section class="hero">
      <h1>The Dev Blog</h1>
      <p>Insights on web development, TypeScript, and modern architecture.</p>
    </section>

    <section class="categories">
      <button
        v-for="cat in ['all', ...categories]"
        :key="cat"
        class="cat-btn"
        :class="{ active: selectedCategory === cat }"
        :aria-pressed="selectedCategory === cat"
        @click="selectedCategory = cat"
      >
        {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
      </button>
    </section>

    <div v-if="pending" class="loading" role="status" aria-live="polite">
      Loading posts…
    </div>
    <div v-else-if="error" class="error" role="alert">
      Failed to load posts. Please try again.
    </div>
    <div v-else class="posts-grid" aria-label="Blog posts">
      <ArticleCard
        v-for="post in filteredPosts"
        :key="post.slug"
        :post="post"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Post } from "~/server/api/posts.get";

useHead({ title: "The Dev Blog — Home" });

const selectedCategory = ref("all");

const { data: posts, pending, error } = useLazyFetch<Post[]>("/api/posts");

const categories = computed(() =>
  [...new Set((posts.value ?? []).map((p) => p.category))]
);

const filteredPosts = computed(() =>
  selectedCategory.value === "all"
    ? (posts.value ?? [])
    : (posts.value ?? []).filter((p) => p.category === selectedCategory.value)
);
</script>

<style scoped>
.container { max-width: 72rem; margin: 0 auto; padding: 0 1.5rem 4rem; }
.hero { padding: 4rem 0 2rem; text-align: center; }
h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.75rem; }
.hero p { font-size: 1.125rem; color: #64748b; }
.categories { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin: 1.5rem 0 2rem; }
.cat-btn { padding: 0.375rem 1rem; border: 1px solid #e2e8f0; border-radius: 9999px; background: white; cursor: pointer; font-size: 0.875rem; color: #64748b; }
.cat-btn.active { border-color: #1e40af; background: #eff6ff; color: #1e40af; font-weight: 600; }
.posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
.loading, .error { text-align: center; padding: 4rem; color: #94a3b8; }
.error { color: #dc2626; }
</style>
