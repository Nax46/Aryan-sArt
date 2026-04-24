-- Run this in Supabase SQL editor to create the necessary tables for profiles and wishlist

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  phone text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- Enable RLS
alter table public.wishlists enable row level security;
create policy "Users can view own wishlists." on wishlists for select using (auth.uid() = user_id);
create policy "Users can insert own wishlists." on wishlists for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlists." on wishlists for delete using (auth.uid() = user_id);
