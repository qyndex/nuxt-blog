-- ============================================================
-- Seed Data — Nuxt Blog
-- ============================================================
-- Note: In production, profiles are auto-created via trigger on auth.users.
-- For local dev with Supabase CLI, create test users first via the dashboard
-- or `supabase auth signup`, then seed profiles here.

-- Two author profiles (UUIDs match test users created in Supabase dashboard)
-- Seed auth.users first (profiles.id FKs to auth.users); the handle_new_user
-- trigger then creates base profiles, which the INSERT below enriches.
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, instance_id, aud, role) values
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a','alexrivera@example.com',crypt('password123',gen_salt('bf')),now(),'{"username":"alexrivera","full_name":"Alex Rivera","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=alex"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated'),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d','mariachen@example.com',crypt('password123',gen_salt('bf')),now(),'{"username":"mariachen","full_name":"Maria Chen","avatar_url":"https://api.dicebear.com/7.x/avataaars/svg?seed=maria"}'::jsonb,now(),now(),'00000000-0000-0000-0000-000000000000','authenticated','authenticated')
on conflict (id) do nothing;

insert into profiles (id, username, full_name, avatar_url, bio) values
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'alexrivera', 'Alex Rivera', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', 'Full-stack developer, Nuxt enthusiast, and open-source contributor.'),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'mariachen', 'Maria Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', 'TypeScript advocate and Vue.js core team member.')
on conflict (id) do update set username=excluded.username, full_name=excluded.full_name, avatar_url=excluded.avatar_url, bio=excluded.bio;

-- Categories
insert into categories (id, name, slug) values
  ('c0000001-0000-0000-0000-000000000001', 'Framework', 'framework'),
  ('c0000001-0000-0000-0000-000000000002', 'TypeScript', 'typescript'),
  ('c0000001-0000-0000-0000-000000000003', 'Backend', 'backend')
on conflict (slug) do nothing;

