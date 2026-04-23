<template>
  <main class="container">
    <div class="page-header">
      <NuxtLink href="/admin/posts" class="back-link">← Back to posts</NuxtLink>
      <h1>New Post</h1>
    </div>

    <div v-if="errorMsg" class="error-banner" role="alert">
      {{ errorMsg }}
    </div>

    <form @submit.prevent="handleCreate" class="post-form" novalidate>
      <div class="field">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Your post title"
          required
          aria-required="true"
        />
      </div>

      <div class="field">
        <label for="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          v-model="form.excerpt"
          rows="2"
          placeholder="A brief summary of your post"
        ></textarea>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="category">Category</label>
          <select id="category" v-model="form.category_id">
            <option value="">None</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="coverUrl">Cover Image URL</label>
          <input
            id="coverUrl"
            v-model="form.cover_image_url"
            type="url"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div class="field">
        <label for="content">Content (HTML)</label>
        <textarea
          id="content"
          v-model="form.content"
          rows="16"
          placeholder="Write your post content in HTML…"
          required
          aria-required="true"
        ></textarea>
      </div>

      <div class="form-footer">
        <label class="publish-toggle">
          <input type="checkbox" v-model="form.published" />
          <span>Publish immediately</span>
        </label>

        <div class="form-actions">
          <NuxtLink href="/admin/posts" class="btn-cancel">Cancel</NuxtLink>
          <button type="submit" class="btn-primary" :disabled="submitting">
            {{ submitting ? "Creating…" : form.published ? "Publish" : "Save Draft" }}
          </button>
        </div>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import type { Category } from "~/types/database";

definePageMeta({ middleware: "auth" });
useHead({ title: "New Post — The Dev Blog" });

const { authFetch } = useAuth();
const router = useRouter();

const form = reactive({
  title: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  category_id: "",
  published: false,
});

const categories = ref<Category[]>([]);
const errorMsg = ref("");
const submitting = ref(false);

// Load categories
onMounted(async () => {
  try {
    const data = await $fetch<{ categories: Category[] }>("/api/categories");
    categories.value = data.categories;
  } catch {
    // Categories are optional — form still works without them
  }
});

async function handleCreate() {
  errorMsg.value = "";

  if (!form.title.trim()) {
    errorMsg.value = "Title is required";
    return;
  }
  if (!form.content.trim()) {
    errorMsg.value = "Content is required";
    return;
  }

  submitting.value = true;
  try {
    const post = await authFetch<{ slug: string }>("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        excerpt: form.excerpt || undefined,
        cover_image_url: form.cover_image_url || undefined,
        category_id: form.category_id || undefined,
        published: form.published,
      }),
    });

    await router.push(form.published ? `/posts/${post.slug}` : "/admin/posts");
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : "Failed to create post";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.container { max-width: 48rem; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

.page-header { margin-bottom: 2rem; }
.back-link { color: #64748b; text-decoration: none; font-size: 0.875rem; }
.back-link:hover { color: #1e293b; }
h1 { font-size: 1.75rem; font-weight: 700; color: #1e293b; margin-top: 0.5rem; }

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.post-form { display: flex; flex-direction: column; gap: 1.25rem; }

.field { display: flex; flex-direction: column; gap: 0.375rem; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

label { font-size: 0.875rem; font-weight: 500; color: #374151; }

input, select, textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  color: #1e293b;
  background: white;
  font-family: inherit;
  box-sizing: border-box;
}

textarea { resize: vertical; line-height: 1.6; }

input:focus, select:focus, textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -1px;
  border-color: #3b82f6;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.publish-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.publish-toggle input[type="checkbox"] {
  width: auto;
  accent-color: #1e40af;
}

.form-actions { display: flex; gap: 0.75rem; }

.btn-cancel {
  padding: 0.5rem 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) { background: #1d4ed8; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
