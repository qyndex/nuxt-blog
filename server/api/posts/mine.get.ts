import type { PostWithRelations } from "~/types/database";

/**
 * GET /api/posts/mine
 * List posts owned by the authenticated user (both published and drafts).
 * Used by the admin dashboard.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);

  const { data, error } = await client
    .from("posts")
    .select("*, categories(*), profiles(*)")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch your posts",
    });
  }

  return { posts: (data ?? []) as PostWithRelations[] };
});
