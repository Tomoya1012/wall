"use client";

import React from "react";
import { Users, Info, ExternalLink, Image as ImageIcon } from "lucide-react";

interface LeftSidebarProps {
  onFriendClick?: (friendName: string) => void;
}

export function LeftSidebar({ onFriendClick }: LeftSidebarProps) {
  const friends = [
    {
      name: "Eduardo Saverin",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Dustin Moskovitz",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Sean Parker",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Sheryl Sandberg",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Peter Thiel",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Chris Hughes",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <aside className="w-full md:w-[200px] shrink-0 space-y-3 font-tahoma text-xs">
      {/* Profile Photo & Quick Actions */}
      <div className="bg-white border border-[#d8dfea] p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
          alt="Mark Zuckerberg"
          className="w-full h-auto border border-[#b3bed0] shadow-sm mb-2"
        />

        <div className="space-y-1 text-[11px] text-[#3b5998]">
          <a href="#photos" className="flex items-center gap-1 hover:underline">
            <ImageIcon className="w-3 h-3 text-[#777777]" />
            View photos of Mark (42)
          </a>
          <a href="#wall" className="flex items-center gap-1 hover:underline">
            <ExternalLink className="w-3 h-3 text-[#777777]" />
            Write on Mark&apos;s Wall
          </a>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-white border border-[#d8dfea]">
        <div className="bg-[#eceff5] px-2.5 py-1.5 border-b border-[#d8dfea] flex items-center justify-between">
          <span className="font-bold text-[#333333] flex items-center gap-1">
            <Info className="w-3 h-3 text-[#3b5998]" />
            Information
          </span>
          <span className="text-[10px] text-[#3b5998] hover:underline cursor-pointer">
            Edit
          </span>
        </div>
        <div className="p-2 space-y-1.5 text-[11px]">
          <div>
            <span className="text-[#777777] font-semibold block text-[10px] uppercase tracking-wider">
              Networks:
            </span>
            <span className="text-[#3b5998]">Harvard &apos;06</span>
          </div>
          <div>
            <span className="text-[#777777] font-semibold block text-[10px] uppercase tracking-wider">
              Status:
            </span>
            <span className="text-[#333333]">It&apos;s Complicated</span>
          </div>
          <div>
            <span className="text-[#777777] font-semibold block text-[10px] uppercase tracking-wider">
              Birthday:
            </span>
            <span className="text-[#333333]">May 14, 1984</span>
          </div>
          <div>
            <span className="text-[#777777] font-semibold block text-[10px] uppercase tracking-wider">
              Hometown:
            </span>
            <span className="text-[#333333]">Dobbs Ferry, NY</span>
          </div>
        </div>
      </div>

      {/* Friends Box (Classic 6 grid) */}
      <div className="bg-white border border-[#d8dfea]">
        <div className="bg-[#eceff5] px-2.5 py-1.5 border-b border-[#d8dfea] flex items-center justify-between">
          <span className="font-bold text-[#333333] flex items-center gap-1">
            <Users className="w-3 h-3 text-[#3b5998]" />
            Friends (842)
          </span>
          <span className="text-[10px] text-[#3b5998] hover:underline cursor-pointer">
            See All
          </span>
        </div>

        <div className="p-2 grid grid-cols-3 gap-2">
          {friends.map((friend) => (
            <div
              key={friend.name}
              onClick={() => onFriendClick?.(friend.name)}
              className="text-center group cursor-pointer"
              title={`Click to post as ${friend.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={friend.photo}
                alt={friend.name}
                className="w-12 h-12 mx-auto object-cover border border-[#cccccc] group-hover:border-[#3b5998] transition-colors"
              />
              <span className="block text-[10px] text-[#3b5998] group-hover:underline truncate mt-1 leading-tight">
                {friend.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Retro 2008 Mini-Feed Box */}
      <div className="bg-white border border-[#d8dfea] p-2 text-[11px] text-[#555555]">
        <div className="font-bold text-[#333333] border-b border-[#d8dfea] pb-1 mb-1.5">
          Recent Activity
        </div>
        <ul className="space-y-1.5 text-[10px] text-[#666]">
          <li>
            • <strong className="text-[#3b5998]">Mark</strong> and{" "}
            <strong className="text-[#3b5998]">Eduardo</strong> are now friends.
          </li>
          <li>
            • <strong className="text-[#3b5998]">Dustin</strong> updated his status.
          </li>
          <li>
            • <strong className="text-[#3b5998]">Mark</strong> added new photos to &quot;Palo Alto Summer&quot;.
          </li>
        </ul>
      </div>
    </aside>
  );
}
