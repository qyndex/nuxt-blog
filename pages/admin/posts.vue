<template>
  <main class="container">
    <div class="admin-header">
      <h1>My Posts</h1>
      <NuxtLink href="/admin/posts/new" class="btn-primary">
        + New Post
      </NuxtLink>
    </div>

    <div v-if="pending" class="loading" role="status">Loading your posts…</div>
    <div v-else-if="error" class="error" role="alert">
      Failed to load posts. <button @click="refresh()">Retry</button>
    </div>
    <div v-else-if="!posts.length" class="empty">
      <p>You haven't written any posts yet.</p>
      <NuxtLink href="/admin/posts/new" class="btn-secondary">Write your first post</NuxtLink>
    </div>

    <div v-else class="posts-table">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>
              <NuxtLink :href="`/admin/posts/${post.slug}/edit`" class="post-title">
                {{ post.title }}
              </NuxtLink>
            </td>
            <td>
              <span v-if="post.categories" class="category-badge">
                {{ post.categories.name }}
              </span>
              <span v-else class="no-category">Uncategorized</span>
            </td>
            <td>
              <span :class="['status-badge', post.published ? 'published' : 'draft']">
                {{ post.published ? "Published" : "Draft" }}
              </span>
            </td>
            <td class="date-cell">
              {{ formatDate(post.updated_at) }}
            </td>
            <td class="actions-cell">
              <NuxtLink :href="`/admin/posts/${post.slug}/edit`" class="action-link" aria-label="Edit post">
                Edit
              </NuxtLink>
              <button
                @click="handleDelete(post.slug)"
                class="action-delete"
                :aria-label="`Delete ${post.title}`"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PostWithRelations } from "~/types/database";

definePageMeta({ middleware: "auth" });
useHead({ title: "My Posts — The Dev Blog" });

const { authFetch } = useAuth();

const posts = ref<PostWithRelations[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

async function fetchPosts() {
  pending.value = true;
  error.value = null;
  try {
    const data = await authFetch<{ posts: PostWithRelations[] }>("/api/posts/mine");
    posts.value = data.posts;
  } catch (err) {
    error.value = err instanceof Error ? err : new Error("Failed to load posts");
  } finally {
    pending.value = false;
  }
}

function refresh() {
  fetchPosts();
}

async function handleDelete(slug: string) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    await authFetch(`/api/posts/${slug}`, { method: "DELETE" });
    posts.value = posts.value.filter((p) => p.slug !== slug);
  } catch {
    alert("Failed to delete post. Please try again.");
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

onMounted(fetchPosts);
</script>

<style scoped>
.container { max-width: 64rem; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 { font-size: 1.75rem; font-weight: 700; color: #1e293b; }

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  background: #1e40af;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
}

.btn-primary:hover { background: #1d4ed8; }

.btn-secondary {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border: 1px solid #1e40af;
  color: #1e40af;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.loading, .error, .empty { text-align: center; padding: 4rem; color: #64748b; }
.error { color: #dc2626; }
.error button { margin-left: 0.5rem; color: #1e40af; background: none; border: none; cursor: pointer; text-decoration: underline; }
.empty p { font-size: 1.125rem; margin-bottom: 0.5rem; }

table { width: 100%; border-collapse: collapse; }
thead { border-bottom: 2px solid #e2e8f0; }
th { text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; }
td { padding: 0.875rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }

.post-title { color: #1e293b; text-decoration: none; font-weight: 500; }
.post-title:hover { color: #1e40af; }

.category-badge { background: #eff6ff; color: #1e40af; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
.no-category { color: #94a3b8; font-size: 0.75rem; }

.status-badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.status-badge.published { background: #f0fdf4; color: #166534; }
.status-badge.draft { background: #fefce8; color: #854d0e; }

.date-cell { color: #64748b; white-space: nowrap; }

.actions-cell { display: flex; gap: 0.75rem; align-items: center; }
.action-link { color: #1e40af; text-decoration: none; font-size: 0.8125rem; font-weight: 500; }
.action-link:hover { text-decoration: underline; }
.action-delete { color: #dc2626; background: none; border: none; cursor: pointer; font-size: 0.8125rem; font-weight: 500; }
.action-delete:hover { text-decoration: underline; }
</style>
