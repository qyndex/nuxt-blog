<template>
  <header class="site-header">
    <div class="container">
      <NuxtLink href="/" class="logo" aria-label="Home">The Dev Blog</NuxtLink>
      <nav aria-label="Main navigation">
        <NuxtLink href="/" :class="{ active: $route.path === '/' }">Home</NuxtLink>
        <template v-if="user">
          <NuxtLink href="/admin/posts" :class="{ active: $route.path.startsWith('/admin') }">
            My Posts
          </NuxtLink>
          <button @click="handleLogout" class="nav-btn" aria-label="Sign out">
            Sign Out
          </button>
        </template>
        <template v-else>
          <NuxtLink href="/auth/login" :class="{ active: $route.path === '/auth/login' }">
            Sign In
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const { user, logout } = useAuth();

async function handleLogout() {
  await logout();
}
</script>

<style scoped>
.site-header { background: white; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 10; }
.container { max-width: 72rem; margin: 0 auto; padding: 0 1.5rem; display: flex; align-items: center; gap: 2rem; height: 4rem; }
.logo { font-weight: 700; font-size: 1.125rem; text-decoration: none; color: #1e293b; }
nav { display: flex; gap: 1.5rem; margin-left: auto; align-items: center; }
nav a { color: #64748b; text-decoration: none; font-size: 0.9375rem; }
nav a.active, nav a:hover { color: #1e293b; }
.nav-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.9375rem;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}
.nav-btn:hover { color: #1e293b; }
</style>
