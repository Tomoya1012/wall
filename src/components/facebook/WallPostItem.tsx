"use client";

import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Trash2, Clock, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/utils";
import { WallPost, WallComment } from "@/types";

interface WallPostItemProps {
  post: WallPost;
  onLike: (postId: string, currentLikes: number) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
}

export function WallPostItem({ post, onLike, onDelete }: WallPostItemProps) {
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Friend");
  const [comments, setComments] = useState<WallComment[]>(post.comments || []);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const newCount = hasLiked ? Math.max(0, likes - 1) : likes + 1;
    setLikes(newCount);
    setHasLiked(!hasLiked);
    try {
      await onLike(post.id, post.likes_count || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: WallComment = {
      id: `comment-${Date.now()}`,
      post_id: post.id,
      author_name: commentAuthor.trim() || "Friend",
      message: commentText.trim(),
      created_at: new Date().toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(commentAuthor)}`,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText("");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this Wall post?")) {
      setIsDeleting(true);
      await onDelete(post.id);
    }
  };

  const isAuthorMark = post.author_name.toLowerCase().includes("mark");

  return (
    <article
      className={`border-b border-[#d8dfea] py-3 text-xs font-tahoma transition-opacity duration-200 ${
        isDeleting ? "opacity-30 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-start space-x-2.5">
        {/* Author Avatar */}
        <Avatar
          src={post.avatar_url || undefined}
          fallbackName={post.author_name}
          size="md"
          className="border border-[#b3bed0]"
        />

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header Info */}
          <div className="flex items-baseline justify-between">
            <div className="leading-snug">
              <span className="font-bold text-[#3b5998] hover:underline cursor-pointer">
                {post.author_name}
              </span>
              <span className="text-[#333333] ml-1">
                {isAuthorMark ? (
                  <span className="font-normal">status update</span>
                ) : (
                  <span>wrote on <strong className="text-[#3b5998] hover:underline cursor-pointer">Mark&apos;s Wall</strong></span>
                )}
              </span>
            </div>

            {/* Delete button (discreet vintage style) */}
            <button
              onClick={handleDelete}
              title="Delete post"
              className="text-[#999999] hover:text-red-600 p-0.5 ml-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-[11px] text-[#777777] mb-1.5">
            <Clock className="w-2.5 h-2.5" />
            <time dateTime={post.created_at}>{formatTimeAgo(post.created_at)}</time>
          </div>

          {/* Message text */}
          <div className="text-[#333333] leading-relaxed break-words whitespace-pre-wrap font-normal text-xs my-1">
            {post.message}
          </div>

          {/* Attached Photo (Bonus feature) */}
          {post.photo_url && (
            <div className="my-2.5 border border-[#cccccc] p-1 bg-white inline-block max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.photo_url}
                alt="Post attachment"
                className="max-h-72 w-auto object-contain cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(post.photo_url!, "_blank")}
              />
            </div>
          )}

          {/* Social Interactions Bar */}
          <div className="flex items-center space-x-3 text-[11px] text-[#3b5998] mt-2 pt-1 border-t border-slate-100">
            <button
              onClick={handleLike}
              className={`hover:underline flex items-center gap-1 font-semibold cursor-pointer ${
                hasLiked ? "text-[#2b4170] font-bold" : ""
              }`}
            >
              <ThumbsUp className={`w-3 h-3 ${hasLiked ? "fill-[#3b5998]" : ""}`} />
              {hasLiked ? "Liked" : "Like"}
              {likes > 0 && <span>({likes})</span>}
            </button>

            <span>·</span>

            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              Comment {comments.length > 0 && `(${comments.length})`}
            </button>
          </div>

          {/* "X people like this" retro text */}
          {likes > 0 && (
            <div className="bg-[#eceff5] border border-[#cad4e4] px-2 py-1 mt-2 text-[11px] text-[#333333] flex items-center gap-1.5 rounded-[1px]">
              <ThumbsUp className="w-3 h-3 text-[#3b5998] fill-[#3b5998]" />
              <span>
                {hasLiked
                  ? likes === 1
                    ? "You like this."
                    : `You and ${likes - 1} other${likes - 1 > 1 ? "s" : ""} like this.`
                  : `${likes} person${likes > 1 ? "s" : ""} likes this.`}
              </span>
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="mt-2.5 pl-2 sm:pl-4 border-l-2 border-[#d8dfea] space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#f7f8fa] p-1.5 border border-[#e5e5e5] rounded-[2px] text-[11px] flex items-start gap-2"
                >
                  <Avatar
                    src={comment.avatar_url || undefined}
                    fallbackName={comment.author_name}
                    size="sm"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-[#3b5998] mr-1">
                      {comment.author_name}:
                    </span>
                    <span className="text-[#333333]">{comment.message}</span>
                    <div className="text-[10px] text-[#888888] mt-0.5">
                      {formatTimeAgo(comment.created_at)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Inline comment form */}
              <form onSubmit={handleAddComment} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your Name"
                  className="w-20 text-[11px] px-1.5 py-0.5 border border-[#bdc7d8] rounded-[2px]"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 text-[11px] px-2 py-0.5 border border-[#bdc7d8] rounded-[2px] focus:outline-none focus:border-[#3b5998]"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-[#3b5998] text-white px-2 py-0.5 text-[11px] font-bold rounded-[2px] disabled:opacity-50 hover:bg-[#2b4170] flex items-center gap-1"
                >
                  <Send className="w-2.5 h-2.5" />
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
