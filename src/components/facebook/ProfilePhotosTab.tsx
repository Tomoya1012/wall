"use client";

import React from "react";
import { ImageIcon } from "lucide-react";

export function ProfilePhotosTab() {
  const albums = [
    {
      title: "Harvard Days (2004)",
      count: "18 photos",
      cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "Palo Alto Summer House (2005)",
      count: "32 photos",
      cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "F8 Developer Conference (2007)",
      count: "24 photos",
      cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop&q=80",
    },
    {
      title: "Wall Photos",
      count: "14 photos",
      cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="bg-white border border-[#d8dfea] p-4 font-tahoma text-xs space-y-4">
      <div className="border-b border-[#3b5998] pb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#3b5998] flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" /> Photo Albums (4)
        </h2>
        <span className="text-[11px] text-[#3b5998] hover:underline cursor-pointer">
          Upload New Photos
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {albums.map((album) => (
          <div key={album.title} className="text-center group cursor-pointer">
            <div className="border-2 border-[#d8dfea] p-1 bg-white shadow-sm group-hover:border-[#3b5998] transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-28 object-cover"
              />
            </div>
            <h3 className="font-bold text-[#3b5998] group-hover:underline mt-1.5 text-[11px] truncate">
              {album.title}
            </h3>
            <p className="text-[10px] text-[#777]">{album.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
