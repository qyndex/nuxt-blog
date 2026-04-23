import type { Post } from "./posts.get";

const POSTS: Post[] = [
  {
    slug: "building-with-nuxt3",
    title: "Building Modern Apps with Nuxt 3",
    excerpt: "A deep dive into Nuxt 3's file-based routing, server-side rendering, and the Composition API.",
    content: "<p>Nuxt 3 brings a significantly improved developer experience...</p><p>With auto-imports, server routes, and Nitro engine, you can build full-stack apps in record time.</p>",
    author: "Alex Rivera",
    date: "2026-01-15",
    category: "framework",
    cover: "https://placehold.co/640x360?text=Nuxt+3",
    readTime: 6,
  },
  {
    slug: "typescript-composables",
    title: "Writing Type-Safe Composables in Vue 3",
    excerpt: "How to leverage TypeScript generics and the Composition API to write reusable, fully typed composables.",
    content: "<p>Composables are the Vue 3 answer to React hooks...</p><p>TypeScript makes them even more powerful with proper inference and constraint checking.</p>",
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
    content: "<p>Nuxt 3's server directory lets you define API endpoints that run on the Nitro engine...</p>",
    author: "Sam Kowalski",
    date: "2026-03-01",
    category: "backend",
    cover: "https://placehold.co/640x360?text=Server+Routes",
    readTime: 5,
  },
];

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: "Post not found" });
  }
  return post;
});
