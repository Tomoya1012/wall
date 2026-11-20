import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { WallPost } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSecretKey = Boolean(supabaseAnonKey?.startsWith("sb_secret_"));

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  !supabaseUrl.includes("placeholder")
);

// Fallback initial posts for instant nostalgia and demo
export const INITIAL_DEMO_POSTS: WallPost[] = [
  {
    id: "demo-post-1",
    author_name: "Eduardo Saverin",
    message: "Hey Mark! Just wrapped up the finance forecast for Q3. Have you checked out the new photo tag algorithm yet? Let's grab lunch in Palo Alto.",
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    likes_count: 5,
    photo_url: null,
  },
  {
    id: "demo-post-2",
    author_name: "Dustin Moskovitz",
    message: "Servers are holding strong for the college rollout! 🚀 Harvard, Stanford, Columbia and now 800+ campuses live. Who wants pizza at the house tonight?",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    likes_count: 12,
    photo_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "demo-post-3",
    author_name: "Sean Parker",
    message: "A million dollars isn't cool. You know what's cool? A billion dollars. Drop the 'The'. Just Facebook.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    likes_count: 42,
    photo_url: null,
  },
];

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  // If running in browser and the key is a secret key (sb_secret_),
  // do NOT initialize browser client directly because Supabase throws "Forbidden use of secret API key in browser"
  if (typeof window !== "undefined" && isSecretKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          persistSession: false,
        },
      });
    } catch (e) {
      console.warn("Could not initialize Supabase browser client:", e);
      return null;
    }
  }
  return supabaseInstance;
}

// Local mock storage for offline / unconfigured demo
const LOCAL_STORAGE_KEY = "fb_wall_2008_posts";

export function getLocalPosts(): WallPost[] {
  if (typeof window === "undefined") return INITIAL_DEMO_POSTS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_POSTS));
      return INITIAL_DEMO_POSTS;
    }
    return JSON.parse(saved);
  } catch {
    return INITIAL_DEMO_POSTS;
  }
}

export function saveLocalPosts(posts: WallPost[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error("Failed to save local posts", err);
  }
}

/**
 * Fetch latest 50 posts from API route or Supabase client
 */
export async function fetchWallPosts(): Promise<{ posts: WallPost[]; error?: string; isLive: boolean }> {
  if (!isSupabaseConfigured) {
    return {
      posts: getLocalPosts(),
      isLive: false,
    };
  }

  // Use API route (works both with anon key and secret key safely without browser restrictions)
  try {
    const res = await fetch("/api/posts", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return { posts: data as WallPost[], isLive: true };
    }
  } catch (e) {
    console.warn("API route fetch error:", e);
  }

  // Fallback to direct client if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        return { posts: data as WallPost[], isLive: true };
      }
    } catch (err) {
      console.error(err);
    }
  }

  return { posts: getLocalPosts(), isLive: false };
}

/**
 * Create a new post via API route or Supabase
 */
export async function createWallPost(post: {
  author_name: string;
  message: string;
  photo_url?: string | null;
  avatar_url?: string | null;
}): Promise<{ post?: WallPost; error?: string }> {
  if (!isSupabaseConfigured) {
    const newPostData: WallPost = {
      id: `post-${Date.now()}`,
      author_name: post.author_name.trim() || "Anonymous Friend",
      message: post.message.trim(),
      created_at: new Date().toISOString(),
      photo_url: post.photo_url || null,
      avatar_url: post.avatar_url || null,
      likes_count: 0,
    };
    const current = getLocalPosts();
    saveLocalPosts([newPostData, ...current]);
    return { post: newPostData };
  }

  try {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (res.ok) {
      const newPost = await res.json();
      return { post: newPost as WallPost };
    } else {
      const err = await res.json();
      return { error: err.error || "Failed to create post" };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error posting to server";
    return { error: msg };
  }
}

/**
 * Delete a post via API route
 */
export async function deleteWallPost(id: string): Promise<boolean> {
  try {
    await fetch(`/api/posts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch (e) {
    console.error(e);
  }

  const current = getLocalPosts();
  saveLocalPosts(current.filter((p) => p.id !== id));
  return true;
}

/**
 * Like a post via API route
 */
export async function likeWallPost(id: string, currentLikes: number = 0): Promise<number> {
  const newLikes = currentLikes + 1;

  try {
    await fetch("/api/posts/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, currentLikes }),
    });
  } catch (e) {
    console.error(e);
  }

  const current = getLocalPosts();
  saveLocalPosts(
    current.map((p) => (p.id === id ? { ...p, likes_count: newLikes } : p))
  );

  return newLikes;
}
