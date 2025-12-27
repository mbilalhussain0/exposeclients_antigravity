-- Enable extensions
create extension if not exists "pg_trgm";

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Clients table
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  country text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

alter table public.clients enable row level security;

create index clients_name_trgm_idx on public.clients using gin (name gin_trgm_ops);

-- Platforms table
create table public.platforms (
  id uuid default gen_random_uuid() primary key,
  name text not null unique
);

alter table public.platforms enable row level security;

-- Reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete set null not null,
  platform_id uuid references public.platforms(id) on delete set null not null,
  rating int check (rating >= 1 and rating <= 5),
  title text,
  body text not null,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

create index reviews_client_id_created_at_idx on public.reviews (client_id, created_at desc);
create index reviews_author_id_created_at_idx on public.reviews (author_id, created_at desc);

-- Review Images table
create table public.review_images (
  id uuid default gen_random_uuid() primary key,
  review_id uuid references public.reviews(id) on delete cascade not null,
  storage_path text not null,
  public_url text,
  created_at timestamptz default now()
);

alter table public.review_images enable row level security;

-- Comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  review_id uuid references public.reviews(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  anonymous_name text,
  body text not null,
  created_at timestamptz default now(),
  constraint comments_target_check check (
    (client_id is not null and review_id is null) or
    (client_id is null and review_id is not null)
  ),
  constraint comments_author_check check (
    (author_id is null and anonymous_name is not null) or
    (author_id is not null and anonymous_name is null)
  )
);

alter table public.comments enable row level security;

-- RLS Policies

-- Profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Clients
create policy "Clients are viewable by everyone." on public.clients for select using (true);
create policy "Authenticated users can insert clients." on public.clients for insert with check (auth.role() = 'authenticated');
-- Only admin or specific roles usually delete/update, skipping for now as per requirements

-- Platforms
create policy "Platforms are viewable by everyone." on public.platforms for select using (true);
create policy "Authenticated users can insert platforms." on public.platforms for insert with check (auth.role() = 'authenticated');

-- Reviews
create policy "Reviews are viewable by everyone." on public.reviews for select using (true);
create policy "Authenticated users can insert reviews." on public.reviews for insert with check (auth.uid() = author_id);
create policy "Users can update their own reviews." on public.reviews for update using (auth.uid() = author_id);
create policy "Users can delete their own reviews." on public.reviews for delete using (auth.uid() = author_id);

-- Review Images
create policy "Review images are viewable by everyone." on public.review_images for select using (true);
create policy "Authors can insert review images." on public.review_images for insert with check (
  exists (
    select 1 from public.reviews
    where id = review_images.review_id and author_id = auth.uid()
  )
);
create policy "Authors can delete review images." on public.review_images for delete using (
  exists (
    select 1 from public.reviews
    where id = review_images.review_id and author_id = auth.uid()
  )
);

-- Comments
create policy "Comments are viewable by everyone." on public.comments for select using (true);
create policy "Authenticated users can insert comments." on public.comments for insert with check (
  (auth.role() = 'authenticated' and author_id = auth.uid() and anonymous_name is null) or
  (auth.role() = 'anon' and author_id is null and anonymous_name is not null) or
  (auth.role() = 'authenticated' and author_id is null and anonymous_name is not null) -- Allow logged in user to post anonymously if they want? Requirements say "Logged-in users comment with their account", implied logic. Let's stick to strict separation for now or allow flexibility.
);

-- Update: Allow inserts if data matches rules regardless of role, but practically:
-- If author_id is set, it MUST be auth.uid().
-- If author_id is null, anonymous_name must be present.
create policy "Anyone can insert comments." on public.comments for insert with check (
  (author_id is not null and author_id = auth.uid() and anonymous_name is null) or
  (author_id is null and anonymous_name is not null)
);

create policy "Users can update own comments." on public.comments for update using (author_id = auth.uid());
create policy "Users can delete own comments." on public.comments for delete using (author_id = auth.uid());

-- Storage
insert into storage.buckets (id, name, public) 
values ('review-images', 'review-images', true)
on conflict (id) do nothing;

create policy "Review images are publicly accessible." on storage.objects for select
using ( bucket_id = 'review-images' );

create policy "Authenticated users can upload review images." on storage.objects for insert
with check (
  bucket_id = 'review-images' and
  auth.role() = 'authenticated' 
  -- Ideally verify user owns the review folder path, but simplified for now: reviews/{review_id}/{filename}
);

-- Seed Platforms
insert into public.platforms (name) values ('Upwork'), ('Fiverr'), ('Toptal'), ('Freelancer'), ('Direct'), ('LinkedIn'), ('Other')
on conflict (name) do nothing;