-- Posts (4 published, 2 drafts)
insert into posts (id, title, slug, content, excerpt, cover_image_url, category_id, author_id, published, published_at) values
  (
    'e2eece14-7c6f-5844-02d6-aad29afdf98d',
    'Building Modern Apps with Nuxt 3',
    'building-with-nuxt3',
    '<h2>Why Nuxt 3?</h2><p>Nuxt 3 brings a significantly improved developer experience with auto-imports, server routes, and the Nitro engine. You can build full-stack applications in record time without sacrificing performance.</p><h2>File-Based Routing</h2><p>Drop a <code>.vue</code> file in <code>pages/</code> and you instantly have a route. Dynamic params use bracket syntax like <code>[slug].vue</code>. Nested routes mirror your directory structure.</p><h2>Server Routes</h2><p>The <code>server/</code> directory gives you a built-in API layer powered by Nitro. Define handlers with <code>defineEventHandler</code> and they deploy anywhere — Node.js, Cloudflare Workers, Deno, or serverless.</p><h2>Getting Started</h2><p>Run <code>npx nuxi init my-app</code> and you are ready. The development server supports hot module replacement, TypeScript out of the box, and zero-config SSR.</p>',
    'A deep dive into Nuxt 3''s file-based routing, server-side rendering, and the Composition API.',
    'https://placehold.co/800x400/1e40af/ffffff?text=Nuxt+3',
    'c0000001-0000-0000-0000-000000000001',
    'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a',
    true,
    '2026-01-15T10:00:00Z'
  ),
  (
    '88072cc3-d9c1-a578-9d6e-6a7bebbe5421',
    'Writing Type-Safe Composables in Vue 3',
    'typescript-composables',
    '<h2>What Are Composables?</h2><p>Composables are the Vue 3 answer to React hooks — reusable functions that encapsulate reactive state and logic. With TypeScript, they become even more powerful.</p><h2>Generics for Flexibility</h2><p>Use TypeScript generics to write composables that adapt to any data shape:</p><pre><code>function useAsync&lt;T&gt;(fn: () =&gt; Promise&lt;T&gt;) {
  const data = ref&lt;T | null&gt;(null);
  const error = ref&lt;Error | null&gt;(null);
  // ...
}</code></pre><h2>Best Practices</h2><p>Always return plain refs (not reactive objects) for destructuring support. Name your composables with the <code>use</code> prefix. Keep side effects in <code>onMounted</code> or <code>watchEffect</code>.</p>',
    'How to leverage TypeScript generics and the Composition API to write reusable, fully typed composables.',
    'https://placehold.co/800x400/3b82f6/ffffff?text=TypeScript',
    'c0000001-0000-0000-0000-000000000002',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    true,
    '2026-02-10T14:00:00Z'
  ),
  (
    '2cc7f1f1-7b78-593e-719d-50cf469660ea',
    'Server Routes and API Design in Nuxt 3',
    'server-routes-api',
    '<h2>The Server Directory</h2><p>Nuxt 3''s server directory lets you define API endpoints that run on the Nitro engine. Each file in <code>server/api/</code> becomes an endpoint automatically.</p><h2>RESTful Patterns</h2><p>Use filename conventions for HTTP methods: <code>posts.get.ts</code>, <code>posts.post.ts</code>, <code>posts/[id].put.ts</code>. This keeps your API organized and predictable.</p><h2>Validation and Error Handling</h2><p>Use <code>readBody()</code> for POST/PUT bodies, <code>getQuery()</code> for query parameters, and <code>createError()</code> to throw proper HTTP errors with status codes.</p>',
    'Using Nitro server routes to build a RESTful API alongside your Nuxt 3 frontend.',
    'https://placehold.co/800x400/10b981/ffffff?text=API+Design',
    'c0000001-0000-0000-0000-000000000003',
    'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a',
    true,
    '2026-03-01T09:00:00Z'
  ),
  (
    '70e7987c-40d0-0efa-c5c6-7115401cdc0f',
    'State Management Patterns in Vue 3',
    'state-management-vue3',
    '<h2>Pinia vs Composables</h2><p>Vue 3 offers multiple state management approaches. Pinia is the official store, but simple composables with <code>ref</code> and <code>provide/inject</code> work well for smaller apps.</p><h2>When to Use Pinia</h2><p>Choose Pinia when you need devtools integration, SSR support, or shared state across deeply nested components. For local component state, composables are lighter.</p><h2>Reactive Patterns</h2><p>Use <code>computed</code> for derived state, <code>watch</code> for side effects, and <code>readonly</code> to prevent accidental mutations from child components.</p>',
    'Comparing Pinia, composables, and provide/inject for managing state in Vue 3 applications.',
    'https://placehold.co/800x400/8b5cf6/ffffff?text=State+Mgmt',
    'c0000001-0000-0000-0000-000000000001',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    true,
    '2026-03-20T11:00:00Z'
  ),
  -- Draft posts (not published)
  (
    'f440ebd3-23c4-332e-0ad4-100fc415e05c',
    'Advanced TypeScript Patterns for Vue',
    'advanced-typescript-vue',
    '<p>Draft: Covering discriminated unions, template literal types, and branded types in Vue components...</p>',
    'Exploring advanced TypeScript patterns that make Vue components bulletproof.',
    'https://placehold.co/800x400/f59e0b/ffffff?text=Advanced+TS',
    'c0000001-0000-0000-0000-000000000002',
    'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a',
    false,
    null
  ),
  (
    '7ac165d6-a599-5000-0426-bf1486bab6ec',
    'Deploying Nuxt to the Edge',
    'deploying-nuxt-edge',
    '<p>Draft: How to deploy Nuxt 3 apps to Cloudflare Workers, Vercel Edge, and Deno Deploy...</p>',
    'A guide to edge deployment strategies for Nuxt 3 applications.',
    'https://placehold.co/800x400/ef4444/ffffff?text=Edge+Deploy',
    'c0000001-0000-0000-0000-000000000003',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    false,
    null
  )
on conflict (slug) do nothing;

-- Comments (5 comments on published posts)
insert into comments (id, post_id, user_id, content) values
  ('e3a38d7b-c8de-13c5-ff7d-45ae23022a19', 'e2eece14-7c6f-5844-02d6-aad29afdf98d', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Great overview of Nuxt 3! The file-based routing is such a productivity boost.'),
  ('9bb61f90-ba91-9f7f-1807-31ff85f06ade', 'e2eece14-7c6f-5844-02d6-aad29afdf98d', 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'Thanks Maria! I especially love how Nitro makes the server routes feel native.'),
  ('51868822-61f7-271c-cad8-c386517a9851', '88072cc3-d9c1-a578-9d6e-6a7bebbe5421', 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'The generics example is exactly what I needed. Much cleaner than my previous approach.'),
  ('a28f1485-6276-832f-ae12-3a1f5ba20225', '2cc7f1f1-7b78-593e-719d-50cf469660ea', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Using filename conventions for HTTP methods is so elegant. Nuxt nailed this pattern.'),
  ('2f87ceb7-226f-a45f-3b48-a0e24a30e824', '70e7987c-40d0-0efa-c5c6-7115401cdc0f', 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'Would love to see a comparison with Vuex for migration guides.')
on conflict (id) do nothing;
