import type { PostWithRelations, Category } from "~/types/database";

export function usePosts() {
  const { data: postData, pending, error, refresh } = useLazyFetch<{
    posts: PostWithRelations[];
    total: number;
  }>("/api/posts");

  const posts = computed(() => postData.value?.posts ?? []);
  const latestPosts = computed(() => posts.value.slice(0, 3));

  const { data: catData } = useLazyFetch<{ categories: Category[] }>("/api/categories");
  const categories = computed(() => catData.value?.categories ?? []);

  return { posts, latestPosts, categories, pending, error, refresh };
}
