import type { PostWithRelations } from "~/types/database";

/**
 * GET /api/posts
 * List published posts with optional category filtering and pagination.
 *
 * Query params:
 *   ?category=<slug>    — filter by category slug
 *   ?page=<number>      — page number (default 1)
 *   ?per_page=<number>  — items per page (default 12)
 *   ?search=<string>    — search title/excerpt
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(50, Math.max(1, Number(query.per_page) || 12));
  const categorySlug = (query.category as string) || null;
  const search = (query.search as string) || null;

  const supabase = useSupabaseServer();

  // Build the query for published posts with relations
  let dbQuery = supabase
    .from("posts")
    .select("*, categories(*), profiles(*)", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false });

  // Apply category filter
  if (categorySlug) {
    // Look up category id by slug
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (cat) {
      dbQuery = dbQuery.eq("category_id", cat.id);
    } else {
      // Unknown category — return empty result
      return { posts: [], total: 0, page, per_page: perPage };
    }
  }

  // Apply search filter
  if (search) {
    dbQuery = dbQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  // Apply pagination
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  dbQuery = dbQuery.range(from, to);

  const { data, count, error } = await dbQuery;

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch posts",
    });
  }

  return {
    posts: (data ?? []) as PostWithRelations[],
    total: count ?? 0,
    page,
    per_page: perPage,
  };
});
