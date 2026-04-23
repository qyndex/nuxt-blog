<template>
  <main class="container">
    <div class="page-header">
      <NuxtLink href="/admin/posts" class="back-link">← Back to posts</NuxtLink>
      <h1>Edit Post</h1>
    </div>

    <div v-if="loading" class="loading" role="status">Loading post…</div>

    <div v-else-if="loadError" class="error" role="alert">
      {{ loadError }}
    </div>

    <template v-else>
      <div v-if="errorMsg" class="error-banner" role="alert">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="success-banner" role="status">
        {{ successMsg }}
      </div>

      <form @submit.prevent="handleUpdate" class="post-form" novalidate>
        <div class="field">
          <label for="title">Title</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            aria-required="true"
          />
        </div>

        <div class="field">
          <label for="slug">Slug</label>
          <input id="slug" v-model="form.slug" type="text" />
        </div>

        <div class="field">
          <label for="excerpt">Excerpt</label>
          <textarea id="excerpt" v-model="form.excerpt" rows="2"></textarea>
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
            <input id="coverUrl" v-model="form.cover_image_url" type="url" />
          </div>
        </div>

        <div class="field">
          <label for="content">Content (HTML)</label>
          <textarea
            id="content"
            v-model="form.content"
            rows="16"
            required
            aria-required="true"
          ></textarea>
        </div>

        <div class="form-footer">
          <label class="publish-toggle">
            <input type="checkbox" v-model="form.published" />
            <span>Published</span>
          </label>

          <div class="form-actions">
            <NuxtLink href="/admin/posts" class="btn-cancel">Cancel</NuxtLink>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? "Saving…" : "Save Changes" }}
            </button>
          </div>
        </div>
      </form>
    </template>
  </main>
</template>

<script setup lang="ts">
import type { PostWithRelations, Category } from "~/types/database";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const { authFetch } = useAuth();

const originalSlug = route.params.slug as string;

const form = reactive({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  category_id: "",
  published: false,
});

const categories = ref<Category[]>([]);
const loading = ref(true);
const loadError = ref("");
const errorMsg = ref("");
const successMsg = ref("");
const submitting = ref(false);

useHead(() => ({
  title: form.title ? `Edit: ${form.title} — The Dev Blog` : "Edit Post — The Dev Blog",
}));

onMounted(async () => {
  try {
    // Fetch categories and post in parallel
    const [catData, postData] = await Promise.all([
      $fetch<{ categories: Category[] }>("/api/categories"),
      authFetch<PostWithRelations>(`/api/posts/${originalSlug}`),
    ]);

    categories.value = catData.categories;

    form.title = postData.title;
    form.slug = postData.slug;
    form.excerpt = postData.excerpt || "";
    form.content = postData.content;
    form.cover_image_url = postData.cover_image_url || "";
    form.category_id = postData.category_id || "";
    form.published = postData.published;
  } catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : "Failed to load post";
  } finally {
    loading.value = false;
  }
});

async function handleUpdate() {
  errorMsg.value = "";
  successMsg.value = "";

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
    await authFetch(`/api/posts/${originalSlug}`, {
      method: "PUT",
      body: JSON.stringify({
        title: form.title,
        slug: form.slug || undefined,
        content: form.content,
        excerpt: form.excerpt || undefined,
        cover_image_url: form.cover_image_url || undefined,
        category_id: form.category_id || undefined,
        published: form.published,
      }),
    });

    successMsg.value = "Post saved successfully!";

    // If slug changed, redirect
    if (form.slug && form.slug !== originalSlug) {
      await navigateTo(`/admin/posts/${form.slug}/edit`);
    }
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : "Failed to save post";
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

.loading, .error { text-align: center; padding: 4rem; color: #64748b; }
.error { color: #dc2626; }

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.success-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
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
