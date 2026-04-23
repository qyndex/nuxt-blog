import type { PostPayload } from "~/types/database";

/**
 * PUT /api/posts/:slug
 * Update a post. Only the author can update their own posts.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required" });
  }

  const body = await readBody<PostPayload>(event);

  // Find the existing post and verify ownership
  const { data: existing, error: findError } = await client
    .from("posts")
    .select("id, author_id, published, published_at")
    .eq("slug", slug)
    .single();

  if (findError || !existing) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  if (existing.author_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "Not authorized to edit this post" });
  }

  // Build update payload
  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.content !== undefined) updates.content = body.content.trim();
  if (body.excerpt !== undefined) updates.excerpt = body.excerpt?.trim() || null;
  if (body.cover_image_url !== undefined) updates.cover_image_url = body.cover_image_url || null;
  if (body.category_id !== undefined) updates.category_id = body.category_id || null;

  // Handle publish state transitions
  if (body.published !== undefined) {
    updates.published = body.published;
    if (body.published && !existing.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  // Handle slug change
  if (body.slug && body.slug !== slug) {
    const { data: slugExists } = await client
      .from("posts")
      .select("id")
      .eq("slug", body.slug)
      .single();
    if (slugExists) {
      throw createError({ statusCode: 409, statusMessage: "A post with this slug already exists" });
    }
    updates.slug = body.slug;
  }

  const { data: post, error: updateError } = await client
    .from("posts")
    .update(updates)
    .eq("id", existing.id)
    .select("*, categories(*), profiles(*)")
    .single();

  if (updateError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update post: ${updateError.message}`,
    });
  }

  return post;
});
