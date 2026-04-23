-- ============================================================
-- Nuxt Blog — Initial Schema
-- ============================================================

-- 1. Profiles (auto-created on user signup via trigger)
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  username    text unique,
  full_name   text,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now()
);

-- 2. Categories
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  slug        text unique not null,
  created_at  timestamptz not null default now()
);

-- 3. Posts
create table if not exists posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  content         text not null,
  excerpt         text,
  cover_image_url text,
  category_id     uuid references categories(id) on delete set null,
  author_id       uuid references auth.users(id) on delete cascade not null,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 4. Comments
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references posts(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_author on posts(author_id);
create index if not exists idx_posts_category on posts(category_id);
create index if not exists idx_posts_published on posts(published, published_at desc);
create index if not exists idx_comments_post on comments(post_id);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Profiles: publicly readable, owners can update their own
alter table profiles enable row level security;

create policy "Profiles are publicly readable"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Categories: publicly readable, no public writes
alter table categories enable row level security;

create policy "Categories are publicly readable"
  on categories for select
  using (true);

-- Posts: published posts readable by all, drafts only by author
alter table posts enable row level security;

create policy "Published posts are publicly readable"
  on posts for select
  using (published = true);

create policy "Authors can read own drafts"
  on posts for select
  using (auth.uid() = author_id);

create policy "Authenticated users can create posts"
  on posts for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own posts"
  on posts for update
  using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on posts for delete
  using (auth.uid() = author_id);

-- Comments: publicly readable on published posts, authenticated can insert
alter table comments enable row level security;

create policy "Comments on published posts are readable"
  on comments for select
  using (
    exists (
      select 1 from posts where posts.id = comments.post_id and posts.published = true
    )
  );

create policy "Authenticated users can add comments"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on comments for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at on posts
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();
