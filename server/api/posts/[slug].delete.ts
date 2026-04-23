/**
 * DELETE /api/posts/:slug
 * Delete a post. Only the author can delete their own posts.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required" });
  }

  // Find the post and verify ownership
  const { data: existing, error: findError } = await client
    .from("posts")
    .select("id, author_id")
    .eq("slug", slug)
    .single();

  if (findError || !existing) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  if (existing.author_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "Not authorized to delete this post" });
  }

  const { error: deleteError } = await client
    .from("posts")
    .delete()
    .eq("id", existing.id);

  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete post: ${deleteError.message}`,
    });
  }

  setResponseStatus(event, 204);
  return null;
});
