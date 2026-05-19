<template>
  <header class="site-header" role="banner">
    <div class="header-inner">
      <!-- Wordmark -->
      <NuxtLink href="/" class="wordmark" aria-label="The Dev Blog — home">
        <span class="wordmark-serif">The Dev</span>
        <span class="wordmark-dot" aria-hidden="true">·</span>
        <span class="wordmark-sans">Blog</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="nav" aria-label="Main navigation">
        <NuxtLink
          href="/"
          class="nav-link"
          :class="{ active: $route.path === '/' }"
          aria-current="$route.path === '/' ? 'page' : undefined"
        >
          Home
        </NuxtLink>

        <template v-if="user">
          <NuxtLink
            href="/admin/posts"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/admin') }"
            :aria-current="$route.path.startsWith('/admin') ? 'page' : undefined"
          >
            My Posts
          </NuxtLink>
          <button class="nav-cta" aria-label="Sign out of your account" @click="handleLogout">
            Sign Out
          </button>
        </template>
        <template v-else>
          <NuxtLink
            href="/auth/login"
            class="nav-cta"
            :class="{ active: $route.path === '/auth/login' }"
          >
            Sign In
          </NuxtLink>
        </template>
      </nav>
    </div>

    <!-- Progress bar strip at bottom -->
    <div class="header-rule" aria-hidden="true" />
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();

async function handleLogout() {
  await logout();
}
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: rgba(13, 13, 15, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--container-px);
  height: 3.5rem;
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

/* Wordmark */
.wordmark {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-decoration: none;
  flex-shrink: 0;
}

.wordmark-serif {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.wordmark-dot {
  color: var(--accent);
  font-size: var(--text-xl);
  line-height: 1;
  font-weight: 700;
}

.wordmark-sans {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Nav */
.nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-left: auto;
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  letter-spacing: 0.01em;
  padding: var(--space-2) var(--space-1);
  transition: color var(--transition-fast);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transition: transform var(--transition-fast);
  transform-origin: left;
}

.nav-link:hover,
.nav-link.active {
  color: var(--text-primary);
}

.nav-link.active::after,
.nav-link:hover::after {
  transform: scaleX(1);
}

/* CTA button */
.nav-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  background: var(--accent-dim);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-full);
  color: var(--accent);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  cursor: pointer;
  text-decoration: none;
  transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}

.nav-cta:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.5);
  color: var(--accent-hover);
}

/* Bottom rule */
.header-rule {
  height: 1px;
  background: var(--border);
}
</style>
