import type { Post } from "~/server/api/posts.get";

export function usePosts() {
  const { data: posts, pending, error, refresh } = useLazyFetch<Post[]>("/api/posts");

  const latestPosts = computed(() => (posts.value ?? []).slice(0, 3));
  const categories = computed(() => [
    ...new Set((posts.value ?? []).map((p) => p.category)),
  ]);

  return { posts, latestPosts, categories, pending, error, refresh };
}
