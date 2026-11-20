# 📘 The Facebook Wall (2008 Edition)

> A nostalgic yet modern recreation of the iconic **2008 Facebook Wall**, built with **React 19**, **Next.js 15 (App Router)**, **Supabase Realtime**, **Tailwind CSS**, and **shadcn/ui**.

![Facebook Wall 2008](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80)

---

## 🎯 Features Checklist

### ✅ Must Have:
- [x] **Working Message Input**: 280-character maximum with live character countdown.
- [x] **Share Button**: Classic 2008 Facebook gradient button with instant state updates.
- [x] **Reverse Chronological Feed**: Posts display with the newest at the top, persisting on refresh.
- [x] **Real-time Updates**: Live listener using **Supabase Realtime** (`postgres_changes` on `posts`).
- [x] **Supabase Database Connection**: Dedicated `posts` table storing ID, author, message, timestamp, photo URL, and likes.
- [x] **Vercel Ready**: Fully configured for 1-click Vercel deployment with environment variable support.

### ✨ Bonus & Nice to Have:
- [x] **Loading & Error States**: Interactive spinners, skeleton loaders, and feedback messages.
- [x] **Author Customization**: Type your own name to post on the Wall (no login required) or click any friend in the sidebar.
- [x] **Photo Attachment**: Attach images with instant thumbnail rendering.
- [x] **Retro Interactions**:
  - Classic **Like** counter ("You and 4 others like this").
  - Inline **Comments** expansion with nested replies.
  - Interactive **Poke** button with confetti animation!
- [x] **Multi-Tab Profile Navigation**:
  - **Wall**: Dynamic status publisher and live reverse-chronological feed.
  - **Info**: 2008-style basic info, college education, work, and favorite music.
  - **Photos**: Harvard 2004, Summer 2005, and Wall albums.
  - **Boxes**: Nostalgic third-party widget box memories.
- [x] **Offline / Demo Mode**: Runs seamlessly out-of-the-box with pre-seeded posts even before setting up Supabase keys!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: [React 19](https://react.dev/)
- **Database & Realtime**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with authentic 2008 Facebook color palettes (`#3b5998`, Lucida Grande / Tahoma fonts)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) inspired design primitives

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/wall.git
cd wall
npm install
```

### 2. Configure Supabase

1. Head to [Supabase](https://supabase.com/) and create a new project (it's free).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repo, copy its contents, paste them into the SQL Editor, and click **Run**.
4. In your Supabase dashboard, go to **Project Settings > API** and copy:
   - `Project URL`
   - `anon / public` API Key
5. Create a `.env.local` file in your root folder:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Schema

The `posts` table stores every Wall entry:

```sql
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_name text not null default 'Anonymous Friend',
  message text not null check (char_length(message) <= 280),
  created_at timestamptz not null default now(),
  photo_url text,
  avatar_url text,
  likes_count integer not null default 0
);

-- Enable RLS and public policies
alter table public.posts enable row level security;
create policy "Allow public read" on public.posts for select using (true);
create policy "Allow public insert" on public.posts for insert with check (true);
create policy "Allow public update" on public.posts for update using (true);
create policy "Allow public delete" on public.posts for delete using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.posts;
```

---

## ☁️ Deployment to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete 2008 Facebook Wall with React 19, Next.js 15 and Supabase"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **Add New... > Project**.
3. Import your `wall` repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-anon-public-key`
5. Click **Deploy**. Your live Facebook Wall is now online!

---

## 📜 License

MIT License. Designed with nostalgia for the 2008 Facebook era.
