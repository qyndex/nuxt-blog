<template>
  <main class="container">
    <div v-if="pending" class="loading" role="status">Loading…</div>
    <div v-else-if="error || !post" class="error" role="alert">
      <h1>Post not found</h1>
      <NuxtLink href="/">← Back to blog</NuxtLink>
    </div>
    <article v-else>
      <header class="post-header">
        <span v-if="post.categories" class="category">{{ post.categories.name }}</span>
        <h1>{{ post.title }}</h1>
        <div class="meta">
          <span v-if="post.profiles">{{ post.profiles.full_name || post.profiles.username }}</span>
          <span>·</span>
          <time v-if="post.published_at" :datetime="post.published_at">
            {{ formatDate(post.published_at) }}
          </time>
        </div>
      </header>

      <img
        v-if="post.cover_image_url"
        :src="post.cover_image_url"
        :alt="post.title"
        class="cover-image"
        loading="lazy"
      />

      <div class="prose" v-html="post.content" />

      <!-- Comments Section -->
      <section class="comments-section">
        <h2>Comments ({{ comments.length }})</h2>

        <!-- Add comment form (logged-in users only) -->
        <div v-if="user" class="comment-form">
          <form @submit.prevent="handleAddComment">
            <textarea
              v-model="newComment"
              placeholder="Write a comment…"
              rows="3"
              required
              aria-label="Write a comment"
            ></textarea>
            <button type="submit" class="btn-comment" :disabled="submittingComment">
              {{ submittingComment ? "Posting…" : "Post Comment" }}
            </button>
          </form>
        </div>
        <div v-else class="login-prompt">
          <NuxtLink href="/auth/login">Sign in</NuxtLink> to leave a comment.
        </div>

        <!-- Comment list -->
        <div v-if="!comments.length" class="no-comments">
          No comments yet. Be the first to share your thoughts!
        </div>
        <div v-else class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <strong>{{ comment.profiles?.full_name || comment.profiles?.username || "Anonymous" }}</strong>
              <time :datetime="comment.created_at">{{ formatDate(comment.created_at) }}</time>
            </div>
            <p class="comment-body">{{ comment.content }}</p>
          </div>
        </div>
      </section>

      <footer class="post-footer">
        <NuxtLink href="/" class="back-link">← All Posts</NuxtLink>
      </footer>
    </article>
  </main>
</template>

<script setup lang="ts">
import type { PostWithRelations, CommentWithAuthor } from "~/types/database";

const route = useRoute();
const { user, authFetch } = useAuth();

interface PostDetailResponse extends PostWithRelations {
  comments: CommentWithAuthor[];
}

const { data: postData, pending, error } = useLazyFetch<PostDetailResponse>(
  `/api/posts/${route.params.slug}`
);

const post = computed(() => postData.value ?? null);
const comments = ref<CommentWithAuthor[]>([]);
const newComment = ref("");
const submittingComment = ref(false);

// Sync comments from post data
watch(postData, (val) => {
  if (val?.comments) {
    comments.value = val.comments;
  }
}, { immediate: true });

useHead(() => ({
  title: post.value ? `${post.value.title} — The Dev Blog` : "Post — The Dev Blog",
  meta: post.value?.excerpt
    ? [{ name: "description", content: post.value.excerpt }]
    : [],
}));

async function handleAddComment() {
  if (!newComment.value.trim()) return;
  submittingComment.value = true;

  try {
    const comment = await authFetch<CommentWithAuthor>(
      `/api/posts/${route.params.slug}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ content: newComment.value }),
      }
    );
    comments.value.push(comment);
    newComment.value = "";
  } catch {
    alert("Failed to post comment. Please try again.");
  } finally {
    submittingComment.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

<style scoped>
.container { max-width: 48rem; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
.post-header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
.category { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #1e40af; }
h1 { font-size: 2rem; font-weight: 800; margin: 0.5rem 0 1rem; line-height: 1.2; }
.meta { display: flex; gap: 0.5rem; font-size: 0.875rem; color: #94a3b8; flex-wrap: wrap; }

.cover-image {
  width: 100%;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  max-height: 24rem;
  object-fit: cover;
}

.prose { line-height: 1.8; color: #374151; }
.prose :deep(h2) { font-size: 1.375rem; font-weight: 700; margin: 2rem 0 0.75rem; color: #1e293b; }
.prose :deep(p) { margin-bottom: 1rem; }
.prose :deep(pre) { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
.prose :deep(code) { font-family: ui-monospace, monospace; font-size: 0.875em; }

/* Comments */
.comments-section { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #f1f5f9; }
.comments-section h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; color: #1e293b; }

.comment-form { margin-bottom: 2rem; }
.comment-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 0.9375rem;
  resize: vertical;
  box-sizing: border-box;
}
.comment-form textarea:focus { outline: 2px solid #3b82f6; outline-offset: -1px; border-color: #3b82f6; }

.btn-comment {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
}
.btn-comment:hover:not(:disabled) { background: #1d4ed8; }
.btn-comment:disabled { opacity: 0.6; cursor: not-allowed; }

.login-prompt {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}
.login-prompt a { color: #1e40af; text-decoration: none; font-weight: 500; }
.login-prompt a:hover { text-decoration: underline; }

.no-comments { text-align: center; color: #94a3b8; padding: 2rem; font-size: 0.875rem; }

.comment-list { display: flex; flex-direction: column; gap: 1rem; }
.comment {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 0.5rem;
  padding: 1rem;
}
.comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.comment-header strong { font-size: 0.875rem; color: #1e293b; }
.comment-header time { font-size: 0.75rem; color: #94a3b8; }
.comment-body { font-size: 0.875rem; color: #374151; line-height: 1.6; margin: 0; }

.post-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; }
.back-link { color: #1e40af; text-decoration: none; font-weight: 500; }
.loading, .error { text-align: center; padding: 4rem; color: #94a3b8; }
</style>
