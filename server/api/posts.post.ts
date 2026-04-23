import type { PostPayload } from "~/types/database";

/**
 * POST /api/posts
 * Create a new post. Requires authentication.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);
  const body = await readBody<PostPayload>(event);

  if (!body.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Title is required" });
  }
  if (!body.content?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Content is required" });
  }

  const slug = body.slug || slugify(body.title);

  // Check slug uniqueness
  const { data: existing } = await client
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: "A post with this slug already exists" });
  }

  const { data: post, error } = await client
    .from("posts")
    .insert({
      title: body.title.trim(),
      slug,
      content: body.content.trim(),
      excerpt: body.excerpt?.trim() || null,
      cover_image_url: body.cover_image_url || null,
      category_id: body.category_id || null,
      author_id: user.id,
      published: body.published ?? false,
      published_at: body.published ? new Date().toISOString() : null,
    })
    .select("*, categories(*), profiles(*)")
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create post: ${error.message}`,
    });
  }

  setResponseStatus(event, 201);
  return post;
});
