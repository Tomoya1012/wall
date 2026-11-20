"use client";

import React, { useState, useMemo } from "react";
import { Radio, RefreshCw, Filter, Sparkles } from "lucide-react";
import { WallPostItem } from "./WallPostItem";
import { WallPost } from "@/types";

interface WallFeedProps {
  posts: WallPost[];
  isLoading: boolean;
  isRealtimeActive: boolean;
  onRefresh: () => void;
  onLike: (postId: string, currentLikes: number) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
}

export function WallFeed({
  posts,
  isLoading,
  isRealtimeActive,
  onRefresh,
  onLike,
  onDelete,
}: WallFeedProps) {
  const [filter, setFilter] = useState<"all" | "mark" | "others">("all");

  const filteredPosts = useMemo(() => {
    if (filter === "mark") {
      return posts.filter((p) => p.author_name.toLowerCase().includes("mark"));
    }
    if (filter === "others") {
      return posts.filter((p) => !p.author_name.toLowerCase().includes("mark"));
    }
    return posts;
  }, [posts, filter]);

  return (
    <div className="bg-white border border-[#d8dfea] rounded-[2px] shadow-sm">
      {/* Wall Header & Filter Bar */}
      <div className="bg-[#eceff5] px-3 py-2 border-b border-[#d8dfea] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#333333]">The Wall</span>
          <span className="text-[#777777] text-[11px]">
            ({filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"})
          </span>

          {/* Realtime Status Indicator */}
          <div
            className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${
              isRealtimeActive
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
            title={
              isRealtimeActive
                ? "Supabase Realtime active: posts update instantly without refresh"
                : "Realtime inactive"
            }
          >
            <Radio
              className={`w-2.5 h-2.5 ${
                isRealtimeActive ? "animate-pulse text-emerald-600" : "text-slate-400"
              }`}
            />
            <span className="hidden sm:inline font-medium">
              {isRealtimeActive ? "Realtime Live" : "Local Feed"}
            </span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-[#777777] hidden md:inline flex items-center gap-0.5">
            <Filter className="w-2.5 h-2.5" /> Filter:
          </span>

          <div className="flex items-center bg-white border border-[#cad4e4] rounded-[2px] p-0.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-0.5 rounded-[1px] transition-colors ${
                filter === "all"
                  ? "bg-[#3b5998] text-white font-bold"
                  : "text-[#3b5998] hover:bg-[#eceff5]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("mark")}
              className={`px-2 py-0.5 rounded-[1px] transition-colors ${
                filter === "mark"
                  ? "bg-[#3b5998] text-white font-bold"
                  : "text-[#3b5998] hover:bg-[#eceff5]"
              }`}
            >
              Mark
            </button>
            <button
              onClick={() => setFilter("others")}
              className={`px-2 py-0.5 rounded-[1px] transition-colors ${
                filter === "others"
                  ? "bg-[#3b5998] text-white font-bold"
                  : "text-[#3b5998] hover:bg-[#eceff5]"
              }`}
            >
              Friends
            </button>
          </div>

          {/* Refresh manual trigger button */}
          <button
            onClick={onRefresh}
            title="Refresh Wall posts"
            className="p-1 text-[#3b5998] hover:bg-[#dfe5ee] rounded border border-[#cad4e4] bg-white transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Posts List in Reverse-Chronological Order */}
      <div className="px-3 divide-y divide-[#eceff5]">
        {isLoading && posts.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#777777] space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#3b5998]" />
            <p>Loading Wall posts from database...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#777777] space-y-2">
            <Sparkles className="w-6 h-6 text-[#999999] mx-auto" />
            <p className="font-semibold text-[#444]">No Wall posts found.</p>
            <p className="text-[11px]">Be the first to leave a message on Mark&apos;s Wall above!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <WallPostItem
              key={post.id}
              post={post}
              onLike={onLike}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Feed Bottom Footer */}
      <div className="bg-[#f7f7f7] border-t border-[#d8dfea] px-3 py-2 text-center text-[11px] text-[#777777]">
        Displaying {filteredPosts.length} of {posts.length} total posts · Newest first
      </div>
    </div>
  );
}
