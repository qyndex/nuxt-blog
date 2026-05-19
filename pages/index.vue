<template>
  <main>
    <!-- ── Hero ──────────────────────────────────────────────────────── -->
    <section class="hero" aria-labelledby="hero-heading">
      <div class="container">
        <div class="hero-eyebrow" aria-hidden="true">
          <span class="eyebrow-line" />
          <span class="eyebrow-text">Engineering · Architecture · TypeScript</span>
          <span class="eyebrow-line" />
        </div>
        <h1 id="hero-heading" class="hero-title">
          <span class="hero-title-serif">The Dev</span>
          <br />
          <span class="hero-title-outline">Blog</span>
        </h1>
        <p class="hero-description">
          Deep dives into web development, TypeScript patterns,
          and the craft of building software that lasts.
        </p>
        <div class="hero-meta" aria-hidden="true">
          <span class="hero-meta-dot" />
          <span>Published weekly</span>
          <span class="hero-meta-sep">·</span>
          <span>No paywalls</span>
          <span class="hero-meta-sep">·</span>
          <span>Open source</span>
        </div>
      </div>
    </section>

    <!-- ── Category Filter ───────────────────────────────────────────── -->
    <section class="filter-bar" aria-label="Filter posts by category">
      <div class="container">
        <div class="filter-scroll" role="group" aria-label="Category filters">
          <button
            class="filter-pill"
            :class="{ active: selectedCategory === 'all' }"
            :aria-pressed="selectedCategory === 'all'"
            @click="selectedCategory = 'all'"
          >
            All Posts
          </button>
          <button
            v-for="cat in categories"
            :key="cat.slug"
            class="filter-pill"
            :class="{ active: selectedCategory === cat.slug }"
            :aria-pressed="selectedCategory === cat.slug"
            @click="selectedCategory = cat.slug"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </section>

    <div class="container posts-section">
      <!-- ── Loading skeleton ──────────────────────────────────────────── -->
      <div v-if="pending" class="posts-grid" role="status" aria-label="Loading posts" aria-live="polite">
        <div v-for="n in 6" :key="n" class="skeleton-card" aria-hidden="true">
          <div class="skeleton-cover" />
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-tag" />
            <div class="skeleton-line skeleton-title" />
            <div class="skeleton-line skeleton-title short" />
            <div class="skeleton-line skeleton-excerpt" />
            <div class="skeleton-line skeleton-meta" />
          </div>
        </div>
      </div>

      <!-- ── Error ─────────────────────────────────────────────────────── -->
      <div v-else-if="error" class="state-panel" role="alert">
        <svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p class="state-title">Failed to load posts</p>
        <p class="state-body">Something went wrong fetching the latest articles.</p>
        <button class="retry-btn" @click="refresh">Try again</button>
      </div>

      <!-- ── Empty ─────────────────────────────────────────────────────── -->
      <div v-else-if="!posts.length" class="state-panel" role="status">
        <svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p class="state-title">No posts yet</p>
        <p class="state-body">
          {{ selectedCategory !== 'all' ? 'No posts in this category.' : 'Check back soon for fresh articles.' }}
        </p>
      </div>

      <!-- ── Post grid ─────────────────────────────────────────────────── -->
      <div v-else class="posts-grid" aria-label="Blog posts">
        <ArticleCard
          v-for="(post, i) in posts"
          :key="post.slug"
          :post="post"
          :featured="i === 0 && selectedCategory === 'all'"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PostWithRelations, Category } from "~/types/database";

useHead({ title: "The Dev Blog — Engineering & Architecture" });

const selectedCategory = ref("all");

const { data: catData } = useLazyFetch<{ categories: Category[] }>("/api/categories");
const categories = computed(() => catData.value?.categories ?? []);

const postUrl = computed(() => {
  const params = new URLSearchParams();
  if (selectedCategory.value !== "all") {
    params.set("category", selectedCategory.value);
  }
  params.set("per_page", "24");
  return `/api/posts?${params.toString()}`;
});

const {
  data: postData,
  pending,
  error,
  refresh,
} = useLazyFetch<{ posts: PostWithRelations[] }>(postUrl);
const posts = computed(() => postData.value?.posts ?? []);
</script>

<style scoped>
/* ── Hero ──────────────────────────────────────────────────────────── */
.hero {
  padding: var(--space-20) 0 var(--space-16);
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

/* Subtle gradient wash behind the hero */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% -10%, rgba(245, 158, 11, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--container-px);
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  justify-content: center;
  margin-bottom: var(--space-8);
}

.eyebrow-line {
  flex: 1;
  max-width: 4rem;
  height: 1px;
  background: var(--border-strong);
}

.eyebrow-text {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.hero-title {
  font-family: var(--font-display);
  text-align: center;
  font-size: clamp(var(--text-5xl), 10vw, var(--text-6xl));
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-6);
}

.hero-title-serif {
  color: var(--text-primary);
}

.hero-title-outline {
  -webkit-text-stroke: 2px var(--accent);
  color: transparent;
  font-style: italic;
}

.hero-description {
  max-width: 42ch;
  margin: 0 auto var(--space-6);
  text-align: center;
  font-size: var(--text-lg);
  line-height: 1.7;
  color: var(--text-secondary);
}

.hero-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.hero-meta-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.hero-meta-sep {
  color: var(--border-strong);
}

/* ── Filter bar ─────────────────────────────────────────────────────── */
.filter-bar {
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 3.5rem;
  z-index: 30;
  background-color: rgba(13, 13, 15, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.filter-scroll {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.filter-pill {
  padding: 0.375rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-strong);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: all var(--transition-fast);
}

.filter-pill:hover {
  border-color: var(--text-muted);
  color: var(--text-primary);
}

.filter-pill.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #0d0d0f;
  font-weight: 600;
}

/* ── Posts section ──────────────────────────────────────────────────── */
.posts-section {
  padding: var(--space-10) var(--container-px);
  max-width: var(--max-width);
  margin: 0 auto;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

/* ── Skeleton loading ───────────────────────────────────────────────── */
.skeleton-card {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton-cover {
  width: 100%;
  height: 200px;
  background: var(--bg-overlay);
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton-line {
  height: 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-overlay);
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-tag { width: 5rem; height: 10px; }
.skeleton-title { width: 100%; height: 16px; }
.skeleton-title.short { width: 70%; }
.skeleton-excerpt { width: 100%; height: 10px; }
.skeleton-meta { width: 8rem; height: 10px; margin-top: var(--space-1); }

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

/* ── Empty / Error states ───────────────────────────────────────────── */
.state-panel {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-24) var(--space-8);
  text-align: center;
}

.state-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--text-muted);
}

.state-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.state-body {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  max-width: 30ch;
  line-height: 1.6;
}

.retry-btn {
  margin-top: var(--space-2);
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-strong);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.retry-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ── Responsive ─────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .hero {
    padding: var(--space-12) 0 var(--space-10);
  }
  .hero-title {
    font-size: clamp(2.5rem, 14vw, 3.5rem);
  }
  .hero-description {
    font-size: var(--text-base);
  }
  .filter-scroll {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: var(--space-1);
  }
  .filter-scroll::-webkit-scrollbar {
    display: none;
  }
  .filter-pill {
    flex-shrink: 0;
  }
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
