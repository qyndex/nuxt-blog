/** Database row types matching the Supabase schema */

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  author_id: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

/** Post with joined relations (used in API responses) */
export interface PostWithRelations extends Post {
  categories: Category | null;
  profiles: Profile | null;
}

/** Post detail with comments */
export interface PostDetail extends PostWithRelations {
  comments: CommentWithAuthor[];
}

/** Comment with author profile */
export interface CommentWithAuthor extends Comment {
  profiles: Profile | null;
}

/** API response for post listing */
export interface PostListResponse {
  posts: PostWithRelations[];
  total: number;
  page: number;
  per_page: number;
}

/** Create/update post payload */
export interface PostPayload {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  category_id?: string;
  published?: boolean;
}

/** Create comment payload */
export interface CommentPayload {
  content: string;
}
