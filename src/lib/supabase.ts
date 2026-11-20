import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { WallPost } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
  {
    id: "demo-post-4",
    author_name: "Mark Zuckerberg",
    message: "is wondering if anyone knows a good pho place in Kirkland or Palo Alto open past midnight.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    likes_count: 8,
    photo_url: null,
  },
];

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
      },
    });
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
 * Fetch latest 50 posts from Supabase or fallback
 */
export async function fetchWallPosts(): Promise<{ posts: WallPost[]; error?: string; isLive: boolean }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      posts: getLocalPosts(),
      isLive: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("Supabase fetch error, using local fallback:", error.message);
      return { posts: getLocalPosts(), error: error.message, isLive: false };
    }

    return { posts: (data as WallPost[]) || [], isLive: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load posts";
    return { posts: getLocalPosts(), error: message, isLive: false };
  }
}

/**
 * Create a new post in Supabase (or fallback)
 */
export async function createWallPost(post: {
  author_name: string;
  message: string;
  photo_url?: string | null;
  avatar_url?: string | null;
}): Promise<{ post?: WallPost; error?: string }> {
  const supabase = getSupabase();

  const newPostData = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `post-${Date.now()}`,
    author_name: post.author_name.trim() || "Anonymous Friend",
    message: post.message.trim(),
    created_at: new Date().toISOString(),
    photo_url: post.photo_url || null,
    avatar_url: post.avatar_url || null,
    likes_count: 0,
  };

  if (!supabase) {
    const current = getLocalPosts();
    const updated = [newPostData, ...current];
    saveLocalPosts(updated);
    return { post: newPostData };
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          author_name: newPostData.author_name,
          message: newPostData.message,
          photo_url: newPostData.photo_url,
          avatar_url: newPostData.avatar_url,
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn("Supabase insert error, saving locally:", error.message);
      const current = getLocalPosts();
      saveLocalPosts([newPostData, ...current]);
      return { post: newPostData, error: error.message };
    }

    return { post: data as WallPost };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error inserting post";
    return { error: message };
  }
}

/**
 * Delete a post
 */
export async function deleteWallPost(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("posts").delete().eq("id", id);
    } catch (e) {
      console.error(e);
    }
  }

  // Also update local
  const current = getLocalPosts();
  saveLocalPosts(current.filter((p) => p.id !== id));
  return true;
}

/**
 * Like a post
 */
export async function likeWallPost(id: string, currentLikes: number = 0): Promise<number> {
  const newLikes = currentLikes + 1;
  const supabase = getSupabase();

  if (supabase) {
    try {
      await supabase.from("posts").update({ likes_count: newLikes }).eq("id", id);
    } catch (e) {
      console.error(e);
    }
  }

  const current = getLocalPosts();
  saveLocalPosts(
    current.map((p) => (p.id === id ? { ...p, likes_count: newLikes } : p))
  );

  return newLikes;
}
