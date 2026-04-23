import type { CommentPayload } from "~/types/database";

/**
 * POST /api/posts/:slug/comments
 * Add a comment to a published post. Requires authentication.
 */
export default defineEventHandler(async (event) => {
  const { user, client } = await requireAuth(event);
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Slug is required" });
  }

  const body = await readBody<CommentPayload>(event);

  if (!body.content?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Comment content is required" });
  }

  // Verify the post exists and is published
  const supabase = useSupabaseServer();
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (postError || !post) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }

  const { data: comment, error: insertError } = await client
    .from("comments")
    .insert({
      post_id: post.id,
      user_id: user.id,
      content: body.content.trim(),
    })
    .select("*, profiles(*)")
    .single();

  if (insertError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to add comment: ${insertError.message}`,
    });
  }

  setResponseStatus(event, 201);
  return comment;
});
