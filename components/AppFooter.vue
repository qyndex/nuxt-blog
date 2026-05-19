<template>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-top">
        <!-- Brand column -->
        <div class="footer-brand">
          <span class="brand-name" aria-label="The Dev Blog">
            <span class="brand-serif">The Dev</span>
            <span class="brand-dot" aria-hidden="true">·</span>
            <span class="brand-sans">Blog</span>
          </span>
          <p class="brand-tagline">
            Engineering insights for the modern web.
          </p>
        </div>

        <!-- Links columns -->
        <nav class="footer-links" aria-label="Footer navigation">
          <div class="footer-col">
            <h3 class="footer-col-label">Explore</h3>
            <ul class="footer-list" role="list">
              <li><NuxtLink href="/" class="footer-link">Home</NuxtLink></li>
              <li><NuxtLink href="/auth/login" class="footer-link">Sign In</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3 class="footer-col-label">Connect</h3>
            <ul class="footer-list" role="list">
              <li>
                <a href="/rss.xml" class="footer-link" aria-label="RSS feed">
                  RSS Feed
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  class="footer-link"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label="GitHub (opens in new tab)"
                >
                  GitHub
                  <svg class="link-ext" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path d="M2.5 9.5L9.5 2.5M5.5 2.5h4v4" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/privacy" class="footer-link">Privacy</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom" role="contentinfo">
        <p class="footer-copy">
          &copy; {{ year }} The Dev Blog
        </p>
        <p class="footer-built">
          Built with
          <a href="https://nuxt.com" class="footer-link-inline" rel="noopener noreferrer" target="_blank" aria-label="Nuxt.js website (opens in new tab)">Nuxt 3</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: var(--bg-raised);
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--container-px);
}

/* Top section */
.footer-top {
  display: flex;
  gap: var(--space-12);
  padding: var(--space-12) 0 var(--space-8);
  flex-wrap: wrap;
}

/* Brand */
.footer-brand {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.brand-name {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.brand-serif {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.brand-dot {
  color: var(--accent);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1;
}

.brand-sans {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.brand-tagline {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 24ch;
}

/* Footer links grid */
.footer-links {
  display: flex;
  gap: var(--space-12);
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 100px;
}

.footer-col-label {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.footer-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--text-primary);
}

.link-ext {
  width: 10px;
  height: 10px;
  opacity: 0.6;
}

/* Bottom bar */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5) 0;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  gap: var(--space-3);
}

.footer-copy,
.footer-built {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.footer-link-inline {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link-inline:hover {
  color: var(--accent);
}

@media (max-width: 640px) {
  .footer-top {
    flex-direction: column;
    gap: var(--space-8);
  }
  .footer-links {
    gap: var(--space-8);
  }
}
</style>
