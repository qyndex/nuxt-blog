import type { Category } from "~/types/database";

/**
 * GET /api/categories
 * List all categories.
 */
export default defineEventHandler(async () => {
  const supabase = useSupabaseServer();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch categories",
    });
  }

  return { categories: (data ?? []) as Category[] };
});
