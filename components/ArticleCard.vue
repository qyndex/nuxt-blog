<template>
  <article class="card" :class="{ 'card--featured': featured }">
    <NuxtLink :href="`/posts/${post.slug}`" class="card-link" :aria-label="`Read: ${post.title}`">
      <!-- Cover image / placeholder -->
      <div class="card-cover" :class="{ 'card-cover--featured': featured }">
        <img
          v-if="post.cover_image_url"
          :src="post.cover_image_url"
          :alt="post.title"
          loading="lazy"
          width="640"
          height="360"
          class="cover-img"
        />
        <div v-else class="cover-placeholder" aria-hidden="true">
          <span class="placeholder-letter">{{ post.title.charAt(0) }}</span>
          <div class="placeholder-grid" />
        </div>

        <!-- Category badge overlaid on cover -->
        <span v-if="post.categories" class="cover-badge" aria-label="Category: {{ post.categories.name }}">
          {{ post.categories.name }}
        </span>
      </div>

      <!-- Card body -->
      <div class="card-body">
        <h2 class="card-title" :class="{ 'card-title--featured': featured }">
          {{ post.title }}
        </h2>
        <p v-if="post.excerpt" class="card-excerpt">{{ post.excerpt }}</p>
        <div class="card-meta">
          <span v-if="post.profiles" class="meta-author">
            {{ post.profiles.full_name || post.profiles.username }}
          </span>
          <template v-if="post.published_at">
            <span class="meta-sep" aria-hidden="true">·</span>
            <time class="meta-date" :datetime="post.published_at">
              {{ formatDate(post.published_at) }}
            </time>
          </template>
          <span class="meta-arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { PostWithRelations } from "~/types/database";

interface Props {
  post: PostWithRelations;
  featured?: boolean;
}

const { post, featured = false } = defineProps<Props>();

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<style scoped>
/* ── Base card ──────────────────────────────────────────────────────── */
.card {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    border-color var(--transition-base),
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Featured card spans full grid width */
.card--featured {
  grid-column: 1 / -1;
}

.card-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

/* Featured card goes side-by-side on larger screens */
.card--featured .card-link {
  flex-direction: column;
}

@media (min-width: 768px) {
  .card--featured .card-link {
    flex-direction: row;
  }
}

/* ── Cover ──────────────────────────────────────────────────────────── */
.card-cover {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  height: 200px;
}

.card-cover--featured {
  height: 260px;
}

@media (min-width: 768px) {
  .card--featured .card-cover {
    width: 55%;
    height: auto;
    min-height: 320px;
  }
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease-out;
}

.card:hover .cover-img {
  transform: scale(1.03);
}

/* Placeholder with letter + grid pattern */
.cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.placeholder-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.5;
}

.placeholder-letter {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 700;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
  line-height: 1;
}

/* Category badge */
.cover-badge {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  padding: 0.2rem 0.625rem;
  background: rgba(13, 13, 15, 0.8);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* ── Card body ──────────────────────────────────────────────────────── */
.card-body {
  padding: var(--space-5) var(--space-5) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
}

@media (min-width: 768px) {
  .card--featured .card-body {
    padding: var(--space-8);
    justify-content: center;
  }
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.card-title--featured {
  font-size: clamp(var(--text-2xl), 3vw, var(--text-3xl));
  font-weight: 700;
}

.card:hover .card-title {
  color: var(--accent-hover);
}

.card-excerpt {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card--featured .card-excerpt {
  -webkit-line-clamp: 3;
}

/* Meta row */
.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: auto;
  padding-top: var(--space-2);
  border-top: 1px solid var(--border);
}

.meta-author {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-secondary);
}

.meta-sep {
  color: var(--border-strong);
  font-size: var(--text-xs);
}

.meta-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.meta-arrow {
  margin-left: auto;
  color: var(--accent);
  font-size: var(--text-sm);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.card:hover .meta-arrow {
  opacity: 1;
  transform: translateX(0);
}
</style>
