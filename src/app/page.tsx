"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FacebookHeader } from "@/components/facebook/FacebookHeader";
import { ProfileHeader } from "@/components/facebook/ProfileHeader";
import { LeftSidebar } from "@/components/facebook/LeftSidebar";
import { WallPublisher } from "@/components/facebook/WallPublisher";
import { WallFeed } from "@/components/facebook/WallFeed";
import { ProfileInfoTab } from "@/components/facebook/ProfileInfoTab";
import { ProfilePhotosTab } from "@/components/facebook/ProfilePhotosTab";
import { SupabaseSetupModal } from "@/components/facebook/SupabaseSetupModal";
import {
  fetchWallPosts,
  createWallPost,
  deleteWallPost,
  likeWallPost,
  getSupabase,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { WallPost } from "@/types";

export default function WallPage() {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [activeTab, setActiveTab] = useState("wall");
  const [authorToPostAs, setAuthorToPostAs] = useState("You");
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Load posts
  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchWallPosts();
    setPosts(res.posts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      // In local demo mode, mark as active for mock responsiveness
      setIsRealtimeActive(true);
      return;
    }

    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newPost = payload.new as WallPost;
            setPosts((prev) => {
              if (prev.some((p) => p.id === newPost.id)) return prev;
              return [newPost, ...prev];
            });
          } else if (payload.eventType === "DELETE") {
            const deletedId = (payload.old as { id: string }).id;
            setPosts((prev) => prev.filter((p) => p.id !== deletedId));
          } else if (payload.eventType === "UPDATE") {
            const updatedPost = payload.new as WallPost;
            setPosts((prev) =>
              prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p))
            );
          }
        }
      )
      .subscribe((status) => {
        setIsRealtimeActive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle post publish
  const handlePublish = async (postData: {
    author_name: string;
    message: string;
    photo_url?: string | null;
    avatar_url?: string | null;
  }) => {
    try {
      const res = await createWallPost(postData);
      if (res.error) {
        return { success: false, error: res.error };
      }

      // Optimistic update for instant gratification
      if (res.post) {
        setPosts((prev) => {
          if (prev.some((p) => p.id === res.post!.id)) return prev;
          return [res.post!, ...prev];
        });
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to publish post";
      return { success: false, error: message };
    }
  };

  // Handle like
  const handleLike = async (postId: string, currentLikes: number) => {
    await likeWallPost(postId, currentLikes);
  };

  // Handle delete
  const handleDelete = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    await deleteWallPost(postId);
  };

  // Click on a friend in the sidebar
  const handleFriendClick = (friendName: string) => {
    setAuthorToPostAs(friendName);
    setActiveTab("wall");
    // Scroll to publisher smoothly
    const publisherElement = document.getElementById("wall-publisher");
    if (publisherElement) {
      publisherElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#eceff6] text-[#333333] flex flex-col font-tahoma antialiased selection:bg-[#3b5998] selection:text-white">
      {/* 2008 Facebook Blue Top Navbar */}
      <FacebookHeader
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isRealtimeActive={isRealtimeActive}
      />

      {/* Main 2008 Profile & Wall Container */}
      <main className="max-w-[980px] w-full mx-auto px-2 sm:px-4 py-3 flex-1">
        {/* Banner if Supabase is in demo mode */}
        {!isSupabaseConfigured && (
          <div className="bg-[#fff9d7] border border-[#e2c822] text-[#333333] px-3 py-1.5 text-xs mb-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              <strong>Welcome to The Facebook Wall (2008 Edition)!</strong> Running in demo mode. Connect your Supabase database in 2 minutes for cloud sync.
            </span>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="bg-[#3b5998] hover:bg-[#2b4170] text-white px-2 py-0.5 text-[11px] font-bold rounded-[2px] cursor-pointer"
            >
              Connect Supabase
            </button>
          </div>
        )}

        {/* Profile Header (Cover/Avatar, Mark Zuckerberg, Networks, Action Buttons, Tabs) */}
        <ProfileHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          postCount={posts.length}
        />

        {/* 2-Column Vintage Layout */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Left Column: Profile Picture, Information Box, Friends Box, Recent Activity */}
          <LeftSidebar onFriendClick={handleFriendClick} />

          {/* Right Column: Active Tab Content */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === "wall" && (
              <>
                {/* Wall Publisher */}
                <div id="wall-publisher">
                  <WallPublisher
                    onPublish={handlePublish}
                    defaultAuthor={authorToPostAs}
                  />
                </div>

                {/* Wall Feed */}
                <WallFeed
                  posts={posts}
                  isLoading={isLoading}
                  isRealtimeActive={isRealtimeActive}
                  onRefresh={loadPosts}
                  onLike={handleLike}
                  onDelete={handleDelete}
                />
              </>
            )}

            {activeTab === "info" && <ProfileInfoTab />}

            {activeTab === "photos" && <ProfilePhotosTab />}

            {activeTab === "boxes" && (
              <div className="bg-white border border-[#d8dfea] p-4 text-xs font-tahoma space-y-3">
                <h3 className="font-bold text-[#3b5998] border-b border-[#3b5998] pb-1">
                  Profile Boxes (Applications)
                </h3>
                <div className="p-4 border border-[#e5e5e5] rounded bg-[#fafafa] text-center space-y-2">
                  <p className="font-semibold text-gray-700">Super Wall &amp; FunWall applications</p>
                  <p className="text-gray-500 text-[11px]">
                    In 2008, developers built widget boxes right on user profiles!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Retro 2008 Footer */}
      <footer className="mt-8 border-t border-[#d8dfea] bg-[#eceff6] py-4 text-center text-[11px] text-[#777777]">
        <div className="max-w-[980px] mx-auto px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a href="#about" className="text-[#3b5998] hover:underline">About</a>
          <span>·</span>
          <a href="#faq" className="text-[#3b5998] hover:underline">FAQ</a>
          <span>·</span>
          <a href="#developers" className="text-[#3b5998] hover:underline">Developers</a>
          <span>·</span>
          <a href="#terms" className="text-[#3b5998] hover:underline">Terms</a>
          <span>·</span>
          <a href="#privacy" className="text-[#3b5998] hover:underline">Privacy</a>
          <span>·</span>
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="text-[#3b5998] hover:underline font-semibold cursor-pointer"
          >
            Database Settings
          </button>
        </div>
        <div className="mt-1 text-[10px] text-[#999999]">
          Facebook © 2008 · Nostalgic Wall built with Next.js 15, React 19, Supabase &amp; Tailwind CSS
        </div>
      </footer>

      {/* Supabase Setup Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}
