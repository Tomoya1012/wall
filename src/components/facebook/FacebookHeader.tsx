"use client";

import React, { useState } from "react";
import { Search, Database, CheckCircle2, AlertCircle, Radio } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface FacebookHeaderProps {
  onOpenSupabaseModal: () => void;
  isRealtimeActive?: boolean;
}

export function FacebookHeader({ onOpenSupabaseModal, isRealtimeActive = false }: FacebookHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-[#3b5998] border-b border-[#29447e] text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[980px] mx-auto px-4 h-[42px] flex items-center justify-between">
        {/* Left: Vintage facebook wordmark & search */}
        <div className="flex items-center space-x-6">
          <a
            href="/"
            className="text-[26px] font-extrabold tracking-tight font-sans text-white hover:opacity-95 leading-none select-none"
            style={{ fontFamily: '"Klavika", "Lucida Grande", Tahoma, sans-serif', letterSpacing: "-1px" }}
          >
            facebook
          </a>

          {/* Search box */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="bg-[#29447e] text-white placeholder-blue-200/70 text-xs px-2 py-1 pr-6 rounded-[2px] border border-[#1d3361] focus:outline-none focus:bg-white focus:text-[#333] focus:placeholder-gray-400 w-44 md:w-56 transition-colors"
            />
            <Search className="w-3.5 h-3.5 absolute right-1.5 top-1.5 text-blue-200 pointer-events-none" />
          </div>
        </div>

        {/* Right: Vintage navigation tabs & DB Status */}
        <div className="flex items-center space-x-1 sm:space-x-3 text-xs font-bold">
          <nav className="flex items-center space-x-2 sm:space-x-4 text-blue-100">
            <a href="#wall" className="hover:text-white hover:underline py-1">
              Home
            </a>
            <a href="#profile" className="text-white hover:underline py-1 underline">
              Profile
            </a>
            <a href="#friends" className="hover:text-white hover:underline py-1 hidden sm:inline">
              Friends
            </a>
            <a href="#inbox" className="hover:text-white hover:underline py-1 flex items-center gap-1">
              Inbox
              <span className="bg-[#d8dfea] text-[#3b5998] px-1 text-[10px] rounded font-bold">
                1
              </span>
            </a>
          </nav>

          <span className="text-blue-300/40 hidden sm:inline">|</span>

          {/* Supabase Status Pill / Launcher */}
          <button
            onClick={onOpenSupabaseModal}
            title={
              isSupabaseConfigured
                ? "Connected to live Supabase DB"
                : "Running in local storage fallback mode - click to configure Supabase"
            }
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
              isSupabaseConfigured
                ? "bg-[#29447e] border-[#1d3361] text-emerald-200 hover:bg-[#233a6b]"
                : "bg-[#4a6bb4] border-[#29447e] text-amber-200 hover:bg-[#4362a4]"
            }`}
          >
            <Database className="w-3 h-3" />
            <span className="hidden md:inline">
              {isSupabaseConfigured ? "Supabase Live" : "Demo Mode"}
            </span>
            {isRealtimeActive ? (
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-300">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                <span className="hidden lg:inline">Realtime</span>
              </span>
            ) : isSupabaseConfigured ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-amber-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
