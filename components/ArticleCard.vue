<template>
  <article class="card">
    <NuxtLink :href="`/posts/${post.slug}`" class="card-link" :aria-label="post.title">
      <img
        v-if="post.cover_image_url"
        :src="post.cover_image_url"
        :alt="post.title"
        loading="lazy"
        width="640"
        height="360"
      />
      <div v-else class="cover-placeholder" aria-hidden="true">
        <span>{{ post.title.charAt(0) }}</span>
      </div>
      <div class="body">
        <span v-if="post.categories" class="category">{{ post.categories.name }}</span>
        <h2>{{ post.title }}</h2>
        <p v-if="post.excerpt" class="excerpt">{{ post.excerpt }}</p>
        <div class="meta">
          <span v-if="post.profiles">{{ post.profiles.full_name || post.profiles.username }}</span>
          <template v-if="post.published_at">
            <span>·</span>
            <time :datetime="post.published_at">{{ formatDate(post.published_at) }}</time>
          </template>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { PostWithRelations } from "~/types/database";

defineProps<{ post: PostWithRelations }>();

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
</script>

<style scoped>
.card { background: white; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: box-shadow 0.2s; }
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.card-link { display: block; text-decoration: none; color: inherit; }
img { width: 100%; height: 200px; object-fit: cover; }
.cover-placeholder { width: 100%; height: 200px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); display: flex; align-items: center; justify-content: center; }
.cover-placeholder span { font-size: 3rem; font-weight: 700; color: white; opacity: 0.5; }
.body { padding: 1.25rem; }
.category { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #1e40af; }
h2 { font-size: 1.0625rem; font-weight: 700; margin: 0.375rem 0 0.5rem; line-height: 1.35; }
.excerpt { font-size: 0.875rem; color: #64748b; line-height: 1.6; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.meta { font-size: 0.75rem; color: #94a3b8; display: flex; gap: 0.375rem; }
</style>
