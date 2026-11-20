"use client";

import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  Loader2,
  Lock,
  Smile,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface WallPublisherProps {
  onPublish: (postData: {
    author_name: string;
    message: string;
    photo_url?: string | null;
    avatar_url?: string | null;
  }) => Promise<{ success: boolean; error?: string }>;
  defaultAuthor?: string;
}

export function WallPublisher({ onPublish, defaultAuthor = "You" }: WallPublisherProps) {
  const [activeTab, setActiveTab] = useState<"status" | "photo" | "link" | "video">("status");
  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const MAX_CHARS = 280;
  const charsRemaining = MAX_CHARS - message.length;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    if (message.length > MAX_CHARS) {
      setErrorMessage(`Please keep your message under ${MAX_CHARS} characters.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Pick avatar based on name or random
    const avatarUrl =
      authorName.toLowerCase() === "mark zuckerberg"
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(authorName.trim() || "friend")}`;

    const res = await onPublish({
      author_name: authorName.trim() || "Visitor",
      message: message.trim(),
      photo_url: photoUrl.trim() || null,
      avatar_url: avatarUrl,
    });

    setIsSubmitting(false);

    if (res.success) {
      setMessage("");
      setPhotoUrl("");
      setShowPhotoInput(false);
    } else {
      setErrorMessage(res.error || "Failed to post message. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border border-[#bdc7d8] rounded-[2px] shadow-sm mb-4">
      {/* Publisher Header Tab Selector */}
      <div className="bg-[#f2f2f2] border-b border-[#e5e5e5] px-2 py-1 flex items-center justify-between text-xs font-semibold text-[#3b5998]">
        <div className="flex items-center space-x-1 sm:space-x-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("status");
              setShowPhotoInput(false);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] transition-colors ${
              activeTab === "status"
                ? "bg-white text-[#333333] shadow-[0_1px_1px_rgba(0,0,0,0.05)] border border-[#d8dfea]"
                : "text-[#3b5998] hover:bg-[#e4e7ee]"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#3b5998]" />
            <span>Status</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("photo");
              setShowPhotoInput(true);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-[2px] transition-colors ${
              activeTab === "photo"
                ? "bg-white text-[#333333] shadow-[0_1px_1px_rgba(0,0,0,0.05)] border border-[#d8dfea]"
                : "text-[#3b5998] hover:bg-[#e4e7ee]"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#3b5998]" />
            <span>Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("link");
              setShowPhotoInput(false);
            }}
            className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-[2px] transition-colors ${
              activeTab === "link"
                ? "bg-white text-[#333333] shadow-[0_1px_1px_rgba(0,0,0,0.05)] border border-[#d8dfea]"
                : "text-[#3b5998] hover:bg-[#e4e7ee]"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#3b5998]" />
            <span>Link</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("video");
              setShowPhotoInput(false);
            }}
            className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-[2px] transition-colors ${
              activeTab === "video"
                ? "bg-white text-[#333333] shadow-[0_1px_1px_rgba(0,0,0,0.05)] border border-[#d8dfea]"
                : "text-[#3b5998] hover:bg-[#e4e7ee]"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#3b5998]" />
            <span>Video</span>
          </button>
        </div>

        {/* Audience Indicator */}
        <div className="flex items-center gap-1 text-[11px] text-[#777777] font-normal">
          <Lock className="w-3 h-3 text-[#999999]" />
          <span className="hidden sm:inline">Everyone</span>
        </div>
      </div>

      {/* Main Publishing Form */}
      <form onSubmit={handleSubmit} className="p-2.5 space-y-2">
        {/* Author Name Input (Personalize who is writing on the wall) */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="author-name" className="text-[#666666] font-bold text-[11px] shrink-0">
            Write on Wall as:
          </label>
          <Input
            id="author-name"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your Name (e.g. Dustin, Eduardo, Sarah)"
            maxLength={40}
            className="h-6 text-xs max-w-[200px]"
          />
          <span className="text-[10px] text-[#888] hidden sm:inline">
            (No account required)
          </span>
        </div>

        {/* Message Input Box */}
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write something on Mark's Wall..."
            rows={3}
            maxLength={MAX_CHARS}
            className="text-xs font-tahoma border-[#bdc7d8] focus:border-[#3b5998] p-2 leading-relaxed"
          />
        </div>

        {/* Optional Photo Attachment Box (Bonus Feature) */}
        {showPhotoInput && (
          <div className="bg-[#f7f8fa] border border-[#d8dfea] p-2 rounded-[2px] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#333333] flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#3b5998]" />
                Attach Photo URL:
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowPhotoInput(false);
                  setPhotoUrl("");
                }}
                className="text-[#999999] hover:text-[#333333]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-2">
              <Input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="h-7 text-xs flex-1"
              />
              <Button
                type="button"
                variant="fbWhite"
                size="sm"
                onClick={() =>
                  setPhotoUrl(
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                  )
                }
                className="text-[10px] whitespace-nowrap"
              >
                Sample Photo
              </Button>
            </div>

            {photoUrl && (
              <div className="mt-1 relative inline-block border border-[#cccccc] p-1 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Attachment preview"
                  className="max-h-24 max-w-full object-cover"
                  onError={() => alert("Could not load image from this URL")}
                />
              </div>
            )}
          </div>
        )}

        {/* Error message alert */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 text-xs rounded-[2px]">
            {errorMessage}
          </div>
        )}

        {/* Footer Actions: Character Count, Photo toggle, Share button */}
        <div className="flex items-center justify-between pt-1 border-t border-[#e9e9e9]">
          <div className="flex items-center space-x-3 text-xs">
            {/* Character Counter */}
            <span
              className={`text-[11px] font-mono ${
                charsRemaining < 20
                  ? "text-red-600 font-bold"
                  : charsRemaining < 50
                  ? "text-amber-600"
                  : "text-[#777777]"
              }`}
            >
              {charsRemaining} characters left
            </span>

            {/* Quick photo toggle button */}
            {!showPhotoInput && (
              <button
                type="button"
                onClick={() => setShowPhotoInput(true)}
                className="text-[11px] text-[#3b5998] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3 h-3" />
                Add Photo
              </button>
            )}

            <span className="text-[10px] text-[#999999] hidden md:inline">
              Press Ctrl+Enter to Share
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="default"
              disabled={!message.trim() || isSubmitting}
              className="bg-[#3b5998] hover:bg-[#324b81] text-white font-bold px-4 h-7 text-xs shadow-sm flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Sharing...</span>
                </>
              ) : (
                <span>Share</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
