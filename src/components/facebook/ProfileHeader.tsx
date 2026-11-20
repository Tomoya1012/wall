"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { UserPlus, Mail, Hand, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  postCount: number;
}

export function ProfileHeader({ activeTab, setActiveTab, postCount }: ProfileHeaderProps) {
  const [poked, setPoked] = useState(false);
  const [friendRequested, setFriendRequested] = useState(false);
  const [statusText, setStatusText] = useState("is hacking on React 19, Next.js 15, and Supabase.");
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const handlePoke = () => {
    setPoked(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setPoked(false), 4000);
  };

  return (
    <div className="bg-white border-b border-[#d8dfea] pt-4 mb-3">
      {/* Top Profile Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4">
        {/* Name and status */}
        <div className="flex items-start space-x-3.5">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
              alt="Mark Zuckerberg"
              className="w-16 h-16 sm:w-20 sm:h-20 border border-[#b3bed0] p-0.5 bg-white shadow-sm object-cover"
            />
            <span
              title="Verified 2008 Profile"
              className="absolute -bottom-1 -right-1 bg-[#3b5998] text-white p-0.5 rounded-full border border-white"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight">
                Mark Zuckerberg
              </h1>
              <span className="text-xs text-[#777777]">
                (Harvard &apos;06 · Palo Alto, CA)
              </span>
            </div>

            {/* Status message */}
            <div className="mt-1 text-xs text-[#333333] flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-[#3b5998]">Mark</span>
              {isEditingStatus ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    className="border border-[#3b5998] px-1.5 py-0.5 text-xs rounded-[2px]"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="h-5 px-2 text-[10px]"
                    onClick={() => setIsEditingStatus(false)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <>
                  <span className="italic text-[#444444]">&quot;{statusText}&quot;</span>
                  <button
                    onClick={() => setIsEditingStatus(true)}
                    className="text-[10px] text-[#3b5998] hover:underline"
                  >
                    [edit]
                  </button>
                </>
              )}
            </div>

            <p className="text-[11px] text-[#777777] mt-1">
              Networks: <span className="text-[#3b5998] hover:underline cursor-pointer">Harvard</span>,{" "}
              <span className="text-[#3b5998] hover:underline cursor-pointer">Silicon Valley</span>
            </p>
          </div>
        </div>

        {/* Action Buttons (Friend, Message, Poke) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:self-start">
          <Button
            size="sm"
            variant={friendRequested ? "fbWhite" : "fbSecondary"}
            onClick={() => setFriendRequested(!friendRequested)}
            className="text-[11px] font-semibold"
          >
            <UserPlus className="w-3 h-3 mr-1" />
            {friendRequested ? "Request Sent" : "Add as Friend"}
          </Button>

          <Button
            size="sm"
            variant="fbSecondary"
            onClick={() => alert("Vintage Facebook Inbox: Compose message to Mark Zuckerberg")}
            className="text-[11px] font-semibold"
          >
            <Mail className="w-3 h-3 mr-1" />
            Message
          </Button>

          <Button
            size="sm"
            variant="fbSecondary"
            onClick={handlePoke}
            className={`text-[11px] font-semibold ${poked ? "bg-amber-100 border-amber-300 text-amber-900" : ""}`}
          >
            <Hand className="w-3 h-3 mr-1" />
            {poked ? "Poked!" : "Poke"}
          </Button>
        </div>
      </div>

      {poked && (
        <div className="bg-[#fff9d7] border border-[#e2c822] text-[#333333] px-3 py-1.5 text-xs mb-3 flex items-center justify-between animate-in fade-in duration-200">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#e2c822]" />
            You poked Mark Zuckerberg. He has been notified!
          </span>
          <button onClick={() => setPoked(false)} className="text-[#888] hover:text-black">
            ✕
          </button>
        </div>
      )}

      {/* Profile Navigation Tabs (Classic 2008 tabs) */}
      <div className="flex space-x-1 border-b border-[#3b5998] pt-1">
        {[
          { id: "wall", label: `Wall (${postCount})` },
          { id: "info", label: "Info" },
          { id: "photos", label: "Photos (42)" },
          { id: "boxes", label: "Boxes" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold transition-all relative top-[1px] rounded-t-[3px] border ${
                isActive
                  ? "bg-[#3b5998] text-white border-[#3b5998] shadow-sm"
                  : "bg-[#d8dfea] text-[#3b5998] border-[#cad4e4] hover:bg-[#eceff5]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
