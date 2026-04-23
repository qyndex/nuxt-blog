import type { PostWithRelations, CommentWithAuthor } from "~/types/database";

/**
 * GET /api/posts/:slug
 * Fetch a single published post by slug with comments and author profiles.
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required" });
  }

  const supabase = useSupabaseServer();

  // Fetch the post with category and author
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (postError || !post) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  // Fetch comments with author profiles
  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(*)")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  return {
    ...(post as PostWithRelations),
    comments: (comments ?? []) as CommentWithAuthor[],
  };
});
