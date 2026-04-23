# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nuxt Blog — Full-featured blog platform with Supabase backend, authentication, CRUD operations, comments, and admin dashboard.

Built with Nuxt 3, Vue 3, TypeScript, Supabase (PostgreSQL + Auth), and scoped CSS.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run preview          # Preview production build
npx nuxi typecheck      # Type check
npm run lint             # ESLint
npm run test             # Unit tests (vitest)
npm run test:e2e         # E2E tests (playwright)
npm run db:migrate       # Apply Supabase migrations
npm run db:seed          # Seed database
npm run db:reset         # Reset + re-seed database
```

## Architecture

- `pages/` — File-based routing (`.vue` files)
  - `pages/auth/` — Login and signup
  - `pages/admin/` — Protected post management (CRUD)
  - `pages/posts/[slug].vue` — Post detail with comments
- `components/` — Auto-imported Vue components (AppHeader, AppFooter, ArticleCard)
- `composables/` — Vue composables (auto-imported)
  - `useAuth.ts` — Supabase Auth (login, signup, logout, session management)
  - `usePosts.ts` — Post fetching helpers
- `server/` — Nitro server routes and API endpoints
  - `server/api/posts.get.ts` — List published posts (paginated, filterable)
  - `server/api/posts.post.ts` — Create post (authenticated)
  - `server/api/posts/[slug].get.ts` — Get post with comments
  - `server/api/posts/[slug].put.ts` — Update post (author only)
  - `server/api/posts/[slug].delete.ts` — Delete post (author only)
  - `server/api/posts/[slug]/comments.post.ts` — Add comment (authenticated)
  - `server/api/posts/mine.get.ts` — List user's own posts (authenticated)
  - `server/api/categories.get.ts` — List categories
  - `server/utils/supabase.ts` — Supabase client helpers (server/user/auth)
- `middleware/auth.ts` — Route guard for admin pages
- `types/database.ts` — Shared TypeScript types matching DB schema
- `supabase/migrations/` — Database schema (profiles, categories, posts, comments + RLS)
- `supabase/seed.sql` — Seed data (2 authors, 3 categories, 6 posts, 5 comments)

## Database

- **Supabase PostgreSQL** with Row Level Security (RLS)
- Tables: `profiles`, `categories`, `posts`, `comments`
- Published posts readable by all, drafts only by author
- Comments insertable by authenticated users
- Triggers: auto-create profile on signup, auto-update `updated_at`

## Auth

- Supabase Auth (email/password)
- Client-side: `useAuth()` composable manages session state
- Server-side: `requireAuth(event)` extracts user from Authorization header
- Protected routes use `definePageMeta({ middleware: 'auth' })`

## API Response Envelopes

- List endpoints return `{ posts: [...], total, page, per_page }` or `{ categories: [...] }`
- Detail endpoints return the object directly with joined relations
- Mutations return the created/updated object

## Rules

- Use Composition API (`<script setup>`) — no Options API
- TypeScript strict mode — no `any` types
- Auto-imports for components, composables, and utils
- Use `useFetch` / `useLazyFetch` for data fetching in pages
- Use `$fetch` for imperative fetches (mutations, onMounted)
- Server routes use `defineEventHandler` with proper error handling via `createError`
- All authenticated API calls pass `Authorization: Bearer <token>` header
- Database types in `types/database.ts` must match migration schema
