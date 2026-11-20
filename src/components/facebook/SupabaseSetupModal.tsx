"use client";

import React, { useState } from "react";
import {
  Database,
  Check,
  Copy,
  ExternalLink,
  X,
  Server,
  Zap,
  Globe,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseSetupModal({ isOpen, onClose }: SupabaseSetupModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- 1. Create posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_name text not null default 'Anonymous Friend',
  message text not null check (char_length(message) <= 280),
  created_at timestamptz not null default now(),
  photo_url text,
  avatar_url text,
  likes_count integer not null default 0
);

-- 2. Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- 3. Public read & write policies
create policy "Public read" on public.posts for select using (true);
create policy "Public insert" on public.posts for insert with check (true);
create policy "Public update" on public.posts for update using (true);
create policy "Public delete" on public.posts for delete using (true);

-- 4. Enable Supabase Realtime
alter publication supabase_realtime add table public.posts;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-[#3b5998] rounded-[3px] shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col font-tahoma overflow-hidden">
        {/* Modal Title bar */}
        <div className="bg-[#3b5998] text-white px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-300" />
            <h2 className="text-xs sm:text-sm font-bold">
              Supabase Database &amp; Vercel Deployment Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-0.5 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-[#333333]">
          {/* Current Connection Status Box */}
          <div
            className={`p-3 rounded border flex items-center justify-between ${
              isSupabaseConfigured
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              <div>
                <strong className="block text-[12px]">
                  {isSupabaseConfigured
                    ? "Supabase Live Connected!"
                    : "Demo Mode Active (Local Storage Fallback)"}
                </strong>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  {isSupabaseConfigured
                    ? "All posts and realtime events are streaming to/from your live Supabase database."
                    : "Your app is currently running seamlessly in local offline mode until your Supabase keys are added."}
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                isSupabaseConfigured
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-600 text-white"
              }`}
            >
              {isSupabaseConfigured ? "ONLINE" : "DEMO"}
            </span>
          </div>

          {/* Quick Setup Steps */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#3b5998] text-xs border-b border-[#d8dfea] pb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Connecting your Supabase Project (3-Step Checklist)
            </h3>

            <ol className="list-decimal list-inside space-y-2 text-[11px] text-[#444]">
              <li>
                <strong>Create Supabase Project:</strong> Go to{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#3b5998] underline inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="w-2.5 h-2.5" />
                </a>{" "}
                and create a free project.
              </li>
              <li>
                <strong>Run Database SQL Script:</strong> In your Supabase dashboard, open the <strong>SQL Editor</strong>, paste the script below, and click <strong>Run</strong>:
              </li>
            </ol>

            {/* SQL Snippet with Copy Button */}
            <div className="relative bg-[#1e293b] text-slate-100 rounded p-2.5 font-mono text-[11px] overflow-x-auto">
              <button
                onClick={copySql}
                className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied SQL!" : "Copy SQL"}
              </button>
              <pre className="pr-20 text-[10.5px] leading-relaxed select-all">
                {sqlCode}
              </pre>
            </div>

            <ol start={3} className="list-decimal list-inside space-y-2 text-[11px] text-[#444]">
              <li>
                <strong>Set Environment Variables in <code>.env.local</code> (or on Vercel):</strong>
                <div className="mt-1 bg-slate-50 border border-slate-200 p-2 font-mono text-[10.5px] rounded space-y-1">
                  <div>NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...</div>
                </div>
              </li>
            </ol>
          </div>

          {/* Vercel Deployment Instructions */}
          <div className="bg-[#f0f4f9] border border-[#c4d6ee] p-3 rounded space-y-2 text-[11px]">
            <h4 className="font-bold text-[#3b5998] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Deploying on Vercel
            </h4>
            <p className="text-gray-700 leading-relaxed">
              1. Push this repository to your GitHub account.<br />
              2. Import the project in Vercel.<br />
              3. In the <strong>Environment Variables</strong> section, paste your <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.<br />
              4. Click <strong>Deploy</strong> and enjoy your live nostalgic 2008 Facebook Wall!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#eceff5] px-4 py-2 border-t border-[#d8dfea] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#3b5998] hover:bg-[#2b4170] text-white px-4 py-1 text-xs font-bold rounded-[2px]"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
