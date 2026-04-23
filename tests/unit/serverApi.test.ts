/**
 * Unit tests for data shape contracts.
 * These verify the TypeScript interfaces match expected structures.
 */
import { describe, it, expect } from "vitest";
import type {
  Post,
  PostWithRelations,
  Category,
  Profile,
  Comment,
  CommentWithAuthor,
  PostPayload,
} from "../../types/database";

// Seed data matching supabase/seed.sql
const PROFILES: Profile[] = [
  {
    id: "d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a",
    username: "alexrivera",
    full_name: "Alex Rivera",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    bio: "Full-stack developer, Nuxt enthusiast, and open-source contributor.",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    username: "mariachen",
    full_name: "Maria Chen",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    bio: "TypeScript advocate and Vue.js core team member.",
    created_at: "2026-01-01T00:00:00Z",
  },
];

const CATEGORIES: Category[] = [
  { id: "c0000001-0000-0000-0000-000000000001", name: "Framework", slug: "framework", created_at: "2026-01-01T00:00:00Z" },
  { id: "c0000001-0000-0000-0000-000000000002", name: "TypeScript", slug: "typescript", created_at: "2026-01-01T00:00:00Z" },
  { id: "c0000001-0000-0000-0000-000000000003", name: "Backend", slug: "backend", created_at: "2026-01-01T00:00:00Z" },
];

const POSTS: PostWithRelations[] = [
  {
    id: "p0000001-0000-0000-0000-000000000001",
    title: "Building Modern Apps with Nuxt 3",
    slug: "building-with-nuxt3",
    content: "<p>Content here</p>",
    excerpt: "A deep dive into Nuxt 3's file-based routing.",
    cover_image_url: "https://placehold.co/800x400/1e40af/ffffff?text=Nuxt+3",
    category_id: "c0000001-0000-0000-0000-000000000001",
    author_id: "d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a",
    published: true,
    published_at: "2026-01-15T10:00:00Z",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    categories: CATEGORIES[0],
    profiles: PROFILES[0],
  },
  {
    id: "p0000001-0000-0000-0000-000000000002",
    title: "Writing Type-Safe Composables in Vue 3",
    slug: "typescript-composables",
    content: "<p>Composables are the Vue 3 answer to React hooks.</p>",
    excerpt: "How to leverage TypeScript generics.",
    cover_image_url: "https://placehold.co/800x400/3b82f6/ffffff?text=TypeScript",
    category_id: "c0000001-0000-0000-0000-000000000002",
    author_id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    published: true,
    published_at: "2026-02-10T14:00:00Z",
    created_at: "2026-02-10T14:00:00Z",
    updated_at: "2026-02-10T14:00:00Z",
    categories: CATEGORIES[1],
    profiles: PROFILES[1],
  },
  {
    id: "p0000001-0000-0000-0000-000000000003",
    title: "Server Routes and API Design in Nuxt 3",
    slug: "server-routes-api",
    content: "<p>Nuxt 3's server directory lets you define API endpoints.</p>",
    excerpt: "Using Nitro server routes.",
    cover_image_url: "https://placehold.co/800x400/10b981/ffffff?text=API+Design",
    category_id: "c0000001-0000-0000-0000-000000000003",
    author_id: "d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a",
    published: true,
    published_at: "2026-03-01T09:00:00Z",
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-01T09:00:00Z",
    categories: CATEGORIES[2],
    profiles: PROFILES[0],
  },
];

describe("Post data shape", () => {
  it("seed posts have all required fields", () => {
    const requiredKeys: (keyof Post)[] = [
      "id", "slug", "title", "content",
      "author_id", "published", "created_at", "updated_at",
    ];
    for (const post of POSTS) {
      for (const key of requiredKeys) {
        expect(post[key]).toBeDefined();
      }
    }
  });

  it("slugs are unique", () => {
    const slugs = POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("published posts have published_at set", () => {
    for (const post of POSTS) {
      if (post.published) {
        expect(post.published_at).toBeTruthy();
      }
    }
  });

  it("posts have joined category and profile relations", () => {
    for (const post of POSTS) {
      expect(post.categories).toBeTruthy();
      expect(post.categories!.name).toBeTruthy();
      expect(post.categories!.slug).toBeTruthy();
      expect(post.profiles).toBeTruthy();
      expect(post.profiles!.full_name).toBeTruthy();
    }
  });

  it("slug lookup returns the correct post", () => {
    const slug = "typescript-composables";
    const found = POSTS.find((p) => p.slug === slug);
    expect(found).toBeDefined();
    expect(found!.title).toBe("Writing Type-Safe Composables in Vue 3");
  });

  it("slug lookup returns undefined for unknown slug", () => {
    const found = POSTS.find((p) => p.slug === "does-not-exist");
    expect(found).toBeUndefined();
  });
});

describe("Category data shape", () => {
  it("contains 3 seed categories", () => {
    expect(CATEGORIES).toHaveLength(3);
  });

  it("every category has name and slug", () => {
    for (const cat of CATEGORIES) {
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
    }
  });

  it("slugs are unique", () => {
    const slugs = CATEGORIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("Category filtering logic", () => {
  it("filters posts by category slug via relation", () => {
    const typescript = POSTS.filter(
      (p) => p.categories?.slug === "typescript"
    );
    expect(typescript).toHaveLength(1);
    expect(typescript[0].slug).toBe("typescript-composables");
  });

  it("returns all posts when no filter applied", () => {
    const all = POSTS.filter(() => true);
    expect(all).toHaveLength(POSTS.length);
  });

  it("derives unique category list from posts", () => {
    const categorySlugs = [
      ...new Set(POSTS.map((p) => p.categories?.slug).filter(Boolean)),
    ];
    expect(categorySlugs).toContain("framework");
    expect(categorySlugs).toContain("typescript");
    expect(categorySlugs).toContain("backend");
  });
});

describe("PostPayload validation", () => {
  it("valid payload has required fields", () => {
    const payload: PostPayload = {
      title: "Test Post",
      content: "<p>Test content</p>",
    };
    expect(payload.title).toBeTruthy();
    expect(payload.content).toBeTruthy();
  });

  it("payload accepts optional fields", () => {
    const payload: PostPayload = {
      title: "Test Post",
      content: "<p>Test content</p>",
      excerpt: "Test excerpt",
      cover_image_url: "https://example.com/img.jpg",
      category_id: "some-uuid",
      published: true,
    };
    expect(payload.published).toBe(true);
    expect(payload.category_id).toBe("some-uuid");
  });
});

describe("Profile data shape", () => {
  it("profiles have username and full_name", () => {
    for (const profile of PROFILES) {
      expect(profile.username).toBeTruthy();
      expect(profile.full_name).toBeTruthy();
    }
  });

  it("profile IDs are unique", () => {
    const ids = PROFILES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
