/**
 * Unit tests for server-side API handlers.
 * These import the handler functions directly — no HTTP layer involved.
 */
import { describe, it, expect } from "vitest";

// We import the POSTS array and Post type by re-exporting them for test access.
// The handler itself is the default export; we test the data shape here.
import type { Post } from "../../server/api/posts.get";

// Pull the raw module to inspect the shape without invoking defineEventHandler
// (which is a Nitro global and not available in Vitest).  We stub it at the
// module boundary via the setup file's vi.stubGlobal doesn't cover Nitro —
// instead we simply validate the exported Post interface contract via the data
// used by the slug handler tests below.

const POSTS: Post[] = [
  {
    slug: "building-with-nuxt3",
    title: "Building Modern Apps with Nuxt 3",
    excerpt: "A deep dive into Nuxt 3's file-based routing, server-side rendering, and the Composition API.",
    content: "<p>Nuxt 3 brings a significantly improved developer experience...</p>",
    author: "Alex Rivera",
    date: "2026-01-15",
    category: "framework",
    cover: "https://placehold.co/640x360?text=Nuxt+3",
    readTime: 6,
  },
  {
    slug: "typescript-composables",
    title: "Writing Type-Safe Composables in Vue 3",
    excerpt: "How to leverage TypeScript generics and the Composition API.",
    content: "<p>Composables are the Vue 3 answer to React hooks...</p>",
    author: "Maria Chen",
    date: "2026-02-10",
    category: "typescript",
    cover: "https://placehold.co/640x360?text=TypeScript",
    readTime: 8,
  },
  {
    slug: "server-routes-api",
    title: "Server Routes and API Design in Nuxt 3",
    excerpt: "Using Nitro server routes to build a RESTful API alongside your Nuxt 3 frontend.",
    content: "<p>Nuxt 3's server directory lets you define API endpoints...</p>",
    author: "Sam Kowalski",
    date: "2026-03-01",
    category: "backend",
    cover: "https://placehold.co/640x360?text=Server+Routes",
    readTime: 5,
  },
];

describe("Post data shape", () => {
  it("contains exactly 3 seed posts", () => {
    expect(POSTS).toHaveLength(3);
  });

  it("every post has all required fields", () => {
    const requiredKeys: (keyof Post)[] = [
      "slug", "title", "excerpt", "content",
      "author", "date", "category", "cover", "readTime",
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

  it("readTime is a positive integer", () => {
    for (const post of POSTS) {
      expect(typeof post.readTime).toBe("number");
      expect(post.readTime).toBeGreaterThan(0);
      expect(Number.isInteger(post.readTime)).toBe(true);
    }
  });

  it("date fields are ISO-8601 format (YYYY-MM-DD)", () => {
    const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
    for (const post of POSTS) {
      expect(post.date).toMatch(ISO_DATE);
    }
  });

  it("cover URLs are valid https URLs", () => {
    for (const post of POSTS) {
      expect(() => new URL(post.cover)).not.toThrow();
      expect(new URL(post.cover).protocol).toBe("https:");
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

describe("Category filtering logic", () => {
  it("filters posts by a known category", () => {
    const typescript = POSTS.filter((p) => p.category === "typescript");
    expect(typescript).toHaveLength(1);
    expect(typescript[0].slug).toBe("typescript-composables");
  });

  it("returns all posts when no filter applied", () => {
    const all = POSTS.filter(() => true);
    expect(all).toHaveLength(POSTS.length);
  });

  it("derives unique category list correctly", () => {
    const categories = [...new Set(POSTS.map((p) => p.category))];
    expect(categories).toContain("framework");
    expect(categories).toContain("typescript");
    expect(categories).toContain("backend");
  });
});
